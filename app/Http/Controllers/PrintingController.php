<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderLog;
use App\Models\Printing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PrintingController extends Controller
{
        public function index(Request $request)
    {
        $user = $request->user();
        if ($user->level_akses === 4 && $user->divisi !== 'printing' && $user->level_akses !== 3) {
            abort(403, 'Anda tidak memiliki akses ke modul Printing.');
        }

        $orders = Order::with(['customer', 'printing'])
            ->where('status', Order::STATUS_PRINTING)
            ->when($request->search, fn($q, $s) =>
                $q->where('no_order', 'like', "%{$s}%")
                  ->orWhereHas('customer', fn($q2) => $q2->where('nama', 'like', "%{$s}%"))
            )
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Printing/Index', [
            'orders'  => $orders,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Order $order)
    {
        if (!$order->printing) {
            $order->printing()->create();
        }
        $order->load(['customer', 'printing.pekerja', 'orderLogs.user']);
        return Inertia::render('Printing/Show', ['order' => $order]);
    }

    public function update(Request $request, Printing $printing)
    {
        $request->validate([
            'metode_cetak'    => 'required|in:sablon,dtf,dtg',
            'jumlah_warna'    => 'nullable|integer|min:1',
            'estimasi_selesai'=> 'nullable|date',
            'tanggal_mulai'   => 'nullable|date',
        ]);

        $printing->update([
            ...$request->only(['metode_cetak', 'jumlah_warna', 'estimasi_selesai', 'tanggal_mulai']),
            'status'           => 'proses',
            'dikerjakan_oleh'  => auth()->id(),
        ]);

        return back()->with('success', 'Detail printing diperbarui.');
    }

    public function complete(Request $request, Printing $printing)
    {
        $request->validate([
            'status_qc'    => 'required|in:lulus,gagal',
            'catatan_qc'   => 'nullable|string',
            'foto_qc'      => 'nullable|file|max:5120|mimes:jpg,jpeg,png,webp',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto_qc')) {
            $fotoPath = $request->file('foto_qc')->store('uploads/qc/printing', 'public');
        }

        $printing->update([
            'tanggal_selesai' => now()->toDateString(),
            'status'          => 'selesai',
            'status_qc'       => $request->status_qc,
            'catatan_qc'      => $request->catatan_qc,
            'foto_qc'         => $fotoPath ?? $printing->foto_qc,
        ]);

        if ($request->status_qc === 'lulus') {
            $order = $printing->order;
            $order->update(['status' => Order::STATUS_PEMASANGAN]);

            \App\Models\Pemasangan::firstOrCreate(['order_id' => $order->id]);

            OrderLog::create([
                'order_id'    => $order->id,
                'user_id'     => auth()->id(),
                'status_lama' => Order::STATUS_PRINTING,
                'status_baru' => Order::STATUS_PEMASANGAN,
                'catatan'     => 'QC Printing lulus. Lanjut ke Pemasangan.',
            ]);
        }

        return back()->with('success', 'Printing selesai. QC: ' . strtoupper($request->status_qc));
    }
}


