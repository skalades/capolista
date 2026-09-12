<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderLog;
use App\Models\ProduksiCuttingAssign;
use App\Models\ProduksiCuttingOutput;
use App\Models\ProduksiCuttingQcReject;
use App\Models\TarifCuttingHistory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Exception;

class CuttingController extends Controller
{
    /**
     * Dashboard divisi cutting:
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isKepala() || $user->isManagement()) {
            return $this->indexMandor($request);
        }

        return $this->indexOperator($request);
    }

    private function indexMandor(Request $request)
    {
        $today = today();
        
        $ordersCutting = Order::with(['customer', 'cuttingAssigns.operator', 'items', 'orderLogs.user', 'orderFiles'])
            ->where('status', Order::STATUS_CUTTING)
            ->latest()
            ->get(); 

        $ordersCutting->each(function ($order) {
            $order->cuttingAssigns->each->append(['total_rincian_selesai', 'total_pcs_approved']);
        });

        $operatorList = User::active()
            ->where('divisi', 'cutting')
            ->where('level_akses', User::LEVEL_STAF)
            ->get();
            
        $activeOperators = $operatorList->count();
        
        // Output hari ini
        $outputsToday = ProduksiCuttingOutput::with(['order', 'operator'])
            ->whereDate('tanggal', $today)
            ->get();
            
        $approvedToday = $outputsToday->where('status', ProduksiCuttingOutput::STATUS_APPROVED)->sum('pcs_approved');
        $rejectedToday = $outputsToday->where('status', ProduksiCuttingOutput::STATUS_REJECTED)->sum('pcs_klaim'); 
        
        $rataRata = $activeOperators > 0 ? round($approvedToday / $activeOperators) : 0;
        
        $operatorIds    = $operatorList->pluck('id');
        $allActiveAssigns = ProduksiCuttingAssign::with('order')
            ->whereIn('operator_id', $operatorIds)
            ->where('is_active', true)
            ->get()
            ->groupBy('operator_id');

        $progresPemotong = $operatorList->flatMap(function ($operator) use ($outputsToday, $allActiveAssigns) {
            $activeAssigns = $allActiveAssigns->get($operator->id, collect());

            if ($activeAssigns->isEmpty()) {
                return [[
                    'id'              => $operator->id,
                    'name'            => $operator->name,
                    'active_order_no' => null,
                    'target'          => 0,
                    'pcs_selesai'     => 0,
                    'pcs_reject'      => 0,
                    'order_id'        => null,
                    'assign_id'       => null,
                ]];
            }

            return $activeAssigns->map(function ($assign) use ($operator, $outputsToday) {
                $assignOutputs = $outputsToday->where('assign_id', $assign->id);
                $pcsSelesai    = $assignOutputs->where('status', ProduksiCuttingOutput::STATUS_APPROVED)->sum('pcs_approved');
                $pcsReject     = $assignOutputs->where('status', ProduksiCuttingOutput::STATUS_REJECTED)->sum('pcs_klaim');

                return [
                    'id'              => $operator->id . '-' . $assign->id,
                    'real_id'         => $operator->id,
                    'name'            => $operator->name,
                    'active_order_no' => $assign->order->no_order,
                    'target'          => $assign->order->jumlah,
                    'pcs_selesai'     => $pcsSelesai,
                    'pcs_reject'      => $pcsReject,
                    'order_id'        => $assign->order_id,
                    'assign_id'       => $assign->id,
                ];
            });
        })->sortByDesc('pcs_selesai')->values();

        $totalTarget = $progresPemotong->sum('target');
        
        $stats = [
            'total_target' => $totalTarget,
            'total_selesai' => $approvedToday,
            'order_berjalan' => $ordersCutting->count(),
            'order_baru' => $ordersCutting->filter(fn($o) => $o->created_at->isToday())->count(),
            'reject_hari_ini' => $rejectedToday,
            'rata_rata_pcs' => $rataRata,
            'target_harian_per_orang' => $activeOperators > 0 ? round($totalTarget / $activeOperators) : 0
        ];
        
        $catatanReject = $outputsToday->where('status', ProduksiCuttingOutput::STATUS_REJECTED)->map(function ($out) {
            return [
                'id' => 'out_' . $out->id,
                'no_order' => $out->order->no_order,
                'jumlah' => $out->pcs_klaim,
                'penyebab' => $out->catatan_mandor ?? 'Butuh perbaikan (Klaim Harian)',
                'pemotong' => $out->operator->name,
                'jenis' => 'harian'
            ];
        })->values();

        $finalQcRejects = ProduksiCuttingQcReject::with(['order', 'operator'])
            ->where('status', 'pending')
            ->get()
            ->map(function ($qc) {
                return [
                    'id' => 'qc_' . $qc->id,
                    'no_order' => $qc->order->no_order,
                    'jumlah' => $qc->jumlah,
                    'penyebab' => $qc->alasan ?? 'QC Final Failed',
                    'pemotong' => $qc->operator->name,
                    'jenis' => 'final_qc'
                ];
            });

        $catatanReject = $catatanReject->merge($finalQcRejects)->values();

        $menungguApproval = ProduksiCuttingOutput::with(['order', 'operator'])
            ->where('status', ProduksiCuttingOutput::STATUS_MENUNGGU_APPROVAL)
            ->latest()
            ->get();

        return Inertia::render('Cutting/IndexMandor', [
            'ordersCutting'    => $ordersCutting,
            'operatorList'     => $operatorList,
            'stats'            => $stats,
            'progresPemotong'  => $progresPemotong,
            'catatanReject'    => $catatanReject,
            'menungguApproval' => $menungguApproval,
        ]);
    }

    private function indexOperator(Request $request)
    {
        $user     = $request->user();
        $tanggal  = $request->input('tanggal', today()->toDateString());

        $myAssigns = ProduksiCuttingAssign::with(['order.customer', 'order.items', 'order.orderFiles', 'order.desain'])
            ->where('operator_id', $user->id)
            ->where('is_active', true)
            ->whereHas('order', fn ($q) => $q->where('status', Order::STATUS_CUTTING))
            ->get();

        $myAssigns->each->append('total_rincian_selesai');

        $todayOutputs = ProduksiCuttingOutput::with(['assign', 'order'])
            ->where('operator_id', $user->id)
            ->whereDate('tanggal', $tanggal)
            ->get();

        $recentOutputs = ProduksiCuttingOutput::with(['order'])
            ->where('operator_id', $user->id)
            ->where('status', ProduksiCuttingOutput::STATUS_APPROVED)
            ->latest('tanggal')
            ->take(20)
            ->get();

        $upahBulanIni = ProduksiCuttingOutput::where('operator_id', $user->id)
            ->where('status', ProduksiCuttingOutput::STATUS_APPROVED)
            ->whereMonth('tanggal', now()->month)
            ->whereYear('tanggal', now()->year)
            ->sum('upah_kotor');

        return Inertia::render('Cutting/IndexOperator', [
            'myAssigns'     => $myAssigns,
            'todayOutputs'  => $todayOutputs,
            'recentOutputs' => $recentOutputs,
            'upahBulanIni'  => (float) $upahBulanIni,
            'tanggal'       => $tanggal,
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['customer', 'cuttingAssigns.operator', 'cuttingAssigns.outputs', 'orderLogs.user', 'pemasangan']);

        $operatorList = User::active()
            ->where('divisi', 'cutting')
            ->where('level_akses', User::LEVEL_STAF)
            ->get(['id', 'name', 'tarif_default']);

        return Inertia::render('Cutting/Show', [
            'order'        => $order,
            'operatorList' => $operatorList,
        ]);
    }

    public function assign(Request $request, Order $order)
    {
        $validated = $request->validate([
            'operator_ids'   => 'required|array|min:1',
            'operator_ids.*' => 'exists:users,id',
            'tarif_per_pcs'  => 'required|numeric|min:0',
            'catatan'        => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($order, $validated) {
                foreach ($validated['operator_ids'] as $operatorId) {
                    $assign = ProduksiCuttingAssign::where('order_id', $order->id)
                        ->where('operator_id', $operatorId)
                        ->first();

                    if ($assign) {
                        if ($assign->tarif_per_pcs != $validated['tarif_per_pcs']) {
                            TarifCuttingHistory::create([
                                'assign_id' => $assign->id,
                                'operator_id' => $operatorId,
                                'order_id' => $order->id,
                                'tarif_per_pcs_lama' => $assign->tarif_per_pcs,
                                'tarif_per_pcs_baru' => $validated['tarif_per_pcs'],
                                'berlaku_mulai' => now(),
                                'diubah_oleh' => auth()->id(),
                                'alasan' => 'Update Mandor',
                            ]);
                            $assign->update(['tarif_per_pcs' => $validated['tarif_per_pcs'], 'is_active' => true]);
                        } else {
                            $assign->update(['is_active' => true]);
                        }
                    } else {
                        ProduksiCuttingAssign::create([
                            'order_id'       => $order->id,
                            'operator_id'    => $operatorId,
                            'tarif_per_pcs'  => $validated['tarif_per_pcs'],
                            'tanggal_assign' => today(),
                            'dibuat_oleh'    => auth()->id(),
                            'is_active'      => true,
                            'catatan'        => $validated['catatan'] ?? null,
                        ]);
                    }
                }
            });
            return back()->with('success', 'Operator berhasil di-assign ke order.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function storeOutput(Request $request)
    {
        $validated = $request->validate([
            'assign_id' => 'required|exists:produksi_cutting_assigns,id',
            'rincian_ukuran' => 'required|array',
            'catatan_operator' => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $assign = ProduksiCuttingAssign::findOrFail($validated['assign_id']);
                
                $pcs_klaim = 0;
                foreach ($validated['rincian_ukuran'] as $size => $qty) {
                    if ($size !== 'total' && is_numeric($qty)) {
                        $pcs_klaim += (int) $qty;
                    }
                }

                if ($pcs_klaim <= 0) {
                    throw new Exception("Jumlah pcs yang diklaim harus lebih dari 0.");
                }

                $output = ProduksiCuttingOutput::where('assign_id', $assign->id)
                    ->whereDate('tanggal', today())
                    ->whereIn('status', [ProduksiCuttingOutput::STATUS_DRAFT, ProduksiCuttingOutput::STATUS_REJECTED])
                    ->first();

                if ($output) {
                    $output->update([
                        'pcs_klaim' => $pcs_klaim,
                        'rincian_ukuran' => $validated['rincian_ukuran'],
                        'tarif_per_pcs_snapshot' => $assign->tarif_per_pcs,
                        'status' => ProduksiCuttingOutput::STATUS_MENUNGGU_APPROVAL,
                        'catatan_operator' => $validated['catatan_operator'] ?? $output->catatan_operator,
                    ]);
                } else {
                    $exists = ProduksiCuttingOutput::where('assign_id', $assign->id)
                        ->whereDate('tanggal', today())
                        ->exists();

                    if ($exists) {
                        throw new Exception("Output untuk hari ini sudah dicatat. Edit yang ada atau hubungi mandor.");
                    }

                    ProduksiCuttingOutput::create([
                        'assign_id' => $assign->id,
                        'operator_id' => $assign->operator_id,
                        'order_id' => $assign->order_id,
                        'tanggal' => today(),
                        'pcs_klaim' => $pcs_klaim,
                        'rincian_ukuran' => $validated['rincian_ukuran'],
                        'tarif_per_pcs_snapshot' => $assign->tarif_per_pcs,
                        'status' => ProduksiCuttingOutput::STATUS_MENUNGGU_APPROVAL,
                        'catatan_operator' => $validated['catatan_operator'] ?? null,
                    ]);
                }
            });
            return back()->with('success', 'Output harian berhasil disubmit. Menunggu approval mandor.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function approveOutput(Request $request, ProduksiCuttingOutput $output)
    {
        $validated = $request->validate([
            'pcs_approved' => 'required|integer|min:0|max:' . $output->pcs_klaim,
            'catatan_mandor' => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($output, $validated) {
                if ($output->status !== ProduksiCuttingOutput::STATUS_MENUNGGU_APPROVAL) {
                    throw new Exception("Output ini tidak dalam status menunggu approval.");
                }

                $upah = $validated['pcs_approved'] * $output->tarif_per_pcs_snapshot;

                $output->update([
                    'pcs_approved' => $validated['pcs_approved'],
                    'upah_kotor' => $upah,
                    'status' => ProduksiCuttingOutput::STATUS_APPROVED,
                    'approved_by' => auth()->id(),
                    'approved_at' => now(),
                    'catatan_mandor' => $validated['catatan_mandor'] ?? null,
                ]);
            });
            return back()->with('success', "Output disetujui.");
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function rejectOutput(Request $request, ProduksiCuttingOutput $output)
    {
        $validated = $request->validate([
            'catatan_mandor' => 'required|string',
        ]);

        try {
            if ($output->status !== ProduksiCuttingOutput::STATUS_MENUNGGU_APPROVAL) {
                throw new Exception("Hanya output menunggu approval yang bisa ditolak.");
            }

            $output->update([
                'status' => ProduksiCuttingOutput::STATUS_REJECTED,
                'catatan_mandor' => $validated['catatan_mandor'],
            ]);

            return back()->with('success', 'Output ditolak. Operator akan mendapat notifikasi untuk revisi.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function complete(Request $request, Order $order)
    {
        try {
            if ($order->status !== Order::STATUS_CUTTING) {
                throw new Exception("Order tidak dalam status Cutting.");
            }

            // Validasi: pastikan total approved pcs == order jumlah
            $totalApproved = ProduksiCuttingOutput::where('order_id', $order->id)
                ->where('status', ProduksiCuttingOutput::STATUS_APPROVED)
                ->sum('pcs_approved');

            if ($totalApproved < $order->jumlah) {
                throw new Exception("Total pcs yang di-approve ($totalApproved) masih kurang dari target pesanan ({$order->jumlah}).");
            }

            DB::transaction(function () use ($order, $totalApproved) {
                $order->update(['status' => Order::STATUS_JAHIT]);

                OrderLog::create([
                    'order_id'    => $order->id,
                    'user_id'     => auth()->id(),
                    'status_lama' => Order::STATUS_CUTTING,
                    'status_baru' => Order::STATUS_JAHIT,
                    'catatan'     => "Selesai cutting. Total pcs: $totalApproved",
                ]);
            });

            return redirect()->route('cutting.index')
                ->with('success', "Order #{$order->no_order} selesai cutting → dilanjutkan ke Divisi Jahit.");
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function qcReject(Request $request, Order $order)
    {
        $data = $request->validate([
            'operator_id' => 'required|exists:users,id',
            'jumlah'      => 'required|integer|min:1',
            'alasan'      => 'required|string|max:255',
        ]);

        try {
            DB::transaction(function () use ($order, $data) {
                $assign = ProduksiCuttingAssign::where('order_id', $order->id)
                    ->where('operator_id', $data['operator_id'])
                    ->where('is_active', true)
                    ->first();

                if (!$assign) {
                    throw new Exception("Operator tersebut tidak ditugaskan (aktif) pada order ini.");
                }

                ProduksiCuttingQcReject::create([
                    'order_id' => $order->id,
                    'operator_id' => $data['operator_id'],
                    'assign_id' => $assign->id,
                    'jumlah' => $data['jumlah'],
                    'alasan' => $data['alasan'],
                    'status' => 'pending',
                    'dibuat_oleh' => auth()->id(),
                ]);
            });
            return back()->with('success', 'Berhasil mencatat reject final QC.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
