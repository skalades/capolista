<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('produksi_jahit_qc_rejects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('operator_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('assign_id')->constrained('produksi_jahit_assigns')->cascadeOnDelete();
            $table->integer('jumlah')->default(0)->comment('Jumlah pcs reject final QC');
            $table->text('alasan')->nullable();
            $table->enum('status', ['pending', 'resolved'])->default('pending')->comment('pending = perlu dijahit ulang, resolved = sudah beres');
            $table->foreignId('dibuat_oleh')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produksi_jahit_qc_rejects');
    }
};
