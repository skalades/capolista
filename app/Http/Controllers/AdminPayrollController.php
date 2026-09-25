<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Services\PayrollService;
use Carbon\Carbon;

class AdminPayrollController extends Controller
{
    protected $payrollService;

    public function __construct(PayrollService $payrollService)
    {
        $this->payrollService = $payrollService;
    }

    /**
     * Menampilkan Dashboard Payroll (Laporan Gaji)
     */
    public function index(Request $request)
    {
        $month = $request->query('month', Carbon::now()->month);
        $year = $request->query('year', Carbon::now()->year);

        $startDate = Carbon::create($year, $month, 1)->startOfMonth()->toDateString();

        // Ambil data payroll bulan ini beserta nama user
        $payrolls = DB::table('payrolls')
            ->join('users', 'payrolls.user_id', '=', 'users.id')
            ->where('payrolls.period_start', $startDate)
            ->select('payrolls.*', 'users.name as employee_name')
            ->get();

        return Inertia::render('Admin/Payroll/Index', [
            'payrolls' => $payrolls,
            'currentMonth' => $month,
            'currentYear' => $year,
        ]);
    }

    /**
     * Memproses kalkulasi Payroll Bulanan
     */
    public function generate(Request $request)
    {
        $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2020',
        ]);

        $this->payrollService->generateMonthlyPayroll($request->month, $request->year);

        return back()->with('success', 'Payroll bulan ' . $request->month . '/' . $request->year . ' berhasil digenerate dan dikalkulasi.');
    }
}
