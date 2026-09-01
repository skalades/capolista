<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Level akses: 0=Superadmin, 1=Owner, 2=Admin, 3=Kepala Divisi, 4=Staf, 5=Customer
            $table->tinyInteger('level_akses')->default(4)->after('password');

            // Divisi tempat user bertugas (null untuk Owner/Admin/Superadmin)
            $table->string('divisi')->nullable()->after('level_akses');

            // Status aktif akun
            $table->boolean('is_active')->default(true)->after('divisi');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['level_akses', 'divisi', 'is_active']);
        });
    }
};
