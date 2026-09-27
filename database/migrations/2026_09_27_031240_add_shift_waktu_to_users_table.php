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
        Schema::table('users', function (Blueprint $table) {
            $table->time('shift_masuk')->nullable()->default('07:00:00')->after('tipe_gaji');
            $table->time('shift_keluar')->nullable()->default('15:00:00')->after('shift_masuk');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['shift_masuk', 'shift_keluar']);
        });
    }
};
