<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pemasangan extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'suhu_heat_press',
        'waktu_curing',
        'checklist_qc',
        'status',
        'status_qc',
        'catatan',
        'foto_qc',
        'pemasangan_dikerjakan_oleh',
    ];

    protected $casts = [
        'checklist_qc' => 'array',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function pekerja(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pemasangan_dikerjakan_oleh');
    }
}
