<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Printing extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'metode_cetak',
        'jumlah_warna',
        'estimasi_selesai',
        'tanggal_mulai',
        'tanggal_selesai',
        'status',
        'status_qc',
        'catatan_qc',
        'foto_qc',
        'printing_dikerjakan_oleh',
    ];

    protected $casts = [
        'estimasi_selesai' => 'date',
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function pekerja(): BelongsTo
    {
        return $this->belongsTo(User::class, 'printing_dikerjakan_oleh');
    }
}
