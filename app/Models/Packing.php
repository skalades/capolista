<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Packing extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'checklist_packing',
        'kurir',
        'no_resi',
        'tanggal_kirim',
        'status',
        'catatan',
        'packing_dikerjakan_oleh',
    ];

    protected $casts = [
        'checklist_packing' => 'array',
        'tanggal_kirim' => 'date',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function pekerja(): BelongsTo
    {
        return $this->belongsTo(User::class, 'packing_dikerjakan_oleh');
    }
}
