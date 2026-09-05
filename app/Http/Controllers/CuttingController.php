<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderLog;
use App\Models\ProduksiCutting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CuttingController extends Controller
{
    /**
     * Daftar order yang siap dikerjakan divisi cutting.
     * Order dengan status 'cutting' (sudah selesai procurement/desain).
     */
    public function index(Request $request)
    {
        $query = Order::with(['customer', 'cutting.pekerja', 'orderLogs.user', 'orderFiles', 'items'])
            ->whereIn('status', [Order::STATUS_CUTTING])
            ->latest();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('no_order', 'like', "%{$request->search}%")
                  ->orWhereHas('customer', fn ($c) => $c->where('nama', 'like', "%{$request->search}%"));
            });
        }

        $orders = $query->get();

        // Statistik
        $stats = [
            'menunggu'   => Order::where('status', Order::STATUS_CUTTING)
                ->whereDoesntHave('cutting', fn ($q) => $q->where('status', ProduksiCutting::STATUS_DIKERJAKAN)
                    ->orWhere('status', ProduksiCutting::STATUS_SELESAI))->count(),
            'dikerjakan' => ProduksiCutting::where('status', ProduksiCutting::STATUS_DIKERJAKAN)->count(),
            'selesai_hari_ini' => ProduksiCutting::where('status', ProduksiCutting::STATUS_SELESAI)
                ->whereDate('selesai_at', today())->count(),
        ];

        return Inertia::render('Cutting/Index', [
            'orders'  => $orders,
            'stats'   => $stats,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Detail order untuk proses cutting.
     */
    public function show(Order $order)
    {
        $order->load(['customer', 'cutting.pekerja', 'orderLogs.user', 'orderFiles', 'items']);

        return Inertia::render('Cutting/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Mulai proses cutting (ubah status cutting ke 'dikerjakan').
     */
    public function mulai(Request $request, Order $order)
    {
        if ($order->status !== Order::STATUS_CUTTING) {
            return back()->with('error', 'Order tidak dalam status Cutting.');
        }

        DB::transaction(function () use ($order, $request) {
            $cutting = $order->cutting ?? ProduksiCutting::create([
                'order_id' => $order->id,
                'status'   => ProduksiCutting::STATUS_MENUNGGU,
            ]);

            $cutting->update([
                'status'          => ProduksiCutting::STATUS_DIKERJAKAN,
                'dikerjakan_oleh' => auth()->id(),
                'tanggal'         => today(),
            ]);
        });

        return back()->with('success', 'Proses cutting dimulai.');
    }

    /**
     * Update output cutting (input pcs per ukuran + QC checklist).
     */
    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'pcs_per_ukuran'    => 'required|array',
            'pcs_per_ukuran.*'  => 'nullable|integer|min:0',
            'qc_akurasi_ukuran' => 'boolean',
            'qc_arah_kain'      => 'boolean',
            'qc_tidak_cacat'    => 'boolean',
            'catatan_qc'        => 'nullable|string|max:1000',
            'catatan'           => 'nullable|string|max:1000',
        ]);

        $cutting = $order->cutting ?? ProduksiCutting::create([
            'order_id'        => $order->id,
            'status'          => ProduksiCutting::STATUS_DIKERJAKAN,
            'dikerjakan_oleh' => auth()->id(),
            'tanggal'         => today(),
        ]);

        $totalPcs = array_sum(array_filter($validated['pcs_per_ukuran'], fn ($v) => is_numeric($v)));

        $cutting->update([
            ...$validated,
            'total_pcs' => $totalPcs,
        ]);

        return back()->with('success', 'Data cutting diperbarui.');
    }

    /**
     * Selesaikan proses cutting dan lanjutkan ke Divisi Jahit.
     */
    public function complete(Request $request, Order $order)
    {
        if ($order->status !== Order::STATUS_CUTTING) {
            return back()->with('error', 'Order tidak dalam status Cutting.');
        }

        $cutting = $order->cutting;
        if (!$cutting || $cutting->total_pcs <= 0) {
            return back()->with('error', 'Data output cutting belum diisi. Isi pcs per ukuran terlebih dahulu.');
        }

        DB::transaction(function () use ($order, $cutting) {
            $cutting->update([
                'status'    => ProduksiCutting::STATUS_SELESAI,
                'selesai_at' => now(),
            ]);

            $order->update(['status' => Order::STATUS_JAHIT]);

            OrderLog::create([
                'order_id'    => $order->id,
                'user_id'     => auth()->id(),
                'status_lama' => Order::STATUS_CUTTING,
                'status_baru' => Order::STATUS_JAHIT,
                'catatan'     => "Selesai cutting. Total pcs: {$cutting->total_pcs}",
            ]);
        });

        return redirect()->route('cutting.index')
            ->with('success', "Order #{$order->no_order} selesai cutting → dilanjutkan ke Divisi Jahit.");
    }
}
