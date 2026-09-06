<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Kembalikan daftar order yang deadline-nya dalam 3 hari ke depan.
     * Digunakan oleh BellIcon dropdown di topbar (semua role).
     */
    public function deadlines(Request $request): JsonResponse
    {
        $today    = now()->startOfDay();
        $limit    = now()->addDays(3)->endOfDay();

        $orders = Order::with('customer')
            ->whereNotIn('status', [Order::STATUS_SELESAI, Order::STATUS_DIKIRIM])
            ->whereBetween('deadline', [$today->toDateString(), $limit->toDateString()])
            ->orderBy('deadline')
            ->get()
            ->map(function (Order $order) use ($today) {
                $deadlineDay    = $order->deadline->copy()->startOfDay();
                $daysRemaining  = (int) $today->diffInDays($deadlineDay, false);

                return [
                    'id'             => $order->id,
                    'no_order'       => $order->no_order,
                    'customer_nama'  => $order->customer?->nama ?? '-',
                    'deadline'       => $order->deadline->toDateString(),
                    'days_remaining' => max(0, $daysRemaining),
                    'status'         => $order->status,
                    'status_label'   => Order::STATUS_LABELS[$order->status] ?? $order->status,
                    'status_color'   => Order::STATUS_COLORS[$order->status] ?? 'gray',
                ];
            });

        return response()->json([
            'count'  => $orders->count(),
            'orders' => $orders->values(),
        ]);
    }
}
