<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Penggajian extends Model
{
    use HasFactory;

    protected $table = 'penggajians';

    public const STATUS_DRAFT    = 'draft';
    public const STATUS_DISETUJUI = 'disetujui';
    public const STATUS_DIBAYAR  = 'dibayar';

    public const STATUS_LABELS = [
        self::STATUS_DRAFT     => 'Draft',
        self::STATUS_DISETUJUI => 'Disetujui',
        self::STATUS_DIBAYAR   => 'Dibayar',
    ];

    public const STATUS_COLORS = [
        self::STATUS_DRAFT     => 'gray',
        self::STATUS_DISETUJUI => 'blue',
        self::STATUS_DIBAYAR   => 'green',
    ];

    protected $fillable = [
        'karyawan_id',
        'periode_mulai',
        'periode_selesai',
        'tipe_gaji',
        'total_hari_hadir',
        'total_hari_izin',
        'total_hari_sakit',
        'total_hari_alpha',
        'total_jam_lembur',
        'total_pcs_approved',
        'upah_pokok',
        'upah_lembur',
        'tunjangan',
        'potongan',
        'catatan_potongan',
        'total_upah_kotor',
        'total_upah_bersih',
        'status_bayar',
        'dibuat_oleh',
        'disetujui_oleh',
        'disetujui_at',
        'dibayar_at',
        'catatan',
    ];

    protected $casts = [
        'periode_mulai'      => 'date',
        'periode_selesai'    => 'date',
        'total_hari_hadir'   => 'integer',
        'total_hari_izin'    => 'integer',
        'total_hari_sakit'   => 'integer',
        'total_hari_alpha'   => 'integer',
        'total_jam_lembur'   => 'decimal:2',
        'total_pcs_approved' => 'integer',
        'upah_pokok'         => 'decimal:2',
        'upah_lembur'        => 'decimal:2',
        'tunjangan'          => 'decimal:2',
        'potongan'           => 'decimal:2',
        'total_upah_kotor'   => 'decimal:2',
        'total_upah_bersih'  => 'decimal:2',
        'disetujui_at'       => 'datetime',
        'dibayar_at'         => 'datetime',
    ];

    public function karyawan(): BelongsTo
    {
        return $this->belongsTo(User::class, 'karyawan_id');
    }

    public function pembuat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    public function penyetuju(): BelongsTo
    {
        return $this->belongsTo(User::class, 'disetujui_oleh');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PenggajianItem::class, 'penggajian_id');
    }

    public function isDraft(): bool
    {
        return $this->status_bayar === self::STATUS_DRAFT;
    }

    public function isDisetujui(): bool
    {
        return $this->status_bayar === self::STATUS_DISETUJUI;
    }

    public function isDibayar(): bool
    {
        return $this->status_bayar === self::STATUS_DIBAYAR;
    }
}
