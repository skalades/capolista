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

        if ($level === \App\Models\User::LEVEL_STAF) {
            $produksiDivisions = ['jahit', 'cutting', 'printing', 'pemasangan'];
            if (in_array($user->divisi, $produksiDivisions)) {
                return redirect()->route($user->divisi . '.index');
            }
        }
        
        $stats = [
            'total_order_aktif'     => \App\Models\Order::whereNotIn('status', ['selesai'])->count(),
            'total_order_selesai'   => \App\Models\Order::where('status', 'selesai')->count(),
            'total_order_terlambat' => \App\Models\Order::whereNotIn('status', ['selesai'])
                ->where('deadline', '<', now()->toDateString())
                ->count(),
            'total_customer'        => \App\Models\Customer::count(),
        ];
        
        $today = now()->startOfDay();
        $recentOrders = \App\Models\Order::with('customer')->latest()->take(10)->get();
        $upcomingDeadlines = \App\Models\Order::with('customer')
            ->whereNotIn('status', ['selesai', 'dikirim'])
            ->whereBetween('deadline', [$today->toDateString(), $today->copy()->addDays(3)->toDateString()])
            ->orderBy('deadline')
            ->take(10)
            ->get()
            ->map(function ($order) use ($today) {
                $deadlineDay   = $order->deadline->copy()->startOfDay();
                $daysRemaining = (int) $today->diffInDays($deadlineDay, false);
                $order->days_remaining = max(0, $daysRemaining);
                return $order;
            });
        $lowStockCount = \App\Models\StokBahan::whereColumn('jumlah_stok', '<=', 'minimum_stok')->count();


        $extraData = [];

        if ($level === \App\Models\User::LEVEL_SUPERADMIN) {
            $today = now()->toDateString();
            
            // Absensi
            $totalKaryawan = \App\Models\User::whereIn('level_akses', [\App\Models\User::LEVEL_KEPALA_DIVISI, \App\Models\User::LEVEL_STAF])->where('is_active', true)->count();
            $karyawanHadir = \App\Models\Absensi::where('tanggal', $today)->where('status_hadir', 'hadir')->count();

            // Produksi (Funnel)
            $orderPerStatus = \App\Models\Order::selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status');

            // Actionable Alerts
            $approvalMenunggu = \App\Models\Order::where('status', 'desain')->count() + \App\Models\Penggajian::where('status_bayar', 'draft')->count(); // Estimasi approval
            
            // Arus Kas 6 Bulan (for Superadmin)
            $arusKas = collect();
            for ($i = 5; $i >= 0; $i--) {
                $start = now()->subMonths($i)->startOfMonth();
                $end = now()->subMonths($i)->endOfMonth();
                $pemasukan = \App\Models\Pembayaran::whereBetween('tanggal', [$start, $end])->sum('jumlah');
                $pengeluaran = \App\Models\Pengeluaran::whereBetween('tanggal', [$start, $end])->sum('jumlah');
                
                $arusKas->push([
                    'date' => $start->format('M Y'),
                    'pemasukan' => $pemasukan,
                    'pengeluaran' => $pengeluaran
                ]);
            }

            // Tren Order Masuk (7 Hari)
            $trenOrder = collect();
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i);
                $count = \App\Models\Order::whereDate('tanggal_order', $date->toDateString())->count();
                $trenOrder->push([
                    'date' => $date->format('d M'),
                    'total' => $count
                ]);
            }

            // Pengiriman Hari Ini
            $pengirimanHariIni = \App\Models\Order::with('customer')
                ->whereIn('status', ['packing', 'dikirim'])
                ->whereDate('deadline', $today)
                ->take(5)
                ->get();

            $extraData = [
                // Ringkasan
                'order_selesai_bulan_ini' => \App\Models\Order::where('status', 'selesai')->whereMonth('updated_at', now()->month)->count(),
                'pendapatan_bulan_ini'    => \App\Models\Pembayaran::whereMonth('tanggal', now()->month)->sum('jumlah'),
                'karyawan_hadir'          => $karyawanHadir,
                'total_karyawan'          => $totalKaryawan,

                // Jalur Produksi
                'funnel' => [
                    'draft'      => $orderPerStatus->get('draft', 0),
                    'printing'   => $orderPerStatus->get('printing', 0),
                    'cutting_jahit' => ($orderPerStatus->get('cutting', 0) + $orderPerStatus->get('jahit', 0)),
                    'qc_packing' => $orderPerStatus->get('packing', 0),
                    'dikirim'    => $orderPerStatus->get('dikirim', 0),
                ],

                // Alerts
                'menunggu_approval' => $approvalMenunggu,

                // Tabel
                'pengiriman_hari_ini' => $pengirimanHariIni,

                // Charts
                'arus_kas' => $arusKas,
                'tren_order' => $trenOrder,

                // Tabel Piutang Menunggak
                'piutang_menunggak'   => \App\Models\Order::where('sisa_bayar', '>', 0)
                                            ->with('customer')
                                            ->orderBy('tanggal_order', 'asc')
                                            ->get()
                                            ->map(function ($order) {
                                                $days = (int) \Carbon\Carbon::parse($order->tanggal_order)->diffInDays(\Carbon\Carbon::now());
                                                return [
                                                    'id' => $order->id,
                                                    'no_order' => $order->no_order,
                                                    'customer' => $order->customer->nama ?? 'Unknown',
                                                    'sisa_bayar' => $order->sisa_bayar,
                                                    'hari' => $days
                                                ];
                                            }),
            ];
        } elseif ($level === \App\Models\User::LEVEL_OWNER) {
            $omzetBulanIni = \App\Models\Order::where('status', 'selesai')
                ->whereMonth('updated_at', now()->month)
                ->whereYear('updated_at', now()->year)
                ->sum('total_harga');
            $totalPiutang = \App\Models\Order::where('status', '!=', 'draft')
                ->where('sisa_bayar', '>', 0)
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
            'cutting'    => [\App\Models\Order::STATUS_CUTTING],
            'jahit'      => [\App\Models\Order::STATUS_JAHIT],
            'printing'   => [\App\Models\Order::STATUS_PRINTING],
            'pemasangan' => [\App\Models\Order::STATUS_PEMASANGAN],
            'produksi'   => [\App\Models\Order::STATUS_PRODUKSI, \App\Models\Order::STATUS_CUTTING, \App\Models\Order::STATUS_JAHIT, \App\Models\Order::STATUS_PRINTING, \App\Models\Order::STATUS_PEMASANGAN],
            'gudang'     => [\App\Models\Order::STATUS_PACKING, \App\Models\Order::STATUS_DIKIRIM],
            'pemasaran'  => [\App\Models\Order::STATUS_DRAFT, \App\Models\Order::STATUS_DESAIN],
            'keuangan'   => [\App\Models\Order::STATUS_DIKIRIM, \App\Models\Order::STATUS_SELESAI],
            'pembelian'  => [\App\Models\Order::STATUS_PROCUREMENT],
            default      => [],
        };
    }
}

