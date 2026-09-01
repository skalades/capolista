<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StokBahan extends Model
{
    use HasFactory;

    protected $table = 'stok_bahan';

    protected $fillable = [
        'nama_bahan',
        'satuan',
        'jumlah_stok',
        'minimum_stok',
        'keterangan',
    ];

    protected $casts = [
        'jumlah_stok' => 'decimal:2',
        'minimum_stok' => 'decimal:2',
    ];

    public function getIsLowStockAttribute(): bool
    {
        return $this->jumlah_stok <= $this->minimum_stok;
    }
    
    public function isLowStock(): bool
    {
        return $this->jumlah_stok <= $this->minimum_stok;
    }

    public function mutasi(): HasMany
    {
        return $this->hasMany(StokMutasi::class, 'bahan_id');
    }
}
