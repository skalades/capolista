<?php

declare(strict_types=1);

namespace App\Helpers;

use App\Models\Order;

class OrderHelper
{
    public static function generateNoOrder(): string
    {
        $prefix = 'CPL-' . now()->format('Ym') . '-';
        $last = Order::where('no_order', 'like', $prefix . '%')
            ->orderBy('no_order', 'desc')
            ->first();
            
        $number = $last ? (int) substr($last->no_order, -4) + 1 : 1;
        
        return $prefix . str_pad((string)$number, 4, '0', STR_PAD_LEFT);
    }
}
