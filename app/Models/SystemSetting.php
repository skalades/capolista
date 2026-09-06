<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Cache;

class SystemSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'group',
        'label',
        'description',
        'type',
        'updated_by',
    ];

    /**
     * Cache key prefix untuk semua settings.
     */
    private const CACHE_KEY = 'system_settings';
    private const CACHE_TTL = 300; // 5 menit

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Ambil semua settings sebagai key-value array (dengan cache).
     */
    public static function getAllCached(): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return static::all()->pluck('value', 'key')->toArray();
        });
    }

    /**
     * Ambil satu nilai setting berdasarkan key.
     * Fallback ke $default jika key tidak ditemukan.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $settings = static::getAllCached();
        return $settings[$key] ?? $default;
    }

    /**
     * Set / update nilai setting, lalu clear cache.
     */
    public static function set(string $key, mixed $value, int $userId = null): void
    {
        static::where('key', $key)->update([
            'value'      => (string) $value,
            'updated_by' => $userId,
            'updated_at' => now(),
        ]);

        static::clearCache();
    }

    /**
     * Clear cache agar setting terbaru dibaca dari DB.
     */
    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Ambil threshold bottleneck per divisi dari settings.
     * Fallback ke nilai default jika belum dikonfigurasi.
     */
    public static function getBottleneckThresholds(): array
    {
        $settings = static::getAllCached();
        return [
            'cutting'    => (int) ($settings['produksi.threshold.cutting']    ?? 2),
            'jahit'      => (int) ($settings['produksi.threshold.jahit']      ?? 5),
            'printing'   => (int) ($settings['produksi.threshold.printing']   ?? 2),
            'pemasangan' => (int) ($settings['produksi.threshold.pemasangan'] ?? 2),
        ];
    }

    /**
     * Ambil semua settings dalam satu group.
     */
    public static function getGroup(string $group): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('group', $group)->orderBy('key')->get();
    }
}
