<?php

namespace App\Http\Controllers;

use App\Helpers\OrderHelper;
use App\Models\Customer;
use App\Models\Desain;
use App\Models\Order;
use App\Models\OrderFile;
use App\Models\OrderLog;
use App\Models\Packing;
use App\Models\Pemasangan;
use App\Models\Printing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('customer')
            ->when($request->search, fn($q, $s) =>
                $q->where('no_order', 'like', "%{$s}%")
                  ->orWhereHas('customer', fn($q2) => $q2->where('nama', 'like', "%{$s}%"))
            )
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->deadline_from, fn($q, $d) => $q->where('deadline', '>=', $d))
            ->when($request->deadline_to, fn($q, $d) => $q->where('deadline', '<=', $d))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Orders/Index', [
            'orders'  => $query,
            'filters' => $request->only(['search', 'status', 'deadline_from', 'deadline_to']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Orders/Create', [
            'customers' => Customer::orderBy('nama')->get(['id', 'nama', 'kontak']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id'     => 'required|exists:customers,id',
            'jenis_produk'    => 'required|string|max:255',
            'jumlah'          => 'required|integer|min:1',
            'ukuran_detail'   => 'nullable|array',
            'tanggal_order'   => 'required|date',
            'deadline'        => 'required|date|after_or_equal:tanggal_order',
            'total_harga'     => 'required|numeric|min:0',
            'dp'              => 'nullable|numeric|min:0',
            'catatan_desain'  => 'nullable|string',
            'catatan'         => 'nullable|string',
        ]);

        $dp = $validated['dp'] ?? 0;

        $order = Order::create([
            ...$validated,
            'no_order'    => OrderHelper::generateNoOrder(),
            'status'      => Order::STATUS_DRAFT,
            'dp'          => $dp,
            'sisa_bayar'  => $validated['total_harga'] - $dp,
            'created_by'  => auth()->id(),
        ]);

        OrderLog::create([
            'order_id'   => $order->id,
            'user_id'    => auth()->id(),
            'status_lama'=> null,
            'status_baru'=> Order::STATUS_DRAFT,
            'catatan'    => 'Order dibuat',
        ]);

        return redirect()->route('orders.show', $order)
            ->with('success', "Order {$order->no_order} berhasil dibuat.");
    }

    public function show(Order $order)
    {
        $order->load([
            'customer',
            'orderLogs.user',
            'desain.pekerja',
            'desain.penyetuju',
            'printing.pekerja',
            'pemasangan.pekerja',
            'packing.pekerja',
            'orderFiles.uploader',
        ]);

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

    public function edit(Order $order)
    {
        return Inertia::render('Orders/Edit', [
            'order'     => $order->load('customer'),
            'customers' => Customer::orderBy('nama')->get(['id', 'nama', 'kontak']),
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'customer_id'    => 'required|exists:customers,id',
            'jenis_produk'   => 'required|string|max:255',
            'jumlah'         => 'required|integer|min:1',
            'ukuran_detail'  => 'nullable|array',
            'tanggal_order'  => 'required|date',
            'deadline'       => 'required|date',
            'total_harga'    => 'required|numeric|min:0',
            'dp'             => 'nullable|numeric|min:0',
            'catatan_desain' => 'nullable|string',
            'catatan'        => 'nullable|string',
        ]);

        $dp = $validated['dp'] ?? $order->dp;
        $order->update([
            ...$validated,
            'dp'         => $dp,
            'sisa_bayar' => $validated['total_harga'] - $dp,
        ]);

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order berhasil diperbarui.');
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status'  => 'required|string',
            'catatan' => 'nullable|string',
        ]);

        $statusLama = $order->status;
        $statusBaru = $request->status;

        $order->update(['status' => $statusBaru]);

        OrderLog::create([
            'order_id'    => $order->id,
            'user_id'     => auth()->id(),
            'status_lama' => $statusLama,
            'status_baru' => $statusBaru,
            'catatan'     => $request->catatan,
        ]);

        // Buat record divisi jika belum ada
        if ($statusBaru === Order::STATUS_DESAIN && !$order->desain) {
            Desain::create(['order_id' => $order->id, 'versi' => 1, 'dikerjakan_oleh' => auth()->id()]);
        }
        if ($statusBaru === Order::STATUS_PRINTING && !$order->printing) {
            Printing::create(['order_id' => $order->id]);
        }
        if ($statusBaru === Order::STATUS_PEMASANGAN && !$order->pemasangan) {
            Pemasangan::create(['order_id' => $order->id]);
        }
        if ($statusBaru === Order::STATUS_PACKING && !$order->packing) {
            Packing::create(['order_id' => $order->id]);
        }

        return back()->with('success', 'Status order berhasil diperbarui.');
    }

    public function uploadFile(Request $request, Order $order)
    {
        $request->validate([
            'file' => 'required|file|max:10240|mimes:jpg,jpeg,png,pdf,ai,psd,zip,webp',
            'tipe' => 'required|in:desain,referensi,bukti_bayar,qc,lainnya',
        ]);

        $file  = $request->file('file');
        $path  = $file->store("uploads/{$request->tipe}", 'public');

        OrderFile::create([
            'order_id'    => $order->id,
            'tipe'        => $request->tipe,
            'nama_file'   => $file->getClientOriginalName(),
            'path'        => $path,
            'uploaded_by' => auth()->id(),
        ]);

        return back()->with('success', 'File berhasil diupload.');
    }

    public function deleteFile(OrderFile $file)
    {
        Storage::disk('public')->delete($file->path);
        $file->delete();
        return back()->with('success', 'File berhasil dihapus.');
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return redirect()->route('orders.index')
            ->with('success', "Order {$order->no_order} berhasil dihapus.");
    }

    public function printSpk(Order $order)
    {
        $order->load(['customer', 'creator']);
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.spk', compact('order'));
        return $pdf->stream("SPK-{$order->no_order}.pdf");
    }

    public function printInvoice(Order $order)
    {
        $order->load(['customer', 'creator']);
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.invoice', compact('order'));
        return $pdf->stream("INVOICE-{$order->no_order}.pdf");
    }
}

