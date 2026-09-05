<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('nik')->nullable()->after('divisi');
            $table->string('jabatan')->nullable()->after('nik');
            $table->date('tanggal_masuk')->nullable()->after('jabatan');
            $table->enum('tipe_gaji', ['borongan', 'harian', 'bulanan'])->nullable()->after('tanggal_masuk');
            $table->decimal('tarif_default', 12, 2)->nullable()->after('tipe_gaji')->comment('Tarif harian untuk karyawan harian / gaji pokok untuk bulanan');
            $table->decimal('tarif_lembur', 12, 2)->nullable()->after('tarif_default')->comment('Tarif per jam lembur');
            $table->string('no_hp')->nullable()->after('tarif_lembur');
            $table->string('alamat')->nullable()->after('no_hp');
            $table->string('mesin_pos')->nullable()->after('alamat')->comment('Nomor mesin / pos kerja untuk operator jahit & cutting');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'nik', 'jabatan', 'tanggal_masuk', 'tipe_gaji',
                'tarif_default', 'tarif_lembur', 'no_hp', 'alamat', 'mesin_pos',
            ]);
        });
    }
};
