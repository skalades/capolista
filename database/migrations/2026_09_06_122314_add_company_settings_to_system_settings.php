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
        $defaults = [
            [
                'key'         => 'company.name',
                'value'       => 'CAPOLISTA',
                'group'       => 'company',
                'label'       => 'Nama Perusahaan',
                'description' => 'Nama perusahaan yang akan ditampilkan pada sistem dan invoice.',
                'type'        => 'text',
            ],
            [
                'key'         => 'company.address',
                'value'       => 'Jl. Contoh Alamat No. 123, Kota, Provinsi',
                'group'       => 'company',
                'label'       => 'Alamat Perusahaan',
                'description' => 'Alamat lengkap perusahaan untuk invoice.',
                'type'        => 'text',
            ],
            [
                'key'         => 'company.logo',
                'value'       => null,
                'group'       => 'company',
                'label'       => 'Logo Perusahaan',
                'description' => 'Upload logo (PNG/JPG).',
                'type'        => 'image',
            ],
        ];

        foreach ($defaults as $setting) {
            DB::table('system_settings')->insert(array_merge($setting, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('system_settings', function (Blueprint $table) {
            //
        });
    }
};
