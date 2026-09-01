<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrderItem extends Model
{
    protected $fillable = [
        'purchase_order_id', 'bahan_id', 'nama_bahan', 'jumlah', 'satuan', 'harga_satuan'
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function bahan()
    {
        return $this->belongsTo(StokBahan::class, 'bahan_id');
    }
}
