<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('desains', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->unsignedTinyInteger('versi')->default(1);
            $table->string('file_mockup')->nullable();
            $table->text('catatan_revisi')->nullable();
            $table->enum('status', ['menunggu','dikerjakan','revisi','disetujui'])->default('menunggu');
            $table->foreignId('desain_dikerjakan_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('desain_disetujui_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('disetujui_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('desains');
    }
};
