<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\ProduksiJahitOutput;
use App\Models\ProduksiTarget;
use App\Models\SystemSetting;
use App\Models\User;
use App\Notifications\EskalasiProduksi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProduksiController extends Controller
{
    /**
     * Threshold bottleneck per divisi — dibaca dari system_settings (DB, dengan cache).
     * Fallback ke nilai default jika setting belum dikonfigurasi.
     */
    private function getThresholds(): array
    {
        return SystemSetting::getBottleneckThresholds();
    }

    private function getBottleneckThreshold(string $divisi): int
    {
        return $this->getThresholds()[$divisi] ?? 3;
    }

    /**
     * Dashboard Koordinator Produksi.
     * Menampilkan:
     * - Kanban board per status produksi + bottleneck detection
     * - Statistik ringkasan per sub-divisi
     * - Data kapasitas & target harian
     * - Daftar order berisiko (eskalasi)
     */
    public function index()
    {
        $statusList = [
            Order::STATUS_DESAIN,
            Order::STATUS_PROCUREMENT,
            Order::STATUS_PRODUKSI,
            Order::STATUS_CUTTING,
            Order::STATUS_JAHIT,
            Order::STATUS_PRINTING,
            Order::STATUS_PEMASANGAN,
        ];

        // Ambil semua order aktif produksi dengan relasi yang diperlukan
        $orders = Order::with(['customer', 'orderLogs' => fn ($q) => $q->latest()->limit(1)])
            ->whereIn('status', $statusList)
            ->get()
            ->map(function ($order) {
                $lastLog = $order->orderLogs->first();
                $hariDiStatus = $lastLog
                    ? (int) now()->diffInDays($lastLog->created_at)
                    : (int) now()->diffInDays($order->updated_at);

                $threshold    = $this->getBottleneckThreshold($order->status);
                $isBottleneck = $hariDiStatus > $threshold;

                // Deadline dalam 2 hari ke depan dan belum selesai
                $deadlineDay    = $order->deadline?->copy()->startOfDay();
                $hariKeDeadline = $deadlineDay
                    ? (int) now()->startOfDay()->diffInDays($deadlineDay, false)
                    : null;
                $isDeadlineDekat = $hariKeDeadline !== null && $hariKeDeadline <= 2 && $hariKeDeadline >= 0;
                $isOverdue       = $hariKeDeadline !== null && $hariKeDeadline < 0;

                return array_merge($order->toArray(), [
                    'hari_di_status'   => $hariDiStatus,
                    'is_bottleneck'    => $isBottleneck,
                    'is_deadline_dekat' => $isDeadlineDekat,
                    'is_overdue'       => $isOverdue,
                    'hari_ke_deadline' => $hariKeDeadline,
                    'threshold'        => $threshold,
                ]);
            });

        // Kelompokkan per status untuk kanban
        $ordersByStatus = [
            'desain'     => $orders->where('status', Order::STATUS_DESAIN)->values(),
            'procurement'=> $orders->where('status', Order::STATUS_PROCUREMENT)->values(),
            'produksi'   => $orders->where('status', Order::STATUS_PRODUKSI)->values(),
            'cutting'    => $orders->where('status', Order::STATUS_CUTTING)->values(),
            'jahit'      => $orders->where('status', Order::STATUS_JAHIT)->values(),
            'printing'   => $orders->where('status', Order::STATUS_PRINTING)->values(),
            'pemasangan' => $orders->where('status', Order::STATUS_PEMASANGAN)->values(),
        ];

        $bottlenecks = $orders->where('is_bottleneck', true)->values();

        // === STATS PER SUB-DIVISI ===
        $produksiDivisis = ['cutting', 'jahit', 'printing', 'pemasangan'];
        $statsPerDivisi  = [];

        // Output jahit hari ini (hanya jahit yang punya output tracking)
        $outputJahitHariIni = ProduksiJahitOutput::whereDate('tanggal', today())
            ->where('status', ProduksiJahitOutput::STATUS_APPROVED)
            ->sum('pcs_approved');

        foreach ($produksiDivisis as $divisi) {
            $statusKey   = 'STATUS_' . strtoupper($divisi);
            $statusConst = constant("App\\Models\\Order::{$statusKey}");

            $ordersInDivisi = $orders->where('status', $statusConst);
            $bottleneckCount = $ordersInDivisi->where('is_bottleneck', true)->count();
            $overdueCount    = $ordersInDivisi->where('is_overdue', true)->count();
            $totalPcs        = $ordersInDivisi->sum('jumlah');

            $target = ProduksiTarget::getActiveTarget($divisi, 'daily');

            $statsPerDivisi[$divisi] = [
                'order_count'     => $ordersInDivisi->count(),
                'total_pcs'       => $totalPcs,
                'bottleneck_count'=> $bottleneckCount,
                'overdue_count'   => $overdueCount,
                'target_pcs'      => $target?->target_pcs ?? 0,
                'target_id'       => $target?->id,
                // Output hari ini hanya tersedia untuk jahit (sistem tracking)
                'output_hari_ini' => $divisi === 'jahit' ? $outputJahitHariIni : null,
                'threshold_hari'  => $this->getBottleneckThreshold($divisi),
            ];
        }

        // === DAFTAR ESKALASI (order berisiko) ===
        // Order yang bottleneck ATAU overdue ATAU deadline sangat dekat (≤ 1 hari)
        $eskalasiOrders = $orders->filter(function ($order) {
            return $order['is_bottleneck'] || $order['is_overdue'] ||
                   ($order['hari_ke_deadline'] !== null && $order['hari_ke_deadline'] <= 1);
        })->sortBy('hari_ke_deadline')->values();

        return Inertia::render('Produksi/Index', [
            'ordersByStatus'   => $ordersByStatus,
            'bottlenecks'      => $bottlenecks,
            'statsPerDivisi'   => $statsPerDivisi,
            'eskalasiOrders'   => $eskalasiOrders,
            'thresholdSettings' => $this->getThresholds(),
            // Detail settings dengan label & deskripsi untuk UI pengaturan
            'thresholdConfig'  => SystemSetting::getGroup('produksi')
                ->map(fn ($s) => [
                    'key'         => $s->key,
                    'label'       => $s->label,
                    'description' => $s->description,
                    'value'       => (int) $s->value,
                    'type'        => $s->type,
                ])
                ->values(),
        ]);
    }

    /**
     * Kirim notifikasi eskalasi ke semua Owner dan Admin.
     * Dipanggil oleh Kepala Divisi Produksi saat ada order bermasalah.
     */
    public function eskalasi(Request $request, Order $order)
    {
        $data = $request->validate([
            'catatan' => 'required|string|max:500',
        ]);

        // Hitung hari di status saat ini
        $lastLog = $order->orderLogs()->latest()->first();
        $hariDiStatus = $lastLog
            ? (int) now()->diffInDays($lastLog->created_at)
            : 0;

        $dikirimOleh = $request->user()->name;

        // Kirim notifikasi ke semua Owner (level 1) dan Admin (level 2) yang aktif
        $penerima = User::whereIn('level_akses', [User::LEVEL_OWNER, User::LEVEL_ADMIN])
            ->where('is_active', true)
            ->get();

        foreach ($penerima as $user) {
            $user->notify(new EskalasiProduksi(
                order:        $order,
                catatan:      $data['catatan'],
                dikirimOleh:  $dikirimOleh,
                hariDiStatus: $hariDiStatus,
            ));
        }

        return back()->with('success', "Notifikasi eskalasi untuk Order #{$order->no_order} berhasil dikirim ke " . $penerima->count() . " manajemen.");
    }

    /**
     * Simpan atau update target harian/mingguan per sub-divisi.
     * Dibuat record baru jika belum ada untuk tanggal hari ini.
     */
    public function updateTarget(Request $request)
    {
        $data = $request->validate([
            'divisi'     => 'required|in:cutting,jahit,printing,pemasangan',
            'periode'    => 'required|in:daily,weekly',
            'target_pcs' => 'required|integer|min:0|max:99999',
        ]);

        ProduksiTarget::updateOrCreate(
            [
                'divisi'        => $data['divisi'],
                'periode'       => $data['periode'],
                'berlaku_mulai' => now()->toDateString(),
            ],
            [
                'target_pcs'  => $data['target_pcs'],
                'dibuat_oleh' => $request->user()->id,
            ]
        );

        return back()->with('success', "Target {$data['divisi']} berhasil diperbarui: {$data['target_pcs']} pcs.");
    }

    /**
     * Update threshold bottleneck per divisi di system_settings.
     * Hanya bisa dilakukan oleh Level 0 (Superadmin), 1 (Owner), atau 2 (Admin).
     */
    public function updateThreshold(Request $request)
    {
        $data = $request->validate([
            'key'   => 'required|string|starts_with:produksi.threshold.|exists:system_settings,key',
            'value' => 'required|integer|min:1|max:365',
        ]);

        SystemSetting::set($data['key'], $data['value'], $request->user()->id);

        $label = SystemSetting::where('key', $data['key'])->value('label');

        return back()->with('success', "Pengaturan \"{$label}\" berhasil diperbarui menjadi {$data['value']} hari.");
    }
}
