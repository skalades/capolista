<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Attendance;
use App\Models\Location;
use App\Services\AttendanceService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class AttendanceController extends Controller
{
    protected $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    /**
     * Tampilkan Halaman Absensi (React/Inertia)
     */
    public function index()
    {
        $today = Carbon::today()->toDateString();
        $user = auth()->user();
        
        // Cek status absensi hari ini
        $attendanceToday = Attendance::where('user_id', $user?->id ?? 1)
            ->where('work_date', $today)
            ->first();

        // Ambil riwayat minggu ini
        $weeklyHistory = Attendance::where('user_id', $user?->id ?? 1)
            ->orderBy('work_date', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Attendance/Index', [
            'todayData' => $attendanceToday,
            'history' => $weeklyHistory,
            // Asumsi jadwal shift (bisa ditarik dari DB)
            'shift' => [
                'name' => 'Shift Pagi',
                'start_time' => '07:00:00',
                'end_time' => '15:00:00'
            ],
            'locations' => Location::all(['id', 'name', 'latitude', 'longitude', 'radius_meters'])
        ]);
    }

    /**
     * Proses Absen Masuk / Pulang
     */
    public function store(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'photo' => 'nullable|string', // Base64 image
        ]);

        $user = auth()->user();
        $today = Carbon::today()->toDateString();
        $currentTime = Carbon::now();

        // 1. Validasi Lokasi (Geofencing)
        $locationCheck = $this->attendanceService->verifyLocation($request->latitude, $request->longitude);
        
        if (!$locationCheck['is_valid']) {
            return back()->withErrors(['location' => $locationCheck['message']]);
        }

        // 2. Simpan Foto (base64 to file)
        $photoPath = null;
        if ($request->photo) {
            // Strip data URI prefix jika ada (data:image/png;base64,...)
            $base64 = $request->photo;
            if (str_contains($base64, ',')) {
                $base64 = substr($base64, strpos($base64, ',') + 1);
            }
            $base64 = str_replace(' ', '+', $base64);
            $imageData = base64_decode($base64);
            if ($imageData !== false) {
                $imageName = 'attendance_' . time() . '_' . auth()->id() . '.jpg';
                Storage::disk('public')->put('attendances/' . $imageName, $imageData);
                $photoPath = 'attendances/' . $imageName;
            }
        }

        // 3. Cek Absensi Hari Ini
        $attendance = Attendance::firstOrNew([
            'user_id' => $user?->id ?? 1,
            'work_date' => $today
        ]);

        $shiftStartTime = $currentTime->copy()->setTime(7, 0, 0); // Mock Shift 07:00
        $shiftEndTime = $currentTime->copy()->setTime(15, 0, 0); // Mock Shift 15:00

        if (!$attendance->exists || !$attendance->check_in_time) {
            // PROSES ABSEN MASUK
            $attendance->check_in_time = $currentTime;
            $attendance->check_in_location_id = $locationCheck['location_id'];
            $attendance->check_in_photo_url = $photoPath;
            
            // Hitung Telat
            $attendance->late_minutes = $this->attendanceService->calculateTimeDifferences($currentTime, $shiftStartTime, 'check_in');
            
            $attendance->status = $attendance->late_minutes > 0 ? 'Telat' : 'Tepat Waktu';
            $attendance->save();

            return back()->with('success', 'Berhasil Absen Masuk di ' . $locationCheck['location_name']);
        } 
        else if (!$attendance->check_out_time) {
            // PROSES ABSEN PULANG
            $attendance->check_out_time = $currentTime;
            $attendance->check_out_location_id = $locationCheck['location_id'];
            $attendance->check_out_photo_url = $photoPath;
            
            // Hitung Lembur
            $attendance->overtime_minutes = $this->attendanceService->calculateTimeDifferences($currentTime, $shiftEndTime, 'check_out');
            $attendance->save();

            return back()->with('success', 'Berhasil Absen Pulang di ' . $locationCheck['location_name']);
        }

        return back()->withErrors(['message' => 'Anda sudah melakukan absen masuk dan pulang hari ini.']);
    }
}
