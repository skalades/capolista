<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produksi_cuttings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('operator_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('dikerjakan_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->date('tanggal')->nullable();
            // Breakdown pcs per ukuran (JSON: {S: 10, M: 20, L: 15, XL: 5, XXL: 2})
            $table->json('pcs_per_ukuran')->nullable()->comment('Pcs yang selesai dipotong per ukuran');
            $table->integer('total_pcs')->default(0);
            // QC
            $table->boolean('qc_akurasi_ukuran')->default(false);
            $table->boolean('qc_arah_kain')->default(false);
            $table->boolean('qc_tidak_cacat')->default(false);
            $table->text('catatan_qc')->nullable();
            // Status
            $table->enum('status', ['menunggu', 'dikerjakan', 'selesai'])->default('menunggu');
            $table->timestamp('selesai_at')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produksi_cuttings');
    }
};
