<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Absensi extends Model
{
    use HasFactory;

    protected $table = 'absensi';

    public const STATUS_HADIR = 'hadir';
    public const STATUS_IZIN  = 'izin';
    public const STATUS_SAKIT = 'sakit';
    public const STATUS_ALPHA = 'alpha';

    public const STATUS_LABELS = [
        self::STATUS_HADIR => 'Hadir',
        self::STATUS_IZIN  => 'Izin',
        self::STATUS_SAKIT => 'Sakit',
        self::STATUS_ALPHA => 'Alpha',
    ];

    public const STATUS_COLORS = [
        self::STATUS_HADIR => 'green',
        self::STATUS_IZIN  => 'blue',
        self::STATUS_SAKIT => 'yellow',
        self::STATUS_ALPHA => 'red',
    ];

    protected $fillable = [
        'karyawan_id',
        'tanggal',
        'status_hadir',
        'jam_lembur',
        'dicatat_oleh',
        'keterangan',
    ];

    protected $casts = [
        'tanggal'    => 'date',
        'jam_lembur' => 'decimal:2',
    ];

    public function karyawan(): BelongsTo
    {
        return $this->belongsTo(User::class, 'karyawan_id');
    }

    public function pencatat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dicatat_oleh');
    }

    public function scopeHadir($query)
    {
        return $query->where('status_hadir', self::STATUS_HADIR);
    }

    public function scopePeriode($query, string $start, string $end)
    {
        return $query->whereBetween('tanggal', [$start, $end]);
    }
}
