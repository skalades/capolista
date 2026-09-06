<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('system_settings')->insert([
            'key'         => 'company.bank_account',
            'value'       => 'BCA: 123456789 a.n. Capolista',
            'group'       => 'company',
            'label'       => 'Informasi Rekening',
            'description' => 'Informasi rekening bank untuk pembayaran pada Invoice.',
            'type'        => 'text',
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('system_settings')->where('key', 'company.bank_account')->delete();
    }
};
