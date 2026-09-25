<?php

namespace App\Services;

use App\Models\Location;
use Carbon\Carbon;

class AttendanceService
{
    /**
     * Menghitung jarak menggunakan Haversine Formula (mengembalikan meter)
     */
    public function getDistanceInMeters($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // Radius bumi dalam meter

        $latDelta = deg2rad($lat2 - $lat1);
        $lonDelta = deg2rad($lon2 - $lon1);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($lonDelta / 2) * sin($lonDelta / 2);
             
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return round($earthRadius * $c);
    }

    /**
     * Mengecek apakah koordinat karyawan ada di salah satu lokasi terdaftar.
     */
    public function verifyLocation($userLat, $userLng)
    {
        $locations = Location::all();
        $nearestLocation = null;
        $shortestDistance = PHP_INT_MAX;

        foreach ($locations as $location) {
            $distance = $this->getDistanceInMeters(
                $userLat, $userLng, 
                $location->latitude, $location->longitude
            );

            if ($distance <= $location->radius_meters && $distance < $shortestDistance) {
                $shortestDistance = $distance;
                $nearestLocation = $location;
            }
        }

        if ($nearestLocation) {
            return [
                'is_valid' => true,
                'location_id' => $nearestLocation->id,
                'location_name' => $nearestLocation->name,
                'distance_meters' => $shortestDistance,
                'message' => "Di dalam radius {$nearestLocation->name} (Jarak {$shortestDistance}m)"
            ];
        }

        return [
            'is_valid' => false,
            'message' => 'Anda berada di luar jangkauan (radius) seluruh area kantor.'
        ];
    }

    /**
     * Logika untuk menghitung keterlambatan (late_minutes) dan lembur (overtime_minutes)
     */
    public function calculateTimeDifferences($checkTime, $shiftTime, $type = 'check_in')
    {
        $check = Carbon::parse($checkTime);
        $shift = Carbon::parse($shiftTime);

        if ($type === 'check_in') {
            // Jika masuk setelah jam shift -> telat
            return $check->greaterThan($shift) ? $check->diffInMinutes($shift) : 0;
        } else {
            // Jika pulang setelah jam shift -> lembur
            return $check->greaterThan($shift) ? $check->diffInMinutes($shift) : 0;
        }
    }
}
