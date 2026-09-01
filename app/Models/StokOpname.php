<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StokOpname extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'tanggal' => 'date',
        'disetujui_at' => 'datetime',
    ];

    public function items()
    {
        return $this->hasMany(StokOpnameItem::class);
    }

    public function pembuat()
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    public function penyetuju()
    {
        return $this->belongsTo(User::class, 'disetujui_oleh');
    }
}
