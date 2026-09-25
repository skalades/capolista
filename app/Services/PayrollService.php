<?php

namespace App\Services;

use App\Models\User;
use App\Models\Attendance;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PayrollService
{
    /**
     * Meng-generate payroll bulanan untuk seluruh karyawan
     */
    public function generateMonthlyPayroll($month, $year)
    {
        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        // Ambil aturan (settings) dari database, gunakan fallback default
        $settings = DB::table('settings')->pluck('setting_value', 'setting_key');
        $latePenaltyPerMinute = intval($settings['late_penalty_per_minute'] ?? 1000);
        $overtimeRatePerHour = intval($settings['overtime_rate_per_hour'] ?? 25000);

        // Ambil semua karyawan aktif (Asumsi menggunakan tabel users)
        $employees = User::all();
        $results = [];

        foreach ($employees as $employee) {
            // Ambil seluruh data absensi karyawan di bulan ini
            $attendances = Attendance::where('user_id', $employee->id)
                ->whereBetween('work_date', [$startDate->toDateString(), $endDate->toDateString()])
                ->get();

            $totalLateMinutes = $attendances->sum('late_minutes');
            
            // Asumsi lembur dihitung hanya yang sudah disetujui (is_overtime_approved = true)
            // Untuk demo, kita jumlahkan semua overtime_minutes
            $totalOvertimeMinutes = $attendances->sum('overtime_minutes');

            // Kalkulasi Keuangan
            $baseSalary = $employee->base_salary ?? 5000000; // Mock: Default UMR jika null
            $allowance = $employee->daily_allowance ? ($employee->daily_allowance * $attendances->count()) : 0;
            
            $deduction = $totalLateMinutes * $latePenaltyPerMinute;
            $overtimePay = ($totalOvertimeMinutes / 60) * $overtimeRatePerHour;

            $netSalary = $baseSalary + $allowance + $overtimePay - $deduction;

            // Simpan atau update ke tabel payrolls
            $payroll = DB::table('payrolls')->updateOrInsert(
                [
                    'user_id' => $employee->id,
                    'period_start' => $startDate->toDateString(),
                    'period_end' => $endDate->toDateString(),
                ],
                [
                    'base_salary_total' => $baseSalary,
                    'allowance_total' => $allowance,
                    'overtime_pay' => $overtimePay,
                    'deduction_total' => $deduction,
                    'net_salary' => $netSalary,
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );

            $results[] = [
                'employee' => $employee->name,
                'net_salary' => $netSalary
            ];
        }

        return $results;
    }
}
