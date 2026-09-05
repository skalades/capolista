<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderLog;
use App\Models\Packing;
use App\Models\StokBahan;
use App\Models\StokMutasi;
use App\Models\StokOpname;
use App\Models\StokOpnameItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GudangController extends Controller
{
        public function index(Request $request)
    {
        $user = $request->user();
        if ($user->level_akses === 4 && $user->divisi !== 'gudang' && $user->level_akses !== 3) {
            abort(403, 'Anda tidak memiliki akses ke modul Gudang.');
        }

        $ordersPacking = Order::with(['customer', 'packing'])
            ->whereIn('status', [Order::STATUS_PACKING, Order::STATUS_DIKIRIM])
            ->latest()
            ->paginate(15);

        $lowStockCount = StokBahan::whereColumn('jumlah_stok', '<=', 'minimum_stok')->count();

        return Inertia::render('Gudang/Index', [
            'ordersPacking' => $ordersPacking,
            'lowStockCount' => $lowStockCount,
        ]);
    }

    public function stokIndex(Request $request)
    {
        $stokList = StokBahan::when($request->search, fn($q, $s) =>
                $q->where('nama_bahan', 'like', "%{$s}%")
            )
            ->orderBy('nama_bahan')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Gudang/Stok', [
            'stokList' => $stokList,
            'filters'  => $request->only(['search']),
        ]);
    }

    public function stokStore(Request $request)
    {
        $request->validate([
            'nama_bahan'    => 'required|string|max:255',
            'satuan'        => 'required|string|max:50',
            'jumlah_masuk'  => 'required|numeric|min:0.01',
            'minimum_stok'  => 'required|numeric|min:0',
            'keterangan'    => 'nullable|string',
        ]);

        $bahan = StokBahan::create([
            'nama_bahan'    => $request->nama_bahan,
            'satuan'        => $request->satuan,
            'jumlah_stok'   => $request->jumlah_masuk,
            'minimum_stok'  => $request->minimum_stok,
            'keterangan'    => $request->keterangan,
        ]);

        StokMutasi::create([
            'bahan_id'   => $bahan->id,
            'tipe'       => 'masuk',
            'jumlah'     => $request->jumlah_masuk,
            'keterangan' => 'Stok awal',
            'mutasi_created_by' => auth()->id(),
        ]);

        return back()->with('success', "Bahan {$bahan->nama_bahan} berhasil ditambahkan.");
    }

    public function stokUpdate(Request $request, StokBahan $stok)
    {
        $request->validate([
            'tipe'       => 'required|in:masuk,keluar',
            'jumlah'     => 'required|numeric|min:0.01',
            'keterangan' => 'nullable|string',
        ]);

        $jumlahBaru = $request->tipe === 'masuk'
            ? $stok->jumlah_stok + $request->jumlah
            : $stok->jumlah_stok - $request->jumlah;

        if ($jumlahBaru < 0) {
            return back()->with('error', 'Stok tidak mencukupi.');
        }

        $stok->update(['jumlah_stok' => $jumlahBaru]);

        StokMutasi::create([
            'bahan_id'   => $stok->id,
            'tipe'       => $request->tipe,
            'jumlah'     => $request->jumlah,
            'keterangan' => $request->keterangan,
            'mutasi_created_by' => auth()->id(),
        ]);

        return back()->with('success', 'Stok berhasil diperbarui.');
    }

    public function packingShow(Order $order)
    {
        $order->load(['customer', 'packing.pekerja', 'orderLogs.user']);
        return Inertia::render('Gudang/Packing', ['order' => $order]);
    }

    public function packingUpdate(Request $request, Packing $packing)
    {
        $request->validate([
            'checklist_packing' => 'nullable|array',
            'kurir'             => 'nullable|string|max:100',
            'no_resi'           => 'nullable|string|max:100',
            'tanggal_kirim'     => 'nullable|date',
            'status'            => 'required|in:packing,siap_kirim,dikirim',
            'catatan'           => 'nullable|string',
        ]);

        $packing->update([
            ...$request->only(['checklist_packing', 'kurir', 'no_resi', 'tanggal_kirim', 'status', 'catatan']),
            'dikerjakan_oleh' => auth()->id(),
        ]);

        if ($request->status === 'dikirim') {
            $order = $packing->order;
            $order->update(['status' => Order::STATUS_DIKIRIM]);

            OrderLog::create([
                'order_id'    => $order->id,
                'user_id'     => auth()->id(),
                'status_lama' => Order::STATUS_PACKING,
                'status_baru' => Order::STATUS_DIKIRIM,
                'catatan'     => 'Order dikirim via ' . ($request->kurir ?? '-') . '. Resi: ' . ($request->no_resi ?? '-'),
            ]);
        }

        return back()->with('success', 'Data packing diperbarui.');
    }
    public function opnameIndex()
    {
        $opnameList = StokOpname::with('pembuat', 'penyetuju')
            ->latest()
            ->paginate(15);

        return Inertia::render('Gudang/OpnameIndex', [
            'opnameList' => $opnameList,
        ]);
    }

    public function opnameCreate()
    {
        $stokList = StokBahan::orderBy('nama_bahan')->get();
        return Inertia::render('Gudang/OpnameCreate', [
            'stokList' => $stokList,
        ]);
    }

    public function opnameStore(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'catatan' => 'nullable|string',
            'items'   => 'required|array|min:1',
            'items.*.bahan_id' => 'required|exists:stok_bahans,id',
            'items.*.nama_bahan' => 'required|string',
            'items.*.satuan' => 'required|string',
            'items.*.stok_sistem' => 'required|numeric',
            'items.*.stok_fisik' => 'nullable|numeric',
            'items.*.keterangan_selisih' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request) {
            $opname = StokOpname::create([
                'tanggal' => $request->tanggal,
                'catatan' => $request->catatan,
                'status'  => 'draft',
                'dibuat_oleh' => auth()->id(),
            ]);

            foreach ($request->items as $item) {
                $selisih = null;
                if (isset($item['stok_fisik'])) {
                    $selisih = $item['stok_fisik'] - $item['stok_sistem'];
                }

                $opname->items()->create([
                    'bahan_id' => $item['bahan_id'],
                    'nama_bahan' => $item['nama_bahan'],
                    'satuan' => $item['satuan'],
                    'stok_sistem' => $item['stok_sistem'],
                    'stok_fisik' => $item['stok_fisik'] ?? null,
                    'selisih' => $selisih,
                    'keterangan_selisih' => $item['keterangan_selisih'] ?? null,
                ]);
            }
        });

        return redirect()->route('gudang.opname.index')->with('success', 'Draft Stok Opname berhasil disimpan.');
    }

    public function opnameShow(StokOpname $opname)
    {
        $opname->load(['items', 'pembuat', 'penyetuju']);
        return Inertia::render('Gudang/OpnameShow', [
            'opname' => $opname,
        ]);
    }

    public function opnameSubmit(StokOpname $opname)
    {
        if ($opname->status !== 'draft') {
            return back()->with('error', 'Hanya opname draft yang dapat disubmit.');
        }

        $opname->update(['status' => 'menunggu_approval']);

        return back()->with('success', 'Stok Opname disubmit untuk approval.');
    }

    public function opnameApprove(Request $request, StokOpname $opname)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
        ]);

        if ($opname->status !== 'menunggu_approval') {
            return back()->with('error', 'Status opname tidak valid untuk di-approve/reject.');
        }

        if ($request->action === 'reject') {
            $opname->update([
                'status' => 'ditolak',
                'disetujui_oleh' => auth()->id(),
                'disetujui_at' => now(),
            ]);
            return back()->with('success', 'Stok Opname ditolak.');
        }

        DB::transaction(function () use ($opname) {
            $opname->update([
                'status' => 'disetujui',
                'disetujui_oleh' => auth()->id(),
                'disetujui_at' => now(),
            ]);

            $items = $opname->items()->get();
            foreach ($items as $item) {
                if ($item->selisih != 0 && isset($item->stok_fisik)) {
                    $bahan = StokBahan::find($item->bahan_id);
                    if ($bahan) {
                        $bahan->update(['jumlah_stok' => $item->stok_fisik]);

                        StokMutasi::create([
                            'bahan_id' => $bahan->id,
                            'tipe' => $item->selisih > 0 ? 'masuk' : 'keluar',
                            'jumlah' => abs($item->selisih),
                            'keterangan' => 'Penyesuaian Stok Opname #' . $opname->id . ($item->keterangan_selisih ? ' - ' . $item->keterangan_selisih : ''),
                            'mutasi_created_by' => auth()->id(),
                        ]);
                    }
                }
            }
        });

        return back()->with('success', 'Stok Opname disetujui dan stok disesuaikan.');
    }
}


