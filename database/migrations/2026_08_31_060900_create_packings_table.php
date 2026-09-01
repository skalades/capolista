<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->unique()->constrained('orders')->cascadeOnDelete();
            $table->json('checklist_packing')->nullable();
            $table->string('kurir')->nullable();
            $table->string('no_resi')->nullable();
            $table->date('tanggal_kirim')->nullable();
            $table->enum('status', ['packing','siap_kirim','dikirim'])->default('packing');
            $table->text('catatan')->nullable();
            $table->foreignId('packing_dikerjakan_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packings');
    }
};
