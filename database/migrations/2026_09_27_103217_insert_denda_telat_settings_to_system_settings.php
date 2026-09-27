<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('system_settings')->insert([
            [
                'key'         => 'hr.absensi.denda_telat_aktif',
                'value'       => '0',
                'group'       => 'hr',
                'label'       => 'Aktifkan Denda Keterlambatan Absensi',
                'description' => 'Jika diaktifkan, karyawan yang absen masuk melewati jadwal shift akan dikenakan denda potong gaji secara otomatis.',
                'type'        => 'boolean',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'key'         => 'hr.absensi.denda_telat_per_menit',
                'value'       => '500',
                'group'       => 'hr',
                'label'       => 'Nominal Denda per Menit Telat (Rp)',
                'description' => 'Jumlah potongan gaji untuk setiap 1 menit keterlambatan.',
                'type'        => 'number',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);
    }

    public function down(): void
    {
        DB::table('system_settings')
            ->whereIn('key', ['hr.absensi.denda_telat_aktif', 'hr.absensi.denda_telat_per_menit'])
            ->delete();
    }
};
