<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pemasangans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('suhu_heat_press')->nullable();
            $table->string('waktu_curing')->nullable();
            $table->json('checklist_qc')->nullable();
            $table->enum('status', ['menunggu','proses','selesai'])->default('menunggu');
            $table->enum('status_qc', ['lulus','gagal'])->nullable();
            $table->text('catatan')->nullable();
            $table->string('foto_qc')->nullable();
            $table->foreignId('pemasangan_dikerjakan_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pemasangans');
    }
};
