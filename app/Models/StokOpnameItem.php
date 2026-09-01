<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StokOpnameItem extends Model
{
    protected $guarded = ['id'];

    public function opname()
    {
        return $this->belongsTo(StokOpname::class, 'stok_opname_id');
    }

    public function bahan()
    {
        return $this->belongsTo(StokBahan::class, 'bahan_id');
    }
}
