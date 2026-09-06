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
            $table->dropForeign(['operator_id']);
            $table->dropUnique('unique_output_harian');
            $table->foreign('operator_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produksi_jahit_outputs', function (Blueprint $table) {
            //
        });
    }
};
