<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StokMutasi extends Model
{
    use HasFactory;

    protected $table = 'stok_mutasi';

    protected $fillable = [
        'bahan_id',
        'tipe',
        'jumlah',
        'keterangan',
        'mutasi_order_id',
        'mutasi_created_by',
    ];

    protected $casts = [
        'jumlah' => 'decimal:2',
    ];

    public function bahan(): BelongsTo
    {
        return $this->belongsTo(StokBahan::class, 'bahan_id');
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'mutasi_order_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mutasi_created_by');
    }
}
