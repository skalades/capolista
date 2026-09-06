<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProduksiTarget extends Model
{
    protected $fillable = [
        'divisi',
        'periode',
        'target_pcs',
        'berlaku_mulai',
        'dibuat_oleh',
    ];

    protected $casts = [
        'berlaku_mulai' => 'date',
        'target_pcs'    => 'integer',
    ];

    /**
     * Divisi produksi yang bisa diset target.
     */
    public const DIVISI_LIST = ['cutting', 'jahit', 'printing', 'pemasangan'];

    /**
     * Threshold bottleneck per divisi (dalam hari).
     * Jika order sudah berada di status ini > threshold, dianggap bottleneck.
     */
    public const BOTTLENECK_THRESHOLD = [
        'cutting'    => 2,
        'jahit'      => 5,
        'printing'   => 2,
        'pemasangan' => 2,
    ];

    public function pembuat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    /**
     * Ambil target aktif hari ini per divisi.
     * Menggunakan target terbaru (berlaku_mulai <= hari ini).
     */
    public static function getActiveTarget(string $divisi, string $periode = 'daily'): ?self
    {
        return static::where('divisi', $divisi)
            ->where('periode', $periode)
            ->where('berlaku_mulai', '<=', now()->toDateString())
            ->orderByDesc('berlaku_mulai')
            ->first();
    }
}
