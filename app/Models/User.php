<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'divisi',
        'level_akses',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_active'         => 'boolean',
            'level_akses'       => 'integer',
        ];
    }

    /**
     * Level akses constants sesuai PRD.
     * 0=Superadmin, 1=Owner, 2=Admin, 3=Kepala Divisi, 4=Staf, 5=Customer
     */
    const LEVEL_SUPERADMIN    = 0;
    const LEVEL_OWNER         = 1;
    const LEVEL_ADMIN         = 2;
    const LEVEL_KEPALA_DIVISI = 3;
    const LEVEL_STAF          = 4;
    const LEVEL_CUSTOMER      = 5;

    /**
     * Daftar divisi yang tersedia sesuai PRD.
     */
    const DIVISI_LIST = [
        'pemasaran'    => 'Pemasaran',
        'produksi'     => 'Produksi',
        'desain'       => 'Desain',
        'printing'     => 'Printing',
        'pemasangan'   => 'Pemasangan',
        'pembelian'    => 'Pembelian/Procurement',
        'gudang'       => 'Gudang & Logistik',
        'keuangan'     => 'Keuangan & Akuntansi',
        'hr'           => 'HR/Personalia',
    ];
    public function isSuperadmin(): bool { return $this->level_akses === self::LEVEL_SUPERADMIN; }
    public function isOwner(): bool { return $this->level_akses === self::LEVEL_OWNER; }
    public function isAdmin(): bool { return $this->level_akses === self::LEVEL_ADMIN; }
    public function isKepala(): bool { return $this->level_akses === self::LEVEL_KEPALA_DIVISI; }
    public function isStaf(): bool { return $this->level_akses === self::LEVEL_STAF; }
    public function isManagement(): bool { return $this->level_akses <= self::LEVEL_ADMIN; }
    public function canAccessDivisi(string $divisi): bool {
        // Level 0, 1, 2 bisa akses semua divisi
        if ($this->level_akses < self::LEVEL_KEPALA_DIVISI) return true;
        // Level 3, 4 hanya bisa akses divisi mereka sendiri
        return $this->divisi === $divisi;
    }
    public function scopeActive($query) { return $query->where('is_active', true); }
}

