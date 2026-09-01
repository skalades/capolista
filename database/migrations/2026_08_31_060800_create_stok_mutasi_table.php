<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stok_mutasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bahan_id')->constrained('stok_bahan')->cascadeOnDelete();
            $table->enum('tipe', ['masuk','keluar']);
            $table->decimal('jumlah', 10, 2);
            $table->string('keterangan')->nullable();
            $table->foreignId('mutasi_order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->foreignId('mutasi_created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stok_mutasi');
    }
};
