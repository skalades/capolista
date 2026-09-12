<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel assign operator cutting ke order
        Schema::create('produksi_cutting_assigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('operator_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('tarif_per_pcs', 12, 2)->default(0);
            $table->date('tanggal_assign');
            $table->foreignId('dibuat_oleh')->constrained('users')->cascadeOnDelete();
            $table->boolean('is_active')->default(true);
            $table->text('catatan')->nullable();
            $table->timestamps();

            // Unique
            $table->unique(['order_id', 'operator_id'], 'unique_cutting_assign_aktif');
        });

        // Tabel riwayat tarif borongan cutting
        Schema::create('tarif_cutting_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assign_id')->constrained('produksi_cutting_assigns')->cascadeOnDelete();
            $table->foreignId('operator_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->decimal('tarif_per_pcs_lama', 12, 2)->default(0);
            $table->decimal('tarif_per_pcs_baru', 12, 2)->default(0);
            $table->timestamp('berlaku_mulai');
            $table->timestamp('berlaku_sampai')->nullable();
            $table->foreignId('diubah_oleh')->constrained('users')->cascadeOnDelete();
            $table->text('alasan')->nullable();
            $table->timestamps();
        });

        // Tabel output harian operator cutting
        Schema::create('produksi_cutting_outputs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assign_id')->constrained('produksi_cutting_assigns')->cascadeOnDelete();
            $table->foreignId('operator_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->date('tanggal');
            $table->integer('pcs_klaim')->default(0);
            $table->integer('pcs_approved')->nullable();
            $table->json('rincian_ukuran')->nullable();
            $table->decimal('tarif_per_pcs_snapshot', 12, 2)->default(0);
            $table->decimal('upah_kotor', 12, 2)->default(0);
            $table->enum('status', ['draft', 'menunggu_approval', 'approved', 'rejected'])->default('draft');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->text('catatan_mandor')->nullable();
            $table->text('catatan_operator')->nullable();
            $table->timestamps();
        });

        Schema::create('produksi_cutting_qc_rejects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('operator_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('assign_id')->constrained('produksi_cutting_assigns')->cascadeOnDelete();
            $table->integer('jumlah')->default(0);
            $table->text('alasan')->nullable();
            $table->enum('status', ['pending', 'resolved'])->default('pending');
            $table->foreignId('dibuat_oleh')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produksi_cutting_qc_rejects');
        Schema::dropIfExists('produksi_cutting_outputs');
        Schema::dropIfExists('tarif_cutting_histories');
        Schema::dropIfExists('produksi_cutting_assigns');
    }
};
