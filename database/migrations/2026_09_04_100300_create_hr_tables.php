<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel absensi karyawan (diinput manual oleh Admin/Mandor)
        Schema::create('absensi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('karyawan_id')->constrained('users')->cascadeOnDelete();
            $table->date('tanggal');
            $table->enum('status_hadir', ['hadir', 'izin', 'sakit', 'alpha'])->default('hadir');
            $table->decimal('jam_lembur', 5, 2)->default(0)->comment('Jam lembur hari ini');
            $table->foreignId('dicatat_oleh')->constrained('users')->cascadeOnDelete();
            $table->text('keterangan')->nullable();
            $table->timestamps();

            $table->unique(['karyawan_id', 'tanggal'], 'unique_absensi_harian');
        });

        // Tabel penggajian (header per karyawan per periode)
        Schema::create('penggajians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('karyawan_id')->constrained('users')->cascadeOnDelete();
            $table->date('periode_mulai');
            $table->date('periode_selesai');
            $table->enum('tipe_gaji', ['borongan', 'harian', 'bulanan']);
            // Ringkasan kalkulasi
            $table->integer('total_hari_hadir')->default(0);
            $table->integer('total_hari_izin')->default(0);
            $table->integer('total_hari_sakit')->default(0);
            $table->integer('total_hari_alpha')->default(0);
            $table->decimal('total_jam_lembur', 8, 2)->default(0);
            $table->integer('total_pcs_approved')->default(0)->comment('Total pcs borongan disetujui dalam periode');
            $table->decimal('upah_pokok', 12, 2)->default(0);
            $table->decimal('upah_lembur', 12, 2)->default(0);
            $table->decimal('tunjangan', 12, 2)->default(0);
            $table->decimal('potongan', 12, 2)->default(0);
            $table->text('catatan_potongan')->nullable();
            $table->decimal('total_upah_kotor', 12, 2)->default(0);
            $table->decimal('total_upah_bersih', 12, 2)->default(0);
            $table->enum('status_bayar', ['draft', 'disetujui', 'dibayar'])->default('draft');
            $table->foreignId('dibuat_oleh')->constrained('users')->cascadeOnDelete();
            $table->foreignId('disetujui_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('disetujui_at')->nullable();
            $table->timestamp('dibayar_at')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->unique(['karyawan_id', 'periode_mulai', 'periode_selesai'], 'unique_penggajian_periode');
        });

        // Tabel item penggajian — rincian per hari/per order (untuk slip gaji detail)
        Schema::create('penggajian_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penggajian_id')->constrained('penggajians')->cascadeOnDelete();
            $table->enum('tipe_item', ['borongan', 'harian', 'lembur', 'tunjangan', 'potongan']);
            $table->date('tanggal')->nullable();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->string('jenis_produk')->nullable();
            $table->integer('pcs')->nullable()->comment('Untuk item borongan: pcs approved');
            $table->decimal('tarif', 12, 2)->default(0);
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penggajian_items');
        Schema::dropIfExists('penggajians');
        Schema::dropIfExists('absensi');
    }
};
