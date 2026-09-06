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
        Schema::create('stok_opname_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stok_opname_id')->constrained()->cascadeOnDelete();
            $table->foreignId('bahan_id')->constrained('stok_bahan');
            $table->string('nama_bahan');
            $table->string('satuan');
            $table->decimal('stok_sistem', 10, 2);
            $table->decimal('stok_fisik', 10, 2)->nullable();
            $table->decimal('selisih', 10, 2)->nullable();
            $table->text('keterangan_selisih')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stok_opname_items');
    }
};
