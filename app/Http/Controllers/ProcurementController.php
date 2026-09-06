<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Supplier;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\StokBahan;
use App\Models\StokMutasi;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ProcurementController extends Controller
{
    public function index()
    {
        $aktifPoCount = PurchaseOrder::whereIn('status', ['draft', 'dikirim'])->count();
        $supplierCount = Supplier::count();

        return Inertia::render('Procurement/Index', [
            'stats' => [
                'aktifPoCount'  => $aktifPoCount,
                'supplierCount' => $supplierCount,
                'kebutuhanBahan' => StokBahan::whereColumn('jumlah_stok', '<=', 'minimum_stok')->get(['id', 'nama_bahan', 'satuan', 'jumlah_stok', 'minimum_stok']),
            ]
        ]);
    }

    public function supplierIndex()
    {
        $suppliers = Supplier::all();
        return Inertia::render('Procurement/Supplier', [
            'suppliers' => $suppliers
        ]);
    }

    public function supplierStore(Request $request)
    {
        $validated = $request->validate([
            'nama'    => 'required|string|max:255',
            'kontak'  => 'nullable|string|max:255',
            'email'   => 'nullable|email|max:255',
            'alamat'  => 'nullable|string',
            'catatan' => 'nullable|string',
        ]);

        Supplier::create($validated);
        // Fix #13: pesan dalam Bahasa Indonesia
        return redirect()->back()->with('success', 'Supplier berhasil ditambahkan.');
    }

    public function supplierUpdate(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'nama'    => 'required|string|max:255',
            'kontak'  => 'nullable|string|max:255',
            'email'   => 'nullable|email|max:255',
            'alamat'  => 'nullable|string',
            'catatan' => 'nullable|string',
        ]);

        $supplier->update($validated);
        // Fix #13: pesan dalam Bahasa Indonesia
        return redirect()->back()->with('success', 'Supplier berhasil diperbarui.');
    }

    public function supplierDestroy(Supplier $supplier)
    {
        $supplier->delete();
        // Fix #13: pesan dalam Bahasa Indonesia
        return redirect()->back()->with('success', 'Supplier berhasil dihapus.');
    }

    public function poIndex(Request $request)
    {
        $query = PurchaseOrder::with(['supplier', 'creator']);

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $purchaseOrders = $query->orderBy('tanggal_po', 'desc')->paginate(10)->withQueryString();
        return Inertia::render('Procurement/PoIndex', [
            'purchaseOrders' => $purchaseOrders,
            'filters'        => $request->only('status')
        ]);
    }

    public function poCreate()
    {
        $suppliers  = Supplier::all();
        $stokBahans = StokBahan::orderBy('nama_bahan')->get(['id', 'nama_bahan', 'satuan']);
        return Inertia::render('Procurement/PoCreate', [
            'suppliers'  => $suppliers,
            'stokBahans' => $stokBahans
        ]);
    }

    public function poStore(Request $request)
    {
        $validated = $request->validate([
            'supplier_id'            => 'required|exists:suppliers,id',
            'tanggal_po'             => 'required|date',
            'catatan'                => 'nullable|string',
            'items'                  => 'required|array|min:1',
            'items.*.bahan_id'       => 'nullable|integer|exists:stok_bahans,id',
            'items.*.nama_bahan'     => 'required|string',
            'items.*.jumlah'         => 'required|numeric|min:0.01',
            'items.*.satuan'         => 'required|string',
            'items.*.harga_satuan'   => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            // Fix race condition: gunakan lockForUpdate saat generate nomor PO
            $lastPo = PurchaseOrder::lockForUpdate()->latest('id')->first();
            $nextNum = $lastPo ? $lastPo->id + 1 : 1;
            $noPo = 'PO-' . date('Ymd') . '-' . str_pad($nextNum, 4, '0', STR_PAD_LEFT);

            $totalHarga = collect($validated['items'])->sum(fn ($item) => $item['jumlah'] * $item['harga_satuan']);

            $po = PurchaseOrder::create([
                'no_po'        => $noPo,
                'supplier_id'  => $validated['supplier_id'],
                'tanggal_po'   => $validated['tanggal_po'],
                'status'       => 'draft',
                'total_harga'  => $totalHarga,
                'catatan'      => $validated['catatan'] ?? null,
                // Fix #19: hapus fallback ?? 1, middleware sudah memastikan user login
                'dibuat_oleh'  => Auth::id(),
            ]);

            foreach ($validated['items'] as $item) {
                $po->items()->create($item);
            }
        });

        return redirect()->route('procurement.po.index')->with('success', 'Purchase Order berhasil dibuat.');
    }

    public function poShow(PurchaseOrder $po)
    {
        $po->load(['supplier', 'items.bahan', 'creator']);
        return Inertia::render('Procurement/PoShow', [
            'purchaseOrder' => $po
        ]);
    }

    public function poUpdateStatus(Request $request, PurchaseOrder $po)
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,dikirim,diterima,dibatalkan'
        ]);

        DB::transaction(function () use ($po, $validated) {
            $po->update(['status' => $validated['status']]);

            // Fix #4: Saat PO diterima, update stok dengan field yang benar (jumlah_stok)
            // dan buat StokMutasi sebagai audit trail
            if ($validated['status'] === 'diterima') {
                foreach ($po->items as $item) {
                    if ($item->bahan_id) {
                        $bahan = StokBahan::lockForUpdate()->find($item->bahan_id);
                        if ($bahan) {
                            $bahan->increment('jumlah_stok', $item->jumlah);

                            // Buat audit trail mutasi stok
                            StokMutasi::create([
                                'bahan_id'          => $bahan->id,
                                'tipe'              => 'masuk',
                                'jumlah'            => $item->jumlah,
                                'keterangan'        => "Penerimaan PO #{$po->no_po} dari {$po->supplier->nama}",
                                'mutasi_created_by' => Auth::id(),
                            ]);
                        }
                    }
                }
            }
        });

        return redirect()->back()->with('success', 'Status PO berhasil diperbarui.');
    }
}
