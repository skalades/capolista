<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProduksiCutting extends Model
{
    use HasFactory;

    protected $table = 'produksi_cuttings';

    public const STATUS_MENUNGGU  = 'menunggu';
    public const STATUS_DIKERJAKAN = 'dikerjakan';
    public const STATUS_SELESAI   = 'selesai';

    protected $fillable = [
        'order_id',
        'operator_id',
        'dikerjakan_oleh',
        'tanggal',
        'pcs_per_ukuran',
        'total_pcs',
        'qc_akurasi_ukuran',
        'qc_arah_kain',
        'qc_tidak_cacat',
        'catatan_qc',
        'status',
        'selesai_at',
        'catatan',
    ];

    protected $casts = [
        'tanggal'           => 'date',
        'pcs_per_ukuran'    => 'array',
        'total_pcs'         => 'integer',
        'qc_akurasi_ukuran' => 'boolean',
        'qc_arah_kain'      => 'boolean',
        'qc_tidak_cacat'    => 'boolean',
        'selesai_at'        => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function operator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    public function pekerja(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dikerjakan_oleh');
    }

    /**
     * Apakah semua checklist QC lulus?
     */
    public function isQcLulus(): bool
    {
        return $this->qc_akurasi_ukuran && $this->qc_arah_kain && $this->qc_tidak_cacat;
    }

    /**
     * Hitung total pcs dari breakdown ukuran.
     */
    public function hitungTotalPcs(): int
    {
        if (!$this->pcs_per_ukuran) {
            return 0;
        }
        return (int) array_sum($this->pcs_per_ukuran);
    }
}
