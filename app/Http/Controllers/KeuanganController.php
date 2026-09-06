<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Pembayaran;
use App\Models\Pengeluaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class KeuanganController extends Controller
{
    public function index()
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        $omzet = Pembayaran::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->sum('jumlah');
        $kasKeluar = Pengeluaran::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->sum('jumlah');
        $piutang = Order::where('sisa_bayar', '>', 0)->sum('sisa_bayar');
        $labaBersih = $omzet - $kasKeluar;

        $recentPembayarans = Pembayaran::with(['order.customer', 'pencatat'])->latest()->take(5)->get();
        $recentPengeluarans = Pengeluaran::with(['pencatat'])->latest()->take(5)->get();

        // Piutang Menunggak (sisa_bayar > 0), ordered by tanggal_order ASC to get the oldest
        $piutangMenunggak = Order::where('sisa_bayar', '>', 0)
            ->with('customer')
            ->orderBy('tanggal_order', 'asc')
            ->take(3)
            ->get()
            ->map(function ($order) {
                $days = (int) Carbon::parse($order->tanggal_order)->diffInDays(Carbon::now());
                return [
                    'id' => $order->id,
                    'no_order' => $order->no_order,
                    'customer' => $order->customer->nama ?? 'Unknown',
                    'sisa_bayar' => $order->sisa_bayar,
                    'hari' => $days
                ];
            });

        // Kontribusi Omzet Tertinggi
        $topOmzet = Order::whereBetween('tanggal_order', [$startOfMonth, $endOfMonth])
            ->with('customer')
            ->orderBy('total_harga', 'desc')
            ->take(3)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'no_order' => $order->no_order,
                    'customer' => $order->customer->nama ?? 'Unknown',
                    'total_harga' => $order->total_harga
                ];
            });

        // Arus Kas 7 Hari Terakhir
        $arusKas = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->toDateString();
            $pemasukan = Pembayaran::whereDate('tanggal', $date)->sum('jumlah');
            $pengeluaran = Pengeluaran::whereDate('tanggal', $date)->sum('jumlah');
            
            $arusKas->push([
                'date' => Carbon::parse($date)->format('d M'),
                'pemasukan' => $pemasukan,
                'pengeluaran' => $pengeluaran
            ]);
        }

        return Inertia::render('Keuangan/Index', [
            'omzet' => (float) $omzet,
            'kasKeluar' => (float) $kasKeluar,
            'piutang' => (float) $piutang,
            'labaBersih' => (float) $labaBersih,
            'recentPembayarans' => $recentPembayarans,
            'recentPengeluarans' => $recentPengeluarans,
            'piutangMenunggak' => $piutangMenunggak,
            'topOmzet' => $topOmzet,
            'arusKas' => $arusKas
        ]);
    }

    public function pembayaranIndex(Request $request)
    {
        $query = Pembayaran::with(['order.customer', 'pencatat'])->latest();

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tanggal', [$request->start_date, $request->end_date]);
        }

        $pembayarans = $query->paginate(15)->withQueryString();
        $orders = Order::where('sisa_bayar', '>', 0)->with('customer')->get();

        return Inertia::render('Keuangan/Pembayaran', [
            'pembayarans' => $pembayarans,
            'orders' => $orders
        ]);
    }

    public function pembayaranStore(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'jumlah' => 'required|numeric|min:1',
            'tanggal' => 'required|date',
            'metode' => 'required|string',
            'tipe' => 'required|string',
            'catatan' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            $order = Order::lockForUpdate()->findOrFail($validated['order_id']);
            
            $pembayaran = new Pembayaran($validated);
            $pembayaran->dicatat_oleh = auth()->id();
            $pembayaran->save();

            $order->sisa_bayar = max(0, $order->sisa_bayar - $validated['jumlah']);
            $order->save();
        });

        return back()->with('success', 'Pembayaran berhasil dicatat.');
    }

    public function pembayaranKwitansi(Pembayaran $pembayaran)
    {
        $pembayaran->load(['order.customer', 'pencatat']);
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.kwitansi', compact('pembayaran'));
        return $pdf->stream("KWITANSI-{$pembayaran->order->no_order}-{$pembayaran->id}.pdf");
    }

    public function pengeluaranIndex(Request $request)
    {
        $query = Pengeluaran::with(['pencatat'])->latest('tanggal')->latest('id');

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tanggal', [$request->start_date, $request->end_date]);
        }

        $pengeluarans = $query->paginate(15)->withQueryString();

        return Inertia::render('Keuangan/Pengeluaran', [
            'pengeluarans' => $pengeluarans
        ]);
    }

    public function pengeluaranStore(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'kategori' => 'required|string',
            'deskripsi' => 'required|string',
            'jumlah' => 'required|numeric|min:1',
            'order_id' => 'nullable|exists:orders,id'
        ]);

        $pengeluaran = new Pengeluaran($validated);
        $pengeluaran->dicatat_oleh = auth()->id();
        $pengeluaran->save();

        return back()->with('success', 'Pengeluaran berhasil dicatat.');
    }

    public function laporanLabaRugi(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());

        $pendapatan = Pembayaran::whereBetween('tanggal', [$startDate, $endDate])->sum('jumlah');
        $biaya = Pengeluaran::whereBetween('tanggal', [$startDate, $endDate])->sum('jumlah');
        $laba = $pendapatan - $biaya;

        $piutangCustomer = Order::where('sisa_bayar', '>', 0)
            ->with('customer')
            ->get()
            ->groupBy('customer_id')
            ->map(function ($orders) {
                return [
                    'customer' => $orders->first()->customer->nama ?? 'Unknown',
                    'total_piutang' => $orders->sum('sisa_bayar')
                ];
            })->values();

        return Inertia::render('Keuangan/Laporan', [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'pendapatan' => (float) $pendapatan,
            'biaya' => (float) $biaya,
            'laba' => (float) $laba,
            'piutangCustomer' => $piutangCustomer
        ]);
    }
}
