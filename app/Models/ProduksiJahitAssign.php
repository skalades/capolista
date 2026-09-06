<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProduksiJahitAssign extends Model
{
    use HasFactory;

    protected $table = 'produksi_jahit_assigns';

    protected $fillable = [
        'order_id',
        'operator_id',
        'jenis_produk',
        'tarif_per_pcs',
        'tanggal_assign',
        'dibuat_oleh',
        'is_active',
        'catatan',
    ];

    protected $casts = [
        'tarif_per_pcs' => 'decimal:2',
        'tanggal_assign' => 'date',
        'is_active'      => 'boolean',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function operator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    public function pembuat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    public function outputs(): HasMany
    {
        return $this->hasMany(ProduksiJahitOutput::class, 'assign_id');
    }

    public function tarifHistories(): HasMany
    {
        return $this->hasMany(TarifBoronganHistory::class, 'assign_id');
    }

    public function qcRejects(): HasMany
    {
        return $this->hasMany(ProduksiJahitQcReject::class, 'assign_id');
    }

    /**
     * Total pcs yang sudah diapprove untuk assign ini.
     */
    public function getTotalPcsApprovedAttribute(): int
    {
        $approved = (int) $this->outputs()->where('status', ProduksiJahitOutput::STATUS_APPROVED)->sum('pcs_approved');
        $pendingRejects = (int) $this->qcRejects()->where('status', 'pending')->sum('jumlah');
        return max(0, $approved - $pendingRejects);
    }

    /**
     * Total rincian ukuran yang sudah disubmit (menunggu approval atau sudah approved).
     */
    public function getTotalRincianSelesaiAttribute(): array
    {
        $outputs = $this->outputs()->whereIn('status', [
            ProduksiJahitOutput::STATUS_MENUNGGU_APPROVAL,
            ProduksiJahitOutput::STATUS_APPROVED
        ])->get();

        $totals = [];
        foreach ($outputs as $out) {
            if (is_array($out->rincian_ukuran)) {
                foreach ($out->rincian_ukuran as $uk => $qty) {
                    if ($uk === 'total') continue; // abaikan jika format lama
                    $totals[$uk] = ($totals[$uk] ?? 0) + (int) $qty;
                }
            }
        }
        return $totals;
    }

    /**
     * Total upah yang sudah diapprove untuk assign ini.
     */
    public function getTotalUpahAttribute(): float
    {
        return (float) $this->outputs()->where('status', ProduksiJahitOutput::STATUS_APPROVED)->sum('upah_kotor');
    }
}
