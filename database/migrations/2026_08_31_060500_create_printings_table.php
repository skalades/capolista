<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('printings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->enum('metode_cetak', ['sablon','dtf','dtg'])->nullable();
            $table->unsignedTinyInteger('jumlah_warna')->nullable();
            $table->date('estimasi_selesai')->nullable();
            $table->date('tanggal_mulai')->nullable();
            $table->date('tanggal_selesai')->nullable();
            $table->enum('status', ['menunggu','proses','selesai'])->default('menunggu');
            $table->enum('status_qc', ['lulus','gagal'])->nullable();
            $table->text('catatan_qc')->nullable();
            $table->string('foto_qc')->nullable();
            $table->foreignId('printing_dikerjakan_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('printings');
    }
};
