<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

use Illuminate\Support\Facades\DB;

class KaryawanAbsensiController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today()->toDateString();

        $lat = DB::table('system_settings')->where('key', 'hr.absensi.lat')->value('value') ?? -6.200000;
        $lng = DB::table('system_settings')->where('key', 'hr.absensi.lng')->value('value') ?? 106.816666;
        $radius = DB::table('system_settings')->where('key', 'hr.absensi.radius')->value('value') ?? 100;

        $lokasiKantor = [
            'Kantor Utama' => [
                'lat' => (float) $lat,
                'lng' => (float) $lng,
                'radius' => (int) $radius,
            ]
        ];

        $absensiHariIni = Absensi::where('karyawan_id', $user->id)
            ->where('tanggal', $today)
            ->first();

        $riwayatMingguIni = Absensi::where('karyawan_id', $user->id)
            ->whereBetween('tanggal', [Carbon::now()->startOfWeek()->toDateString(), Carbon::now()->endOfWeek()->toDateString()])
            ->orderBy('tanggal', 'desc')
            ->get();

        return Inertia::render('Karyawan/SelfAbsensi', [
            'absensiHariIni' => $absensiHariIni,
            'riwayatMingguIni' => $riwayatMingguIni,
            'lokasiKantor' => $lokasiKantor,
            'waktuSekarang' => Carbon::now()->format('H:i'),
        ]);
    }

    public function masuk(Request $request)
    {
        $request->validate([
            'foto'        => 'required|string', // base64 image
            'latitude'    => 'required|numeric',
            'longitude'   => 'required|numeric',
            'lokasi_absen' => 'required|string',
        ]);

        $user  = $request->user();
        $today = Carbon::today()->toDateString();

        // Validasi geofencing di backend (tidak bisa di-bypass dari frontend)
        $locationCheck = $this->validateGeofencing($request->latitude, $request->longitude);
        if (!$locationCheck['valid']) {
            return back()->with('error', $locationCheck['message']);
        }

        // Check if already checked in
        $absensi = Absensi::where('karyawan_id', $user->id)->where('tanggal', $today)->first();
        if ($absensi && $absensi->jam_masuk) {
            return back()->with('error', 'Anda sudah melakukan absen masuk hari ini.');
        }

        // Decode and save photo
        $fotoPath = $this->saveBase64Image($request->foto, 'masuk');

        if (!$absensi) {
            $absensi = new Absensi();
            $absensi->karyawan_id = $user->id;
            $absensi->tanggal     = $today;
        }

        $absensi->status_hadir     = Absensi::STATUS_HADIR;
        $absensi->jam_masuk        = Carbon::now()->format('H:i:s');
        $absensi->latitude_masuk   = $request->latitude;
        $absensi->longitude_masuk  = $request->longitude;
        $absensi->foto_masuk       = $fotoPath;
        $absensi->lokasi_absen     = $locationCheck['nama']; // gunakan nama lokasi dari backend
        $absensi->dicatat_oleh     = $user->id;

        $absensi->save();

        return back()->with('success', 'Absen masuk berhasil di ' . $locationCheck['nama'] . '.');
    }

    public function keluar(Request $request)
    {
        $request->validate([
            'foto'      => 'required|string', // base64 image
            'latitude'  => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $user  = $request->user();
        $today = Carbon::today()->toDateString();

        // Validasi geofencing di backend
        $locationCheck = $this->validateGeofencing($request->latitude, $request->longitude);
        if (!$locationCheck['valid']) {
            return back()->with('error', $locationCheck['message']);
        }

        $absensi = Absensi::where('karyawan_id', $user->id)->where('tanggal', $today)->first();

        if (!$absensi || !$absensi->jam_masuk) {
            return back()->with('error', 'Anda belum melakukan absen masuk.');
        }
        if ($absensi->jam_keluar) {
            return back()->with('error', 'Anda sudah melakukan absen keluar hari ini.');
        }

        $fotoPath = $this->saveBase64Image($request->foto, 'keluar');

        $jamKeluar = Carbon::now();
        $absensi->jam_keluar       = $jamKeluar->format('H:i:s');
        $absensi->latitude_keluar  = $request->latitude;
        $absensi->longitude_keluar = $request->longitude;
        $absensi->foto_keluar      = $fotoPath;

        // Kalkulasi lembur: jika keluar > 1 jam setelah shift berakhir (15:00)
        $shiftEnd = Carbon::createFromFormat('H:i', '15:00');
        if ($jamKeluar->greaterThan($shiftEnd->copy()->addHour())) {
            $diffMinutes       = $jamKeluar->diffInMinutes($shiftEnd);
            $absensi->jam_lembur = floor($diffMinutes / 60);
        }

        $absensi->save();

        return back()->with('success', 'Absen keluar berhasil.');
    }

    /**
     * Validasi koordinat terhadap lokasi kantor yang tersimpan di system_settings.
     * Haversine formula — mendukung hingga 2 lokasi.
     */
    private function validateGeofencing(float $userLat, float $userLng): array
    {
        // Lokasi 1 (Utama)
        $lat1    = (float) (DB::table('system_settings')->where('key', 'hr.absensi.lat')->value('value') ?? -6.200000);
        $lng1    = (float) (DB::table('system_settings')->where('key', 'hr.absensi.lng')->value('value') ?? 106.816666);
        $radius1 = (int)   (DB::table('system_settings')->where('key', 'hr.absensi.radius')->value('value') ?? 100);

        $jarak1 = $this->haversineMeters($userLat, $userLng, $lat1, $lng1);
        if ($jarak1 <= $radius1) {
            return ['valid' => true, 'nama' => 'Kantor Utama', 'jarak' => $jarak1];
        }

        // Lokasi 2 (Opsional - Cabang/Gudang)
        $lat2Str = DB::table('system_settings')->where('key', 'hr.absensi.lat_2')->value('value');
        $lng2Str = DB::table('system_settings')->where('key', 'hr.absensi.lng_2')->value('value');
        $radius2 = (int)   (DB::table('system_settings')->where('key', 'hr.absensi.radius_2')->value('value') ?? 100);

        if ($lat2Str && $lng2Str) {
            $lat2 = (float) $lat2Str;
            $lng2 = (float) $lng2Str;
            $jarak2 = $this->haversineMeters($userLat, $userLng, $lat2, $lng2);

            if ($jarak2 <= $radius2) {
                return ['valid' => true, 'nama' => 'Lokasi Cabang', 'jarak' => $jarak2];
            }

            return [
                'valid'   => false,
                'message' => "Anda di luar radius semua lokasi (Jarak Utama: {$jarak1}m, Cabang: {$jarak2}m).",
            ];
        }

        return [
            'valid'   => false,
            'message' => "Anda berada di luar radius kantor (jarak {$jarak1}m, maksimal {$radius1}m).",
        ];
    }

    /**
     * Menghitung jarak dua koordinat dalam meter menggunakan Haversine formula.
     */
    private function haversineMeters(float $lat1, float $lon1, float $lat2, float $lon2): int
    {
        $R      = 6371000;
        $phi1   = deg2rad($lat1);
        $phi2   = deg2rad($lat2);
        $dPhi   = deg2rad($lat2 - $lat1);
        $dLambda = deg2rad($lon2 - $lon1);

        $a = sin($dPhi / 2) ** 2 + cos($phi1) * cos($phi2) * sin($dLambda / 2) ** 2;
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return (int) round($R * $c);
    }

    private function saveBase64Image($base64Image, $type)
    {
        if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $typeMatch)) {
            $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);
            $typeString = strtolower($typeMatch[1]); // jpg, png, gif

            if (!in_array($typeString, ['jpg', 'jpeg', 'png', 'webp'])) {
                throw new \Exception('invalid image type');
            }
            $base64Image = str_replace(' ', '+', $base64Image);
            $imageFile = base64_decode($base64Image);
            if ($imageFile === false) {
                throw new \Exception('base64_decode failed');
            }
        } else {
            throw new \Exception('did not match data URI with image data');
        }

        $fileName = 'absensi/' . date('Y-m-d') . '/' . uniqid() . '_' . $type . '.' . $typeString;
        Storage::disk('public')->put($fileName, $imageFile);

        return 'storage/' . $fileName;
    }
}
