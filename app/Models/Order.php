<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_DESAIN = 'desain';
    public const STATUS_PROCUREMENT = 'procurement';
    public const STATUS_CUTTING = 'cutting';
    public const STATUS_JAHIT = 'jahit';
    public const STATUS_PRODUKSI = 'produksi';
    public const STATUS_PRINTING = 'printing';
    public const STATUS_PEMASANGAN = 'pemasangan';
    public const STATUS_PACKING = 'packing';
    public const STATUS_DIKIRIM = 'dikirim';
    public const STATUS_SELESAI = 'selesai';

    public const STATUS_LABELS = [
        self::STATUS_DRAFT => 'Draft',
        self::STATUS_DESAIN => 'Desain',
        self::STATUS_PROCUREMENT => 'Procurement',
        self::STATUS_CUTTING => 'Cutting',
        self::STATUS_JAHIT => 'Jahit',
        self::STATUS_PRODUKSI => 'Produksi',
        self::STATUS_PRINTING => 'Printing',
        self::STATUS_PEMASANGAN => 'Pemasangan',
        self::STATUS_PACKING => 'Packing',
        self::STATUS_DIKIRIM => 'Dikirim',
        self::STATUS_SELESAI => 'Selesai',
    ];

    public const STATUS_COLORS = [
        self::STATUS_DRAFT => 'gray',
        self::STATUS_DESAIN => 'blue',
        self::STATUS_PROCUREMENT => 'yellow',
        self::STATUS_CUTTING => 'lime',
        self::STATUS_JAHIT => 'cyan',
        self::STATUS_PRODUKSI => 'orange',
        self::STATUS_PRINTING => 'purple',
        self::STATUS_PEMASANGAN => 'pink',
        self::STATUS_PACKING => 'teal',
        self::STATUS_DIKIRIM => 'indigo',
        self::STATUS_SELESAI => 'green',
    ];

    protected $fillable = [
        'no_order',
        'customer_id',
        'tanggal_order',
        'deadline',
        'status',
        'jenis_produk',
        'jumlah',
        'catatan_desain',
        'catatan_produksi',
        'total_harga',
        'dp',
        'sisa_bayar',
        'catatan',
        'created_by',
    ];

    protected $casts = [
        'tanggal_order' => 'date',
        'deadline' => 'date',
        'total_harga' => 'decimal:2',
        'dp' => 'decimal:2',
        'sisa_bayar' => 'decimal:2',
    ];

    public function getNextStatus(): ?string
    {
        $statuses = array_keys(self::STATUS_LABELS);
        $currentIndex = array_search($this->status, $statuses);
        
        if ($currentIndex !== false && isset($statuses[$currentIndex + 1])) {
            return $statuses[$currentIndex + 1];
        }

        return null;
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function orderFiles(): HasMany
    {
        return $this->hasMany(OrderFile::class);
    }

    public function orderLogs(): HasMany
    {
        return $this->hasMany(OrderLog::class);
    }

    public function desain(): HasOne
    {
        return $this->hasOne(Desain::class);
    }

    public function cutting(): HasOne
    {
        return $this->hasOne(ProduksiCutting::class);
    }

    public function jahitAssigns(): HasMany
    {
        return $this->hasMany(ProduksiJahitAssign::class);
    }

    public function jahitOutputs(): HasMany
    {
        return $this->hasMany(ProduksiJahitOutput::class);
    }

    public function printing(): HasOne
    {
        return $this->hasOne(Printing::class);
    }

    public function pemasangan(): HasOne
    {
        return $this->hasOne(Pemasangan::class);
    }

    public function packing(): HasOne
    {
        return $this->hasOne(Packing::class);
    }

    public function pembayarans(): HasMany
    {
        return $this->hasMany(Pembayaran::class);
    }

    public function stokMutasi(): HasMany
    {
        return $this->hasMany(StokMutasi::class, 'mutasi_order_id');
    }

    public function creator(): BelongsTo
    {

        return $this->belongsTo(User::class, 'created_by');
    }
}
