<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'jenis_produk',
        'ukuran',
        'jumlah_pcs',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
