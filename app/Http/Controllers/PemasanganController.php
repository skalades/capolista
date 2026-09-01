<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderLog;
use App\Models\Packing;
use App\Models\Pemasangan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PemasanganController extends Controller
{
        public function index(Request $request)
    {
        $user = $request->user();
        if ($user->level_akses === 4 && $user->divisi !== 'pemasangan' && $user->level_akses !== 3) {
            abort(403, 'Anda tidak memiliki akses ke modul Pemasangan.');
        }

        $orders = Order::with(['customer', 'pemasangan'])
            ->where('status', Order::STATUS_PEMASANGAN)
            ->when($request->search, fn($q, $s) =>
                $q->where('no_order', 'like', "%{$s}%")
                  ->orWhereHas('customer', fn($q2) => $q2->where('nama', 'like', "%{$s}%"))
            )
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Pemasangan/Index', [
            'orders'  => $orders,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['customer', 'pemasangan.pekerja', 'orderLogs.user']);
        return Inertia::render('Pemasangan/Show', ['order' => $order]);
    }

    public function update(Request $request, Pemasangan $pemasangan)
    {
        $request->validate([
            'suhu_heat_press' => 'nullable|string|max:50',
            'waktu_curing'    => 'nullable|string|max:50',
        ]);

        $pemasangan->update([
            ...$request->only(['suhu_heat_press', 'waktu_curing']),
            'status'          => 'proses',
            'dikerjakan_oleh' => auth()->id(),
        ]);

        return back()->with('success', 'Parameter pemasangan diperbarui.');
    }

    public function complete(Request $request, Pemasangan $pemasangan)
    {
        $request->validate([
            'checklist_qc' => 'nullable|array',
            'status_qc'    => 'required|in:lulus,gagal',
            'catatan'      => 'nullable|string',
            'foto_qc'      => 'nullable|file|max:5120|mimes:jpg,jpeg,png,webp',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto_qc')) {
            $fotoPath = $request->file('foto_qc')->store('uploads/qc/pemasangan', 'public');
        }

        $pemasangan->update([
            'checklist_qc'    => $request->checklist_qc,
            'status'          => 'selesai',
            'status_qc'       => $request->status_qc,
            'catatan'         => $request->catatan,
            'foto_qc'         => $fotoPath ?? $pemasangan->foto_qc,
        ]);

        if ($request->status_qc === 'lulus') {
            $order = $pemasangan->order;
            $order->update(['status' => Order::STATUS_PACKING]);

            Packing::firstOrCreate(['order_id' => $order->id]);

            OrderLog::create([
                'order_id'    => $order->id,
                'user_id'     => auth()->id(),
                'status_lama' => Order::STATUS_PEMASANGAN,
                'status_baru' => Order::STATUS_PACKING,
                'catatan'     => 'QC Pemasangan lulus. Lanjut ke Packing.',
            ]);
        }

        return back()->with('success', 'Pemasangan selesai. QC: ' . strtoupper($request->status_qc));
    }
}


