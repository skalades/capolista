<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrackOrderController extends Controller
{
    public function index(Request $request)
    {
        $invoice = $request->query('invoice');
        $orderData = null;
        
        if ($invoice) {
            $order = Order::with(['orderLogs' => function($q) {
                $q->orderBy('created_at', 'desc');
            }])->where('no_order', $invoice)->first();

            if ($order) {
                $orderData = [
                    'no_order' => $order->no_order,
                    'tanggal_order' => $order->tanggal_order->format('d/m/Y'),
                    'status' => $order->status,
                    'status_label' => Order::STATUS_LABELS[$order->status] ?? $order->status,
                    'jenis_produk' => $order->jenis_produk,
                    'jumlah' => $order->jumlah,
                    'logs' => $order->orderLogs->map(function ($log) {
                        return [
                            'status_baru' => $log->status_baru,
                            'status_label' => Order::STATUS_LABELS[$log->status_baru] ?? $log->status_baru,
                            'tanggal' => $log->created_at->format('d/m/Y H:i'),
                            'catatan' => $log->catatan
                        ];
                    })
                ];
            }
        }

        return Inertia::render('TrackOrder', [
            'invoice' => $invoice,
            'order' => $orderData,
            'status_labels' => Order::STATUS_LABELS,
            'status_colors' => Order::STATUS_COLORS,
        ]);
    }
}
