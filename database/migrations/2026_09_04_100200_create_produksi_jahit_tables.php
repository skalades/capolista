<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel assign operator jahit ke order + tarif borongan per kombinasi
        Schema::create('produksi_jahit_assigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('operator_id')->constrained('users')->cascadeOnDelete();
            $table->string('jenis_produk')->comment('Jenis produk dalam order ini (kaus, celana, dll)');
            $table->decimal('tarif_per_pcs', 12, 2)->default(0)->comment('Tarif borongan per pcs untuk kombinasi ini');
            $table->date('tanggal_assign');
            $table->foreignId('dibuat_oleh')->constrained('users')->cascadeOnDelete();
            $table->boolean('is_active')->default(true);
            $table->text('catatan')->nullable();
            $table->timestamps();

            // Unique: satu operator hanya bisa di-assign sekali per order+jenis_produk (active)
            $table->unique(['order_id', 'operator_id', 'jenis_produk'], 'unique_assign_aktif');
        });

        // Tabel riwayat tarif borongan — perubahan tarif tidak retroaktif
        Schema::create('tarif_borongan_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assign_id')->constrained('produksi_jahit_assigns')->cascadeOnDelete();
            $table->foreignId('operator_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('jenis_produk');
            $table->decimal('tarif_per_pcs_lama', 12, 2)->default(0);
            $table->decimal('tarif_per_pcs_baru', 12, 2)->default(0);
            $table->timestamp('berlaku_mulai');
            $table->timestamp('berlaku_sampai')->nullable();
            $table->foreignId('diubah_oleh')->constrained('users')->cascadeOnDelete();
            $table->text('alasan')->nullable();
            $table->timestamps();
        });

        // Tabel output harian operator jahit (self-report + approval mandor)
        Schema::create('produksi_jahit_outputs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assign_id')->constrained('produksi_jahit_assigns')->cascadeOnDelete();
            $table->foreignId('operator_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('jenis_produk');
            $table->date('tanggal');
            $table->integer('pcs_klaim')->default(0)->comment('Pcs yang diklaim operator');
            $table->integer('pcs_approved')->nullable()->comment('Pcs yang disetujui mandor');
            $table->decimal('tarif_per_pcs_snapshot', 12, 2)->default(0)->comment('Snapshot tarif saat output dicatat (immutable)');
            $table->decimal('upah_kotor', 12, 2)->default(0)->comment('pcs_approved * tarif_per_pcs_snapshot');
            $table->enum('status', ['draft', 'menunggu_approval', 'approved', 'rejected'])->default('draft');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->text('catatan_mandor')->nullable();
            $table->text('catatan_operator')->nullable();
            $table->timestamps();

            // Unique: satu output per operator per order per jenis_produk per tanggal
            $table->unique(['operator_id', 'order_id', 'jenis_produk', 'tanggal'], 'unique_output_harian');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produksi_jahit_outputs');
        Schema::dropIfExists('tarif_borongan_histories');
        Schema::dropIfExists('produksi_jahit_assigns');
    }
};
