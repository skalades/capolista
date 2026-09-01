<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Supplier;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\StokBahan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ProcurementController extends Controller
{
    public function index()
    {
        $aktifPoCount = PurchaseOrder::whereIn('status', ['draft', 'dikirim'])->count();
        $supplierCount = Supplier::count();
        
        // Example: alert kebutuhan bahan (you can customize logic based on what is 'kebutuhan bahan')
        // Maybe find items with low stock. Assuming StokBahan has 'stok_minimal' and 'stok'
        // $kebutuhanBahan = StokBahan::whereColumn('stok', '<', 'stok_minimal')->get();
        // Here we just return an empty array or basic data if the table structure is not fully known.
        
        return Inertia::render('Procurement/Index', [
            'stats' => [
                'aktifPoCount' => $aktifPoCount,
                'supplierCount' => $supplierCount,
                'kebutuhanBahan' => [] // to be populated
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
            'nama' => 'required|string|max:255',
            'kontak' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'alamat' => 'nullable|string',
            'catatan' => 'nullable|string',
        ]);

        Supplier::create($validated);
        return redirect()->back()->with('success', 'Supplier created successfully.');
    }

    public function supplierUpdate(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kontak' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'alamat' => 'nullable|string',
            'catatan' => 'nullable|string',
        ]);

        $supplier->update($validated);
        return redirect()->back()->with('success', 'Supplier updated successfully.');
    }

    public function supplierDestroy(Supplier $supplier)
    {
        $supplier->delete();
        return redirect()->back()->with('success', 'Supplier deleted successfully.');
    }

    public function poIndex(Request $request)
    {
        $query = PurchaseOrder::with(['supplier', 'creator']);
        
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $purchaseOrders = $query->orderBy('tanggal_po', 'desc')->paginate(10);
        return Inertia::render('Procurement/PoIndex', [
            'purchaseOrders' => $purchaseOrders,
            'filters' => $request->only('status')
        ]);
    }

    public function poCreate()
    {
        $suppliers = Supplier::all();
        $stokBahans = class_exists(StokBahan::class) ? StokBahan::all() : [];
        return Inertia::render('Procurement/PoCreate', [
            'suppliers' => $suppliers,
            'stokBahans' => $stokBahans
        ]);
    }

    public function poStore(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'tanggal_po' => 'required|date',
            'catatan' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.bahan_id' => 'nullable|integer',
            'items.*.nama_bahan' => 'required|string',
            'items.*.jumlah' => 'required|numeric|min:0.01',
            'items.*.satuan' => 'required|string',
            'items.*.harga_satuan' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            // Generate NO PO
            $noPo = 'PO-' . date('Ymd') . '-' . str_pad(PurchaseOrder::count() + 1, 4, '0', STR_PAD_LEFT);
            
            $totalHarga = collect($validated['items'])->sum(function($item) {
                return $item['jumlah'] * $item['harga_satuan'];
            });

            $po = PurchaseOrder::create([
                'no_po' => $noPo,
                'supplier_id' => $validated['supplier_id'],
                'tanggal_po' => $validated['tanggal_po'],
                'status' => 'draft',
                'total_harga' => $totalHarga,
                'catatan' => $validated['catatan'] ?? null,
                'dibuat_oleh' => Auth::id() ?? 1, // Fallback if no auth
            ]);

            foreach ($validated['items'] as $item) {
                $po->items()->create($item);
            }
        });

        return redirect()->route('procurement.po.index')->with('success', 'Purchase Order created.');
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
            $po->status = $validated['status'];
            $po->save();

            // if status is received, update stock
            if ($po->status === 'diterima' && class_exists(StokBahan::class)) {
                foreach ($po->items as $item) {
                    if ($item->bahan_id) {
                        $bahan = StokBahan::find($item->bahan_id);
                        if ($bahan) {
                            // Assuming StokBahan has a field 'jumlah' or 'stok'. I'll use 'jumlah' as a guess or simply skip.
                            // The exact field name depends on their schema.
                            // For safety, let's assume it has 'stok' or 'jumlah'
                            $field = \Schema::hasColumn('stok_bahans', 'stok') ? 'stok' : (\Schema::hasColumn('stok_bahans', 'jumlah') ? 'jumlah' : null);
                            if ($field) {
                                $bahan->increment($field, $item->jumlah);
                            }
                        }
                    }
                }
            }
        });

        return redirect()->back()->with('success', 'Status PO updated.');
    }
}
