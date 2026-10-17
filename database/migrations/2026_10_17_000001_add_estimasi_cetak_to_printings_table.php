<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('printings', function (Blueprint $table) {
            if (!Schema::hasColumn('printings', 'estimasi_cetak')) {
                $table->date('estimasi_cetak')->nullable()->after('jumlah_warna');
            }
        });
    }

    public function down(): void
    {
        Schema::table('printings', function (Blueprint $table) {
            if (Schema::hasColumn('printings', 'estimasi_cetak')) {
                $table->dropColumn('estimasi_cetak');
            }
        });
    }
};
