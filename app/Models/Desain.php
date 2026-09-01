<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Desain extends Model
{
    use HasFactory;

    public const STATUS_MENUNGGU = 'menunggu';
    public const STATUS_DIKERJAKAN = 'dikerjakan';
    public const STATUS_REVISI = 'revisi';
    public const STATUS_DISETUJUI = 'disetujui';

    protected $fillable = [
        'order_id',
        'versi',
        'file_mockup',
        'catatan_revisi',
        'status',
        'desain_dikerjakan_oleh',
        'desain_disetujui_oleh',
        'disetujui_at',
    ];

    protected $casts = [
        'disetujui_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function pekerja(): BelongsTo
    {
        return $this->belongsTo(User::class, 'desain_dikerjakan_oleh');
    }

    public function penyetuju(): BelongsTo
    {
        return $this->belongsTo(User::class, 'desain_disetujui_oleh');
    }
}
