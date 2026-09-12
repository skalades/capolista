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
            'customers' => Customer::orderBy('nama')->get(['id', 'nama', 'kontak', 'alamat']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id'       => 'nullable|exists:customers,id',
            'nama_kustomer'     => 'required_without:customer_id|string|max:255',
            'nomor_kontak'      => 'nullable|string|max:255',
            'alamat_pengiriman' => 'nullable|string',
            'items'             => 'required|array|min:1',
            'items.*.jenis_produk' => 'required|string|max:255',
            'items.*.ukuran_detail' => 'nullable|array',
            'items.*.jumlah'    => 'required|integer|min:1',
            'jumlah'            => 'required|integer|min:1',
            'tanggal_order'     => 'required|date',
            'deadline'          => 'required|date|after_or_equal:tanggal_order',
            'total_harga'       => 'required|numeric|min:0',
            'dp'                => 'nullable|numeric|min:0',
            'catatan_desain'    => 'nullable|string',
            'catatan'           => 'nullable|string',
        ]);

        $customerId = $validated['customer_id'] ?? null;

        if (!$customerId && !empty($validated['nama_kustomer'])) {
            $customer = Customer::where('nama', $validated['nama_kustomer'])->first();
            
            if ($customer) {
                $needsUpdate = false;
                if (empty($customer->kontak) && !empty($validated['nomor_kontak'])) {
                    $customer->kontak = $validated['nomor_kontak'];
                    $needsUpdate = true;
                }
                if (empty($customer->alamat) && !empty($validated['alamat_pengiriman'])) {
                    $customer->alamat = $validated['alamat_pengiriman'];
                    $needsUpdate = true;
                }
                if ($needsUpdate) {
                    $customer->save();
                }
            } else {
                $customer = Customer::create([
                    'nama'   => $validated['nama_kustomer'],
                    'kontak' => $validated['nomor_kontak'] ?? '',
                    'alamat' => $validated['alamat_pengiriman'] ?? '',
                ]);
            }
            $customerId = $customer->id;
        }

        $dp = $validated['dp'] ?? 0;
        
        // Gabungkan semua jenis produk untuk di tabel master order
        $jenisProdukMaster = collect($validated['items'])->pluck('jenis_produk')->unique()->implode(', ');

        $order = Order::create([
            'customer_id'    => $customerId,
            'jenis_produk'   => $jenisProdukMaster,
            'jumlah'         => $validated['jumlah'],
            'tanggal_order'  => $validated['tanggal_order'],
            'deadline'       => $validated['deadline'],
            'total_harga'    => $validated['total_harga'],
            'catatan_desain' => $validated['catatan_desain'] ?? null,
            'catatan'        => $validated['catatan'] ?? null,
            'no_order'       => OrderHelper::generateNoOrder(),
            'status'         => Order::STATUS_DRAFT,
            'dp'             => $dp,
            'sisa_bayar'     => $validated['total_harga'] - $dp,
            'created_by'     => auth()->id(),
        ]);

        foreach ($validated['items'] as $itemData) {
            $hargaSatuan = isset($itemData['harga_satuan']) ? str_replace(['Rp', '.', ' '], '', $itemData['harga_satuan']) : null;
            
            if (!empty($itemData['ukuran_detail'])) {
                $hasSizes = false;
                foreach ($itemData['ukuran_detail'] as $ukuran => $jumlah) {
                    if ($jumlah > 0) {
                        $order->items()->create([
                            'jenis_produk' => $itemData['jenis_produk'],
                            'ukuran' => $ukuran,
                            'jumlah_pcs' => $jumlah,
                            'harga_satuan' => $hargaSatuan,
                        ]);
                        $hasSizes = true;
                    }
                }
                if (!$hasSizes) {
                    $order->items()->create([
                        'jenis_produk' => $itemData['jenis_produk'],
                        'ukuran' => null,
                        'jumlah_pcs' => $itemData['jumlah'],
                        'harga_satuan' => $hargaSatuan,
                    ]);
                }
            } else {
                $order->items()->create([
                    'jenis_produk' => $itemData['jenis_produk'],
                    'ukuran' => null,
                    'jumlah_pcs' => $itemData['jumlah'],
                    'harga_satuan' => $hargaSatuan,
                ]);
            }
        }

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

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'customer_id'    => 'required|exists:customers,id',
            'items'          => 'required|array|min:1',
            'items.*.jenis_produk' => 'required|string|max:255',
            'items.*.ukuran_detail' => 'nullable|array',
            'items.*.jumlah'    => 'required|integer|min:1',
            'jumlah'         => 'required|integer|min:1',
            'tanggal_order'  => 'required|date',
            'deadline'       => 'required|date',
            'total_harga'    => 'required|numeric|min:0',
            'dp'             => 'nullable|numeric|min:0',
            'catatan_desain' => 'nullable|string',
            'catatan'        => 'nullable|string',
        ]);

        $dp = $validated['dp'] ?? 0;
        $jenisProdukMaster = collect($validated['items'])->pluck('jenis_produk')->unique()->implode(', ');

        $order->update([
            'customer_id'    => $validated['customer_id'],
            'jenis_produk'   => $jenisProdukMaster,
            'jumlah'         => $validated['jumlah'],
            'tanggal_order'  => $validated['tanggal_order'],
            'deadline'       => $validated['deadline'],
            'total_harga'    => $validated['total_harga'],
            'catatan_desain' => $validated['catatan_desain'] ?? null,
            'catatan'        => $validated['catatan'] ?? null,
            'dp'         => $dp,
            'sisa_bayar' => $validated['total_harga'] - $dp,
        ]);

        $order->items()->delete();
        foreach ($validated['items'] as $itemData) {
            $hargaSatuan = isset($itemData['harga_satuan']) ? str_replace(['Rp', '.', ' '], '', $itemData['harga_satuan']) : null;
            
            if (!empty($itemData['ukuran_detail'])) {
                $hasSizes = false;
                foreach ($itemData['ukuran_detail'] as $ukuran => $jumlah) {
                    if ($jumlah > 0) {
                        $order->items()->create([
                            'jenis_produk' => $itemData['jenis_produk'],
                            'ukuran' => $ukuran,
                            'jumlah_pcs' => $jumlah,
                            'harga_satuan' => $hargaSatuan,
                        ]);
                        $hasSizes = true;
                    }
                }
                if (!$hasSizes) {
                    $order->items()->create([
                        'jenis_produk' => $itemData['jenis_produk'],
                        'ukuran' => null,
                        'jumlah_pcs' => $itemData['jumlah'],
                        'harga_satuan' => $hargaSatuan,
                    ]);
                }
            } else {
                $order->items()->create([
                    'jenis_produk' => $itemData['jenis_produk'],
                    'ukuran' => null,
                    'jumlah_pcs' => $itemData['jumlah'],
                    'harga_satuan' => $hargaSatuan,
                ]);
            }
        }

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

