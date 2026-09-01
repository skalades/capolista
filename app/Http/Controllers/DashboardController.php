<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\StokBahan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
        public function index(Request $request)
    {
        $user = $request->user();
        $level = $user->level_akses;
        
        $stats = [
            'total_order_aktif'     => \App\Models\Order::whereNotIn('status', ['selesai'])->count(),
            'total_order_selesai'   => \App\Models\Order::where('status', 'selesai')->count(),
            'total_order_terlambat' => \App\Models\Order::whereNotIn('status', ['selesai'])
                ->where('deadline', '<', now()->toDateString())
                ->count(),
            'total_customer'        => \App\Models\Customer::count(),
        ];
        
        $recentOrders = \App\Models\Order::with('customer')->latest()->take(5)->get();
        $upcomingDeadlines = \App\Models\Order::with('customer')
            ->whereNotIn('status', ['selesai'])
            ->whereBetween('deadline', [now()->toDateString(), now()->addDays(7)->toDateString()])
            ->orderBy('deadline')
            ->take(5)
            ->get();
        $lowStockCount = \App\Models\StokBahan::whereColumn('jumlah_stok', '<=', 'minimum_stok')->count();

        $extraData = [];

        if ($level === \App\Models\User::LEVEL_SUPERADMIN) {
            $extraData = [
                'total_users'         => \App\Models\User::count(),
                'active_users'        => \App\Models\User::where('is_active', true)->count(),
                'inactive_users'      => \App\Models\User::where('is_active', false)->count(),
                'total_roles'         => \Spatie\Permission\Models\Role::count(),
                'ringkasan_divisi'    => \App\Models\User::selectRaw('divisi, count(*) as total')->groupBy('divisi')->pluck('total', 'divisi'),
                'recent_users'        => \App\Models\User::with('roles')->latest()->take(5)->get(),
            ];
        } elseif ($level === \App\Models\User::LEVEL_OWNER) {
            $omzetBulanIni = \App\Models\Order::where('status', 'selesai')
                ->whereMonth('updated_at', now()->month)
                ->whereYear('updated_at', now()->year)
                ->sum('total_harga');
            $totalPiutang = \App\Models\Order::whereNotIn('status', ['selesai', 'draft'])
                ->sum('sisa_bayar');
            $extraData = [
                'omzet_bulan_ini'  => $omzetBulanIni,
                'total_piutang'    => $totalPiutang,
                'order_per_status' => \App\Models\Order::selectRaw('status, count(*) as total')
                    ->groupBy('status')->pluck('total', 'status'),
                'order_selesai'    => \App\Models\Order::where('status', 'selesai')->count(),
                'order_terlambat'  => \App\Models\Order::whereNotIn('status', ['selesai'])->where('deadline', '<', now()->toDateString())->count(),
            ];
        } elseif ($level === \App\Models\User::LEVEL_ADMIN) {
            $extraData = [
                'order_aktif'             => \App\Models\Order::whereNotIn('status', ['selesai', 'draft'])->count(),
                'order_terlambat'         => \App\Models\Order::whereNotIn('status', ['selesai'])->where('deadline', '<', now()->toDateString())->count(),
                'order_menunggu_approval' => \App\Models\Order::where('status', 'desain')->count(),
                'order_bottleneck'        => \App\Models\Order::whereNotIn('status', ['selesai', 'draft'])
                    ->where('updated_at', '<', now()->subDays(3))->count(),
            ];
        } elseif ($level === \App\Models\User::LEVEL_KEPALA_DIVISI) {
            $divisiStatus = $this->getDivisiStatus($user->divisi ?? '');
            
            $extraData = [
                'tugas_aktif_count'  => \App\Models\Order::whereIn('status', $divisiStatus)->count(),
                'bottleneck_count'   => \App\Models\Order::whereIn('status', $divisiStatus)->where('updated_at', '<', now()->subDays(3))->count(),
                'selesai_minggu_ini' => \App\Models\Order::whereIn('status', $divisiStatus)->where('updated_at', '>=', now()->startOfWeek())->count(),
                'tugas_divisi'       => \App\Models\Order::whereIn('status', $divisiStatus)->with('customer')->latest()->take(10)->get(),
            ];
        } elseif ($level === \App\Models\User::LEVEL_STAF) {
            $divisiStatus = $this->getDivisiStatus($user->divisi ?? '');
            
            $stafQuery = \App\Models\Order::query();
            switch($user->divisi) {
                case 'desain': $stafQuery->whereHas('desain', fn($q) => $q->where('desain_dikerjakan_oleh', $user->id)); break;
                case 'printing': $stafQuery->whereHas('printing', fn($q) => $q->where('printing_dikerjakan_oleh', $user->id)); break;
                case 'pemasangan': $stafQuery->whereHas('pemasangan', fn($q) => $q->where('pemasangan_dikerjakan_oleh', $user->id)); break;
                case 'gudang': $stafQuery->whereHas('packing', fn($q) => $q->where('packing_dikerjakan_oleh', $user->id)); break;
                default: $stafQuery->whereIn('status', $divisiStatus); // fallback
            }

            $extraData = [
                'tugas_hari_ini'     => (clone $stafQuery)->whereIn('status', $divisiStatus)->whereDate('deadline', now()->toDateString())->count(),
                'tugas_pending'      => (clone $stafQuery)->whereIn('status', $divisiStatus)->count(),
                'selesai_minggu_ini' => (clone $stafQuery)->where('updated_at', '>=', now()->startOfWeek())->count(),
                'tugas_aktif'        => (clone $stafQuery)->whereIn('status', $divisiStatus)->with('customer')->latest()->take(10)->get(),
            ];
        }

        return Inertia::render('Dashboard', [
            'stats'             => $stats,
            'recentOrders'      => $recentOrders,
            'upcomingDeadlines' => $upcomingDeadlines,
            'lowStockCount'     => $lowStockCount,
            'extraData'         => $extraData,
        ]);
    }

    private function getDivisiStatus(string $divisi): array
    {
        return match ($divisi) {
            'desain'     => [\App\Models\Order::STATUS_DESAIN],
            'printing'   => [\App\Models\Order::STATUS_PRINTING],
            'pemasangan' => [\App\Models\Order::STATUS_PEMASANGAN],
            'produksi'   => [\App\Models\Order::STATUS_PRODUKSI, \App\Models\Order::STATUS_DESAIN, \App\Models\Order::STATUS_PRINTING, \App\Models\Order::STATUS_PEMASANGAN],
            'gudang'     => [\App\Models\Order::STATUS_PACKING, \App\Models\Order::STATUS_DIKIRIM],
            'pemasaran'  => [\App\Models\Order::STATUS_DRAFT, \App\Models\Order::STATUS_DESAIN],
            'keuangan'   => [\App\Models\Order::STATUS_DIKIRIM, \App\Models\Order::STATUS_SELESAI],
            'pembelian'  => [\App\Models\Order::STATUS_PROCUREMENT],
            default      => [],
        };
    }
}

