<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();          // e.g. "produksi.threshold.cutting"
            $table->text('value')->nullable();         // nilai setting
            $table->string('group')->default('umum'); // untuk grouping di UI
            $table->string('label');                   // label ramah pengguna
            $table->text('description')->nullable();   // penjelasan
            $table->string('type')->default('text');   // text | number | boolean | json
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // Seed nilai default threshold bottleneck
        $defaults = [
            [
                'key'         => 'produksi.threshold.cutting',
                'value'       => '2',
                'group'       => 'produksi',
                'label'       => 'Threshold Bottleneck: Cutting (hari)',
                'description' => 'Jumlah hari maksimal sebuah order berada di status Cutting sebelum dianggap bottleneck.',
                'type'        => 'number',
            ],
            [
                'key'         => 'produksi.threshold.jahit',
                'value'       => '5',
                'group'       => 'produksi',
                'label'       => 'Threshold Bottleneck: Jahit (hari)',
                'description' => 'Jumlah hari maksimal sebuah order berada di status Jahit sebelum dianggap bottleneck.',
                'type'        => 'number',
            ],
            [
                'key'         => 'produksi.threshold.printing',
                'value'       => '2',
                'group'       => 'produksi',
                'label'       => 'Threshold Bottleneck: Printing (hari)',
                'description' => 'Jumlah hari maksimal sebuah order berada di status Printing sebelum dianggap bottleneck.',
                'type'        => 'number',
            ],
            [
                'key'         => 'produksi.threshold.pemasangan',
                'value'       => '2',
                'group'       => 'produksi',
                'label'       => 'Threshold Bottleneck: Pemasangan (hari)',
                'description' => 'Jumlah hari maksimal sebuah order berada di status Pemasangan sebelum dianggap bottleneck.',
                'type'        => 'number',
            ],
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

    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
