<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\ProduksiJahitAssign;
use App\Models\ProduksiJahitOutput;
use App\Models\User;
use App\Services\JahitService;
use App\Http\Requests\Jahit\AssignOperatorRequest;
use App\Http\Requests\Jahit\StoreOutputRequest;
use App\Http\Requests\Jahit\ApproveOutputRequest;
use App\Http\Requests\Jahit\RejectOutputRequest;
use App\Http\Requests\Jahit\CompleteJahitRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Exception;

class JahitController extends Controller
{
    public function __construct(
        private readonly JahitService $jahitService
    ) {}

    /**
     * Dashboard divisi jahit:
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
        
        $ordersJahit = Order::with(['customer', 'jahitAssigns.operator', 'items', 'orderLogs.user', 'orderFiles'])
            ->where('status', Order::STATUS_JAHIT)
            ->latest()
            ->get(); // Ambil semua untuk sidebar/detail

        $ordersJahit->each(function ($order) {
            $order->jahitAssigns->each->append(['total_rincian_selesai', 'total_pcs_approved']);
        });

        $operatorList = User::active()
            ->where('divisi', 'jahit')
            ->where('level_akses', User::LEVEL_STAF)
            ->get();
            
        $activeOperators = $operatorList->count();
        
        // Output hari ini
        $outputsToday = ProduksiJahitOutput::with(['order', 'operator'])
            ->whereDate('tanggal', $today)
            ->get();
            
        $approvedToday = $outputsToday->where('status', ProduksiJahitOutput::STATUS_APPROVED)->sum('pcs_approved');
        $rejectedToday = $outputsToday->where('status', ProduksiJahitOutput::STATUS_REJECTED)->sum('pcs_klaim'); // menggunakan pcs_klaim karena ditolak
        
        $rataRata = $activeOperators > 0 ? round($approvedToday / $activeOperators) : 0;
        
        // Fix N+1: Eager load semua assigns aktif untuk semua operator sekaligus,
        // bukan query per-operator di dalam loop.
        $operatorIds    = $operatorList->pluck('id');
        $allActiveAssigns = ProduksiJahitAssign::with('order')
            ->whereIn('operator_id', $operatorIds)
            ->where('is_active', true)
            ->get()
            ->groupBy('operator_id');

        $progresPenjahit = $operatorList->flatMap(function ($operator) use ($outputsToday, $allActiveAssigns) {
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
                $pcsSelesai    = $assignOutputs->where('status', ProduksiJahitOutput::STATUS_APPROVED)->sum('pcs_approved');
                $pcsReject     = $assignOutputs->where('status', ProduksiJahitOutput::STATUS_REJECTED)->sum('pcs_klaim');

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

        $totalTarget = $progresPenjahit->sum('target');
        
        $stats = [
            'total_target' => $totalTarget,
            'total_selesai' => $approvedToday,
            'order_berjalan' => $ordersJahit->count(),
            'order_baru' => $ordersJahit->filter(fn($o) => $o->created_at->isToday())->count(),
            'reject_hari_ini' => $rejectedToday,
            'rata_rata_pcs' => $rataRata,
            'target_harian_per_orang' => $activeOperators > 0 ? round($totalTarget / $activeOperators) : 0
        ];
        
        // Catatan Reject (Gabungan dari daily output reject dan final QC reject)
        $catatanReject = $outputsToday->where('status', ProduksiJahitOutput::STATUS_REJECTED)->map(function ($out) {
            return [
                'id' => 'out_' . $out->id,
                'no_order' => $out->order->no_order,
                'jumlah' => $out->pcs_klaim,
                'penyebab' => $out->catatan_mandor ?? 'Butuh perbaikan (Klaim Harian)',
                'penjahit' => $out->operator->name,
                'jenis' => 'harian'
            ];
        })->values();

        // Ambil final QC rejects yang masih pending
        $finalQcRejects = \App\Models\ProduksiJahitQcReject::with(['order', 'operator'])
            ->where('status', 'pending')
            ->get()
            ->map(function ($qc) {
                return [
                    'id' => 'qc_' . $qc->id,
                    'no_order' => $qc->order->no_order,
                    'jumlah' => $qc->jumlah,
                    'penyebab' => $qc->alasan ?? 'QC Final Failed',
                    'penjahit' => $qc->operator->name,
                    'jenis' => 'final_qc'
                ];
            });

        $catatanReject = $catatanReject->merge($finalQcRejects)->values();

        $menungguApproval = ProduksiJahitOutput::with(['order', 'operator'])
            ->where('status', ProduksiJahitOutput::STATUS_MENUNGGU_APPROVAL)
            ->latest()
            ->get();

        return Inertia::render('Jahit/IndexMandor', [
            'ordersJahit'      => $ordersJahit,
            'operatorList'     => $operatorList,
            'stats'            => $stats,
            'progresPenjahit'  => $progresPenjahit,
            'catatanReject'    => $catatanReject,
            'menungguApproval' => $menungguApproval,
        ]);
    }

    private function indexOperator(Request $request)
    {
        $user     = $request->user();
        $tanggal  = $request->input('tanggal', today()->toDateString());

        $myAssigns = ProduksiJahitAssign::with(['order.customer', 'order.items', 'order.orderFiles', 'order.desain'])
            ->where('operator_id', $user->id)
            ->where('is_active', true)
            ->whereHas('order', fn ($q) => $q->where('status', Order::STATUS_JAHIT))
            ->get();

        $myAssigns->each->append('total_rincian_selesai');

        $todayOutputs = ProduksiJahitOutput::with(['assign', 'order'])
            ->where('operator_id', $user->id)
            ->whereDate('tanggal', $tanggal)
            ->get();

        $recentOutputs = ProduksiJahitOutput::with(['order'])
            ->where('operator_id', $user->id)
            ->where('status', ProduksiJahitOutput::STATUS_APPROVED)
            ->latest('tanggal')
            ->take(20)
            ->get();

        $upahBulanIni = ProduksiJahitOutput::where('operator_id', $user->id)
            ->where('status', ProduksiJahitOutput::STATUS_APPROVED)
            ->whereMonth('tanggal', now()->month)
            ->whereYear('tanggal', now()->year)
            ->sum('upah_kotor');

        return Inertia::render('Jahit/IndexOperator', [
            'myAssigns'     => $myAssigns,
            'todayOutputs'  => $todayOutputs,
            'recentOutputs' => $recentOutputs,
            'upahBulanIni'  => (float) $upahBulanIni,
            'tanggal'       => $tanggal,
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['customer', 'jahitAssigns.operator', 'jahitAssigns.outputs', 'orderLogs.user', 'cutting']);

        $operatorList = User::active()
            ->where('divisi', 'jahit')
            ->where('level_akses', User::LEVEL_STAF)
            ->get(['id', 'name', 'tarif_default']);

        return Inertia::render('Jahit/Show', [
            'order'        => $order,
            'operatorList' => $operatorList,
        ]);
    }

    public function assign(AssignOperatorRequest $request, Order $order)
    {
        try {
            $this->jahitService->assignOperator($order, $request->validated(), auth()->id());
            return back()->with('success', 'Operator berhasil di-assign ke order.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function storeOutput(StoreOutputRequest $request)
    {
        try {
            $this->jahitService->submitOutput($request->validated(), auth()->id());
            return back()->with('success', 'Output harian berhasil disubmit. Menunggu approval mandor.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function approveOutput(ApproveOutputRequest $request, ProduksiJahitOutput $output)
    {
        try {
            $upah = $this->jahitService->approveOutput($output, $request->validated(), auth()->id());
            return back()->with('success', "Output disetujui. Upah: Rp " . number_format($upah, 0, ',', '.'));
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function rejectOutput(RejectOutputRequest $request, ProduksiJahitOutput $output)
    {
        try {
            $this->jahitService->rejectOutput($output, $request->validated(), auth()->id());
            return back()->with('success', 'Output ditolak. Operator akan mendapat notifikasi untuk revisi.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function complete(CompleteJahitRequest $request, Order $order)
    {
        try {
            $nextDivisi = $this->jahitService->completeOrder($order, $request->validated(), auth()->id());
            return redirect()->route('jahit.index')
                ->with('success', "Order #{$order->no_order} selesai jahit → dilanjutkan ke {$nextDivisi}.");
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
            $this->jahitService->submitQcReject($order, $data, auth()->id());
            return back()->with('success', 'Berhasil mencatat reject final QC. Barang dikembalikan ke penjahit untuk direvisi.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
