<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
// Use other models as needed

class LaporanController extends Controller
{
    /**
     * Halaman laporan, pilih jenis laporan
     */
    public function index()
    {
        return Inertia::render('Laporan/Index');
    }

    /**
     * Laporan produksi per periode (order selesai, rata-rata waktu)
     */
    public function produksi(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate   = $request->input('end_date', now()->endOfMonth()->toDateString());

        $orders = Order::with('customer')
            ->where('status', Order::STATUS_SELESAI)
            ->whereBetween('updated_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->get();

        $totalSelesai = $orders->count();
        $onTime = 0;
        $terlambat = 0;
        $totalDurasi = 0;

        foreach ($orders as $order) {
            $selesaiDate = \Carbon\Carbon::parse($order->updated_at);
            $deadline = \Carbon\Carbon::parse($order->deadline);
            
            if ($selesaiDate->startOfDay()->lte($deadline->startOfDay())) {
                $onTime++;
            } else {
                $terlambat++;
            }

            $orderDate = \Carbon\Carbon::parse($order->tanggal_order);
            $totalDurasi += $selesaiDate->diffInDays($orderDate);
        }

        return Inertia::render('Laporan/Produksi', [
            'filters' => ['start_date' => $startDate, 'end_date' => $endDate],
            'orders' => $orders,
            'stats' => [
                'total_selesai' => $totalSelesai,
                'avg_durasi_hari' => $totalSelesai > 0 ? round($totalDurasi / $totalSelesai, 1) : 0,
                'on_time' => $onTime,
                'terlambat' => $terlambat
            ]
        ]);
    }

    /**
     * Laporan keuangan (omzet, piutang, biaya)
     */
    public function keuangan(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate   = $request->input('end_date', now()->endOfMonth()->toDateString());

        $omzet = \App\Models\Pembayaran::whereBetween('tanggal', [$startDate, $endDate])->sum('jumlah');
        $biayaOperasional = \App\Models\Pengeluaran::whereBetween('tanggal', [$startDate, $endDate])->sum('nominal');
        $biayaGaji = \App\Models\Penggajian::whereIn('status_bayar', [\App\Models\Penggajian::STATUS_DISETUJUI, \App\Models\Penggajian::STATUS_DIBAYAR])
            ->whereBetween('periode_selesai', [$startDate, $endDate])->sum('total_upah_bersih');
        
        $totalBiaya = $biayaOperasional + $biayaGaji;

        $piutangOrders = Order::with('customer')
            ->where('sisa_bayar', '>', 0)
            ->where('status', '!=', Order::STATUS_SELESAI) // Or keep it if you want all piutang
            ->get();

        return Inertia::render('Laporan/Keuangan', [
            'filters' => ['start_date' => $startDate, 'end_date' => $endDate],
            'rekap' => [
                'omzet' => (float) $omzet,
                'total_biaya' => (float) $totalBiaya,
                'laba_kotor' => (float) ($omzet - $totalBiaya),
            ],
            'piutang' => $piutangOrders
        ]);
    }

    /**
     * Laporan performa per divisi
     */
    public function divisi(Request $request)
    {
        return Inertia::render('Laporan/Divisi', [
            'filters' => $request->only(['start_date', 'end_date']),
            'performa_divisi' => [
                // example
                // 'desain' => ['diproses' => 0, 'avg_waktu' => 0, 'terlambat' => 0]
            ]
        ]);
    }

    /**
     * Rekap hasil opname
     */
    public function stokOpname(Request $request)
    {
        $opnameList = \App\Models\StokOpname::with(['pembuat', 'penyetuju', 'items'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Laporan/StokOpname', [
            'opnameList' => $opnameList,
            'filters'    => $request->only(['start_date', 'end_date']),
        ]);
    }

    /**
     * Laporan penggajian (total biaya tenaga kerja per periode, per divisi)
     */
    public function penggajian(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate   = $request->input('end_date', now()->endOfMonth()->toDateString());
        $divisi    = $request->input('divisi', '');

        $query = \App\Models\Penggajian::with(['karyawan'])
            ->whereIn('status_bayar', [\App\Models\Penggajian::STATUS_DISETUJUI, \App\Models\Penggajian::STATUS_DIBAYAR])
            ->whereBetween('periode_selesai', [$startDate, $endDate]);

        if ($divisi) {
            $query->whereHas('karyawan', fn ($q) => $q->where('divisi', $divisi));
        }

        $penggajians = $query->latest('periode_selesai')->get();

        $summary = [
            'total_karyawan'    => $penggajians->count(),
            'total_upah_bersih' => (float) $penggajians->sum('total_upah_bersih'),
            'per_tipe_gaji'     => $penggajians->groupBy('tipe_gaji')->map(fn ($g) => [
                'count' => $g->count(),
                'total' => (float) $g->sum('total_upah_bersih'),
            ]),
            'per_divisi'        => $penggajians->groupBy(fn ($p) => $p->karyawan->divisi ?? '-')->map(fn ($g) => [
                'count' => $g->count(),
                'total' => (float) $g->sum('total_upah_bersih'),
            ]),
        ];

        return Inertia::render('Laporan/Penggajian', [
            'penggajians' => $penggajians,
            'summary'     => $summary,
            'divisiList'  => \App\Models\User::DIVISI_LIST,
            'filters'     => ['start_date' => $startDate, 'end_date' => $endDate, 'divisi' => $divisi],
        ]);
    }
}
