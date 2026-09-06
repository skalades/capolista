<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProduksiJahitQcReject extends Model
{
    protected $fillable = [
        'order_id',
        'operator_id',
        'assign_id',
        'jumlah',
        'alasan',
        'status',
        'dibuat_oleh'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function operator()
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    public function assign()
    {
        return $this->belongsTo(ProduksiJahitAssign::class, 'assign_id');
    }

    public function pembuat()
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }
}
