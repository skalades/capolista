<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProduksiCuttingQcReject extends Model
{
    use HasFactory;

    protected $table = 'produksi_cutting_qc_rejects';

    protected $fillable = [
        'order_id',
        'operator_id',
        'assign_id',
        'jumlah',
        'alasan',
        'status', // pending, resolved
        'dibuat_oleh',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function operator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    public function assign(): BelongsTo
    {
        return $this->belongsTo(ProduksiCuttingAssign::class, 'assign_id');
    }

    public function pembuat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }
}
