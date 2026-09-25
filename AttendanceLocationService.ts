/**
 * Layanan Geofencing & Validasi Absensi Karyawan
 * 
 * File ini berisi logika bisnis utama (Service Layer) untuk memvalidasi
 * lokasi absen karyawan berdasarkan radius dan koordinat yang dikonfigurasi
 * di Panel Admin.
 */

interface Location {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    radius_meters: number;
}

interface ValidationResult {
    isValid: boolean;
    locationId?: number;
    locationName?: string;
    distanceMeters?: number;
    message: string;
}

export class AttendanceLocationService {
    
    /**
     * Menghitung jarak antara dua koordinat GPS menggunakan Haversine Formula.
     * Mengembalikan nilai dalam meter.
     */
    public static getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371e3; // Radius Bumi dalam meter
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
            
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c); // Membulatkan jarak
    }

    private static deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    /**
     * Mengecek apakah koordinat karyawan saat ini berada di dalam radius
     * salah satu dari seluruh daftar lokasi (Kantor 1, Kantor 2, dst).
     * 
     * @param userLat Latitude dari GPS Karyawan (HP)
     * @param userLng Longitude dari GPS Karyawan (HP)
     * @param availableLocations Daftar lokasi dari database
     */
    public static verifyLocation(userLat: number, userLng: number, availableLocations: Location[]): ValidationResult {
        let nearestLocation: Location | null = null;
        let shortestDistance = Infinity;

        // Loop untuk mengecek jarak ke SEMUA cabang/kantor
        for (const location of availableLocations) {
            const distance = this.getDistanceInMeters(userLat, userLng, location.latitude, location.longitude);
            
            // Apakah masuk radius? Dan apakah ini yang paling dekat?
            if (distance <= location.radius_meters && distance < shortestDistance) {
                shortestDistance = distance;
                nearestLocation = location;
            }
        }

        // Jika ditemukan lokasi yang cocok dan masuk radius
        if (nearestLocation) {
            return {
                isValid: true,
                locationId: nearestLocation.id,
                locationName: nearestLocation.name,
                distanceMeters: shortestDistance,
                message: `Di dalam radius ${nearestLocation.name} (Jarak ${shortestDistance}m)`
            };
        }

        // Jika tidak masuk radius kantor mana pun
        return {
            isValid: false,
            message: "Anda berada di luar jangkauan (radius) seluruh area kantor."
        };
    }
}
