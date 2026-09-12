<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TarifCuttingHistory extends Model
{
    use HasFactory;

    protected $table = 'tarif_cutting_histories';

    protected $fillable = [
        'assign_id',
        'operator_id',
        'order_id',
        'tarif_per_pcs_lama',
        'tarif_per_pcs_baru',
        'berlaku_mulai',
        'berlaku_sampai',
        'diubah_oleh',
        'alasan',
    ];

    protected $casts = [
        'tarif_per_pcs_lama' => 'decimal:2',
        'tarif_per_pcs_baru' => 'decimal:2',
        'berlaku_mulai'      => 'datetime',
        'berlaku_sampai'     => 'datetime',
    ];

    public function assign(): BelongsTo
    {
        return $this->belongsTo(ProduksiCuttingAssign::class, 'assign_id');
    }

    public function operator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    public function pengubah(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diubah_oleh');
    }
}
