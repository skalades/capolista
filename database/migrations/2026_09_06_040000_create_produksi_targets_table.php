<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produksi_targets', function (Blueprint $table) {
            $table->id();
            $table->enum('divisi', ['cutting', 'jahit', 'printing', 'pemasangan']);
            $table->enum('periode', ['daily', 'weekly'])->default('daily');
            $table->unsignedInteger('target_pcs')->default(0);
            $table->date('berlaku_mulai');
            $table->foreignId('dibuat_oleh')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            // Satu record per divisi per periode per tanggal
            $table->unique(['divisi', 'periode', 'berlaku_mulai']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produksi_targets');
    }
};
