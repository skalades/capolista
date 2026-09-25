<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabel Settings (Panel Admin)
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('setting_key')->unique();
            $table->string('setting_value');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Tabel Lokasi (Multi Kantor)
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->integer('radius_meters')->default(100);
            $table->timestamps();
        });

        // 3. Tabel Shift
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('late_tolerance_minutes')->default(0);
            $table->timestamps();
        });

        // Catatan: Asumsi tabel 'users' sudah ada dari Laravel Breeze/Jetstream
        // Kita modifikasi tabel users untuk relasi shift dan gaji jika diperlukan,
        // Tapi agar modular, kita buat tabel attendances merujuk ke users.

        // 4. Tabel Absensi (Transaction)
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('work_date');
            
            // Check In
            $table->dateTime('check_in_time')->nullable();
            $table->foreignId('check_in_location_id')->nullable()->constrained('locations')->onDelete('set null');
            $table->string('check_in_photo_url')->nullable();
            
            // Check Out
            $table->dateTime('check_out_time')->nullable();
            $table->foreignId('check_out_location_id')->nullable()->constrained('locations')->onDelete('set null');
            $table->string('check_out_photo_url')->nullable();
            
            // Perhitungan Waktu
            $table->integer('late_minutes')->default(0);
            $table->integer('overtime_minutes')->default(0);
            $table->boolean('is_overtime_approved')->default(false);
            
            $table->string('status')->default('Belum Absen');
            $table->timestamps();

            // Karyawan hanya boleh punya 1 record absensi per hari
            $table->unique(['user_id', 'work_date']);
        });

        // 5. Tabel Payroll
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('period_start');
            $table->date('period_end');
            
            $table->decimal('base_salary_total', 15, 2)->default(0);
            $table->decimal('allowance_total', 15, 2)->default(0);
            $table->decimal('overtime_pay', 15, 2)->default(0);
            $table->decimal('deduction_total', 15, 2)->default(0);
            $table->decimal('net_salary', 15, 2)->default(0);
            
            $table->boolean('is_paid')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payrolls');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('shifts');
        Schema::dropIfExists('locations');
        Schema::dropIfExists('settings');
    }
};
