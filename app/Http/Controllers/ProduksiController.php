<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProduksiController extends Controller
{
    public function index()
    {
        $statusList = [Order::STATUS_DESAIN, Order::STATUS_PRINTING, Order::STATUS_PEMASANGAN, Order::STATUS_PRODUKSI];

        $orders = Order::with(['customer'])
            ->whereIn('status', $statusList)
            ->get()
            ->map(function ($order) {
                // Hitung berapa hari sejak log status terakhir
                $lastLog = $order->orderLogs()->latest()->first();
                $hariDiStatus = $lastLog
                    ? (int) now()->diffInDays($lastLog->created_at)
                    : 0;

                return array_merge($order->toArray(), [
                    'hari_di_status' => $hariDiStatus,
                    'is_bottleneck'  => $hariDiStatus > 3,
                ]);
            });

        $ordersByStatus = [
            'desain'     => $orders->where('status', Order::STATUS_DESAIN)->values(),
            'printing'   => $orders->where('status', Order::STATUS_PRINTING)->values(),
            'pemasangan' => $orders->where('status', Order::STATUS_PEMASANGAN)->values(),
            'produksi'   => $orders->where('status', Order::STATUS_PRODUKSI)->values(),
        ];

        $bottlenecks = $orders->where('is_bottleneck', true)->values();

        return Inertia::render('Produksi/Index', [
            'ordersByStatus' => $ordersByStatus,
            'bottlenecks'    => $bottlenecks,
        ]);
    }
}

