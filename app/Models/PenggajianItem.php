<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PenggajianItem extends Model
{
    use HasFactory;

    protected $table = 'penggajian_items';

    public const TIPE_BORONGAN  = 'borongan';
    public const TIPE_HARIAN    = 'harian';
    public const TIPE_POKOK     = 'pokok';    // Gaji pokok bulanan
    public const TIPE_LEMBUR    = 'lembur';
    public const TIPE_TUNJANGAN = 'tunjangan';
    public const TIPE_POTONGAN  = 'potongan';

    protected $fillable = [
        'penggajian_id',
        'tipe_item',
        'tanggal',
        'order_id',
        'jenis_produk',
        'pcs',
        'tarif',
        'subtotal',
        'keterangan',
    ];

    protected $casts = [
        'tanggal'  => 'date',
        'pcs'      => 'integer',
        'tarif'    => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function penggajian(): BelongsTo
    {
        return $this->belongsTo(Penggajian::class, 'penggajian_id');
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
