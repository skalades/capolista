<?php

namespace App\Http\Controllers;

use App\Models\Desain;
use App\Models\Order;
use App\Models\OrderLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DesainController extends Controller
{
        public function index(Request $request)
    {
        $user = $request->user();
        if ($user->level_akses === 4 && $user->divisi !== 'desain' && $user->level_akses !== 3) {
            abort(403, 'Anda tidak memiliki akses ke modul Desain.');
        }

        $orders = Order::with(['customer', 'desain'])
            ->where(fn($q) => $q->where('status', 'desain')
                ->orWhereHas('desain')
            )
            ->when($request->search, fn($q, $s) =>
                $q->where('no_order', 'like', "%{$s}%")
                  ->orWhereHas('customer', fn($q2) => $q2->where('nama', 'like', "%{$s}%"))
            )
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Desain/Index', [
            'orders'  => $orders,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['customer', 'desain.pekerja', 'desain.penyetuju', 'orderLogs.user', 'orderFiles']);
        return Inertia::render('Desain/Show', ['order' => $order]);
    }

    public function uploadMockup(Request $request, Order $order)
    {
        $request->validate([
            'file_mockup' => 'required|file|max:20480|mimes:jpg,jpeg,png,pdf,ai,psd,webp,zip',
        ]);

        $path    = $request->file('file_mockup')->store('uploads/desain', 'public');
        $desain  = $order->desain;

        if ($desain) {
            // Increment versi jika sudah ada
            $desain->update([
                'file_mockup' => $path,
                'versi'       => $desain->versi + 1,
                'status'      => 'dikerjakan',
                'dikerjakan_oleh' => auth()->id(),
            ]);
        } else {
            Desain::create([
                'order_id'        => $order->id,
                'versi'           => 1,
                'file_mockup'     => $path,
                'status'          => 'dikerjakan',
                'dikerjakan_oleh' => auth()->id(),
            ]);
        }

        return back()->with('success', 'Mockup berhasil diupload.');
    }

    public function update(Request $request, Desain $desain)
    {
        $request->validate([
            'status'         => 'required|in:menunggu,dikerjakan,revisi,disetujui',
            'catatan_revisi' => 'nullable|string',
        ]);

        $desain->update($request->only(['status', 'catatan_revisi']));
        return back()->with('success', 'Status desain diperbarui.');
    }

    public function approve(Request $request, Desain $desain)
    {
        $desain->update([
            'status'       => 'disetujui',
            'disetujui_oleh' => auth()->id(),
            'disetujui_at'   => now(),
        ]);

        // Pindah order ke produksi
        $order = $desain->order;
        $order->update(['status' => Order::STATUS_PRODUKSI]);

        OrderLog::create([
            'order_id'    => $order->id,
            'user_id'     => auth()->id(),
            'status_lama' => Order::STATUS_DESAIN,
            'status_baru' => Order::STATUS_PRODUKSI,
            'catatan'     => 'Desain disetujui',
        ]);

        return back()->with('success', 'Desain disetujui. Order lanjut ke tahap Produksi.');
    }

    public function reject(Request $request, Desain $desain)
    {
        $request->validate(['catatan_revisi' => 'required|string']);

        $desain->update([
            'status'         => 'revisi',
            'catatan_revisi' => $request->catatan_revisi,
        ]);

        return back()->with('success', 'Desain dikembalikan untuk revisi.');
    }
}


