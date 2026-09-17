<?php

namespace App\Http\Controllers;

use App\Helpers\OrderHelper;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Services\OrderService;
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
    public function __construct(private OrderService $orderService)
    {
    }
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
            ->when($request->filter_deadline, function ($q, $filter) {
                $today = \Carbon\Carbon::today();
                if ($filter === 'lewat') {
                    return $q->where('deadline', '<', $today)->whereNotIn('status', ['selesai', 'dikirim']);
                }
                if ($filter === 'hari_ini') {
                    return $q->whereDate('deadline', $today);
                }
                if ($filter === 'mendekati') {
                    // Mendekati deadline: hari ini sampai 3 hari ke depan
                    return $q->whereBetween('deadline', [$today, $today->copy()->addDays(3)])->whereNotIn('status', ['selesai', 'dikirim']);
                }
            })
            ->when($request->source === 'import', fn($q) => 
                $q->whereHas('orderLogs', fn($log) => $log->where('catatan', 'like', '%Excel%')->whereNull('status_lama'))
            )
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Orders/Index', [
            'orders'  => $query,
            'filters' => $request->only(['search', 'status', 'deadline_from', 'deadline_to', 'filter_deadline', 'source']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Orders/Create', [
            'customers' => Customer::orderBy('nama')->get(['id', 'nama', 'kontak', 'alamat']),
        ]);
    }

    public function store(StoreOrderRequest $request)
    {
        $validated = $request->validated();
        
        $order = $this->orderService->createOrder($validated, auth()->id());

        return redirect()->route('orders.show', $order)
            ->with('success', "Order {$order->no_order} berhasil dibuat.");
    }

    public function show(Order $order)
    {
        $order->load([
            'customer',
            'items',
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
            'order'     => $order->load(['customer', 'items']),
            'customers' => Customer::orderBy('nama')->get(['id', 'nama', 'kontak', 'alamat']),
        ]);
    }

    public function update(UpdateOrderRequest $request, Order $order)
    {
        $validated = $request->validated();

        $this->orderService->updateOrder($order, $validated);

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

        // Notify level 0 (Superadmin) dan level 1 (Owner)
        $notifiableUsers = \App\Models\User::whereIn('level_akses', [0, 1])->get();
        if ($order->creator && !$notifiableUsers->contains('id', $order->creator->id)) {
            $notifiableUsers->push($order->creator);
        }
        \Illuminate\Support\Facades\Notification::send($notifiableUsers, new \App\Notifications\OrderStatusChanged($order, $statusLama, $statusBaru));

        return back()->with('success', 'Status order berhasil diperbarui.');
    }

    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'exists:orders,id',
            'status' => 'required|string',
        ]);
        
        $orders = Order::whereIn('id', $request->order_ids)->get();
        foreach ($orders as $order) {
            $statusLama = $order->status;
            $statusBaru = $request->status;

            if ($statusLama === $statusBaru) {
                continue;
            }

            $order->update(['status' => $statusBaru]);

            OrderLog::create([
                'order_id'    => $order->id,
                'user_id'     => auth()->id(),
                'status_lama' => $statusLama,
                'status_baru' => $statusBaru,
                'catatan'     => 'Bulk update status',
            ]);

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
        }

        return back()->with('success', 'Status pesanan berhasil diperbarui secara massal.');
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
        $user = auth()->user();

        // Hanya manajemen (level ≤ 2) atau uploader file itu sendiri yang boleh hapus
        if ($user->level_akses > 2 && $file->uploaded_by !== $user->id) {
            abort(403, 'Anda tidak berhak menghapus file ini.');
        }

        Storage::disk('public')->delete($file->path);
        $file->delete();
        return back()->with('success', 'File berhasil dihapus.');
    }

    public function destroy(Order $order)
    {
        if (auth()->user()->level_akses > 2) {
            abort(403, 'Anda tidak berhak menghapus order.');
        }

        $order->delete();
        return redirect()->route('orders.index')
            ->with('success', "Order {$order->no_order} berhasil dihapus.");
    }

    public function bulkDelete(Request $request)
    {
        if (auth()->user()->level_akses > 2) {
            abort(403, 'Anda tidak berhak menghapus order.');
        }

        $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'exists:orders,id',
        ]);

        Order::whereIn('id', $request->order_ids)->delete();

        return back()->with('success', 'Pesanan yang dipilih berhasil dihapus secara massal.');
    }

    public function printSpk(Order $order)
    {
        $order->load(['customer', 'creator']);
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.spk', compact('order'));
        return $pdf->stream("SPK-{$order->no_order}.pdf");
    }

    public function printInvoice(Order $order)
    {
        $order->load(['customer', 'creator', 'pembayarans']);
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.invoice', compact('order'));
        return $pdf->stream("INVOICE-{$order->no_order}.pdf");
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048',
        ]);

        try {
            \Maatwebsite\Excel\Facades\Excel::import(new \App\Imports\OrdersImport, $request->file('file'));
            return back()->with('success', 'Data order berhasil diimpor dari Excel.');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Import error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat mengimpor data. Pastikan format sesuai.');
        }
    }

    public function template()
    {
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\OrdersTemplateExport, 'Template_Import_Order.xlsx');
    }
}

