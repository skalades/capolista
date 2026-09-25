<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('absensi', function (Blueprint $table) {
            $table->time('jam_masuk')->nullable()->after('status_hadir');
            $table->time('jam_keluar')->nullable()->after('jam_masuk');
            $table->string('foto_masuk')->nullable()->after('jam_keluar');
            $table->string('foto_keluar')->nullable()->after('foto_masuk');
            $table->decimal('latitude_masuk', 10, 8)->nullable()->after('foto_keluar');
            $table->decimal('longitude_masuk', 11, 8)->nullable()->after('latitude_masuk');
            $table->decimal('latitude_keluar', 10, 8)->nullable()->after('longitude_masuk');
            $table->decimal('longitude_keluar', 11, 8)->nullable()->after('latitude_keluar');
            $table->string('lokasi_absen')->nullable()->comment('Kantor 1, Kantor 2, dll')->after('longitude_keluar');
            
            // Allow dicatat_oleh to be null for self-attendance cases
            $table->foreignId('dicatat_oleh')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('absensi', function (Blueprint $table) {
            $table->dropColumn([
                'jam_masuk',
                'jam_keluar',
                'foto_masuk',
                'foto_keluar',
                'latitude_masuk',
                'longitude_masuk',
                'latitude_keluar',
                'longitude_keluar',
                'lokasi_absen',
            ]);
            $table->foreignId('dicatat_oleh')->nullable(false)->change();
        });
    }
};
