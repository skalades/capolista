<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->index('status');
            $table->index('deadline');
            $table->index('tanggal_order');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->index('nama');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index('level_akses');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['deadline']);
            $table->dropIndex(['tanggal_order']);
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropIndex(['nama']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['level_akses']);
        });
    }
};
