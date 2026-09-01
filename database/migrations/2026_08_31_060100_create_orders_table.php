<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('no_order')->unique();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->date('tanggal_order');
            $table->date('deadline');
            $table->enum('status', ['draft','desain','procurement','produksi','printing','pemasangan','packing','dikirim','selesai'])->default('draft');
            $table->string('jenis_produk');
            $table->unsignedInteger('jumlah');
            $table->json('ukuran_detail')->nullable();
            $table->text('catatan_desain')->nullable();
            $table->text('catatan_produksi')->nullable();
            $table->decimal('total_harga', 12, 2)->default(0);
            $table->decimal('dp', 12, 2)->default(0);
            $table->decimal('sisa_bayar', 12, 2)->default(0);
            $table->text('catatan')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
