<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProduksiCuttingOutput extends Model
{
    use HasFactory;

    protected $table = 'produksi_cutting_outputs';

    public const STATUS_DRAFT              = 'draft';
    public const STATUS_MENUNGGU_APPROVAL  = 'menunggu_approval';
    public const STATUS_APPROVED           = 'approved';
    public const STATUS_REJECTED           = 'rejected';

    public const STATUS_LABELS = [
        self::STATUS_DRAFT             => 'Draft',
        self::STATUS_MENUNGGU_APPROVAL => 'Menunggu Approval',
        self::STATUS_APPROVED          => 'Disetujui',
        self::STATUS_REJECTED          => 'Ditolak',
    ];

    public const STATUS_COLORS = [
        self::STATUS_DRAFT             => 'gray',
        self::STATUS_MENUNGGU_APPROVAL => 'yellow',
        self::STATUS_APPROVED          => 'green',
        self::STATUS_REJECTED          => 'red',
    ];

    protected $fillable = [
        'assign_id',
        'operator_id',
        'order_id',
        'tanggal',
        'pcs_klaim',
        'rincian_ukuran',
        'pcs_approved',
        'tarif_per_pcs_snapshot',
        'upah_kotor',
        'status',
        'approved_by',
        'approved_at',
        'catatan_mandor',
        'catatan_operator',
    ];

    protected $casts = [
        'tanggal'               => 'date',
        'pcs_klaim'             => 'integer',
        'pcs_approved'          => 'integer',
        'rincian_ukuran'        => 'array',
        'tarif_per_pcs_snapshot' => 'decimal:2',
        'upah_kotor'            => 'decimal:2',
        'approved_at'           => 'datetime',
    ];

    public function assign(): BelongsTo
    {
        return $this->belongsTo(ProduksiCuttingAssign::class, 'assign_id');
    }

    public function operator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Hitung upah kotor berdasarkan pcs_approved dan tarif snapshot.
     */
    public function hitungUpah(): float
    {
        return (float) (($this->pcs_approved ?? 0) * $this->tarif_per_pcs_snapshot);
    }

    /**
     * Scope: output yang menunggu approval mandor.
     */
    public function scopeMenungguApproval($query)
    {
        return $query->where('status', self::STATUS_MENUNGGU_APPROVAL);
    }

    /**
     * Scope: output yang sudah approved dalam periode.
     */
    public function scopeApprovedPeriode($query, string $start, string $end)
    {
        return $query->where('status', self::STATUS_APPROVED)
                     ->whereBetween('tanggal', [$start, $end]);
    }
}
