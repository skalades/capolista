<?php

declare(strict_types=1);

namespace App\Helpers;

use App\Models\Order;
use Illuminate\Support\Facades\DB;

class OrderHelper
{
    /**
     * Generate nomor order unik yang aman dari race condition.
     * Menggunakan DB::transaction + lockForUpdate agar tidak ada duplikat
     * ketika ada concurrent request di waktu yang bersamaan.
     */
    public static function generateNoOrder(): string
    {
        return DB::transaction(function () {
            $prefix = 'CPL-' . now()->format('Ym') . '-';
            $last = Order::where('no_order', 'like', $prefix . '%')
                ->orderBy('no_order', 'desc')
                ->lockForUpdate()
                ->first();

            $number = $last ? (int) substr($last->no_order, -4) + 1 : 1;

            return $prefix . str_pad((string) $number, 4, '0', STR_PAD_LEFT);
        });
    }
}
