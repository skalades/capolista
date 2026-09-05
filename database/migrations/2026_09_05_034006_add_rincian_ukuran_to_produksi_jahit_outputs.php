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
        Schema::table('produksi_jahit_outputs', function (Blueprint $table) {
            $table->json('rincian_ukuran')->nullable()->after('pcs_klaim');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produksi_jahit_outputs', function (Blueprint $table) {
            $table->dropColumn('rincian_ukuran');
        });
    }
};
