import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, XCircle, Camera } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

export default function Index({ todayData, history, shift }) {
    const { auth, flash } = usePage().props;
    const [gpsStatus, setGpsStatus] = useState('Mencari lokasi...');
    const [isValidLocation, setIsValidLocation] = useState(false);
    const [distanceMsg, setDistanceMsg] = useState('Sedang mengkalkulasi jarak...');

    const { data, setData, post, processing, errors } = useForm({
        latitude: null,
        longitude: null,
        photo: null,
    });

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }));
                    // Validasi lokasi dilakukan di backend; di sini hanya update UI GPS
                    setIsValidLocation(true);
                    setGpsStatus('GPS aktif');
                    setDistanceMsg('Koordinat berhasil didapatkan. Klik absen untuk validasi lokasi.');
                },
                () => {
                    setGpsStatus('Akses GPS ditolak / Gagal');
                    setDistanceMsg('Pastikan GPS aktif dan diizinkan.');
                },
                { enableHighAccuracy: true }
            );
        }
    }, []);

    const handleAbsen = (e) => {
        e.preventDefault();
        post('/attendance', { preserveScroll: true });
    };

    const shiftLabel = shift
        ? `${shift.name} • ${shift.start_time?.substring(0, 5)}—${shift.end_time?.substring(0, 5)}`
        : 'Shift pagi • 07.00—15.00';

    return (
        <div className="min-h-screen bg-[#f4f3ed] font-sans pb-10">
            {/* Header */}
            <div className="bg-[#2a3647] text-white px-6 py-8 rounded-b-3xl shadow-md">
                <h1 className="text-2xl font-semibold">Absensi — {auth?.user?.name ?? '—'}</h1>
                <p className="text-sm text-gray-300 mt-1">{dayjs().format('dddd, DD MMMM YYYY')}</p>
                <div className="inline-flex items-center mt-4 px-3 py-1 bg-[#374558] rounded-full text-xs text-gray-200">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                    {shiftLabel}
                </div>
            </div>

            <div className="px-5 mt-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
                        <CheckCircle2 className="text-green-600 w-5 h-5 flex-shrink-0" />
                        <p className="text-green-800 text-sm font-medium">{flash.success}</p>
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                        <XCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
                        <p className="text-red-800 text-sm font-medium">{flash.error}</p>
                    </div>
                )}

                {/* Status Lokasi Card */}
                <h2 className="text-gray-500 font-medium text-sm mb-2">Status lokasi</h2>
                <div className={`p-4 rounded-2xl flex items-center shadow-sm ${isValidLocation ? 'bg-[#e2f1e9]' : 'bg-red-100'}`}>
                    {isValidLocation ? (
                        <CheckCircle2 className="text-[#207c65] w-10 h-10 mr-4 flex-shrink-0" />
                    ) : (
                        <XCircle className="text-red-500 w-10 h-10 mr-4 flex-shrink-0" />
                    )}
                    <div>
                        <h3 className={`font-semibold ${isValidLocation ? 'text-[#207c65]' : 'text-red-600'}`}>
                            {gpsStatus}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{distanceMsg}</p>
                    </div>
                </div>

                {/* Error Validasi */}
                {errors.location && (
                    <p className="mt-2 text-red-600 text-sm">{errors.location}</p>
                )}

                {/* Absen Masuk/Pulang Area */}
                {!(todayData?.check_in_time && todayData?.check_out_time) && (
                    <>
                        <h2 className="text-gray-500 font-medium text-sm mt-6 mb-2">
                            {todayData?.check_in_time && !todayData?.check_out_time ? 'Absen pulang' : 'Absen masuk'}
                        </h2>
                        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center">
                            <div className="relative w-40 h-40 rounded-full border-4 border-dashed border-gray-300 bg-[#2a3647] flex items-center justify-center mb-4 overflow-hidden">
                                <Camera className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-400 mb-6">Pastikan wajah terlihat jelas untuk verifikasi</p>

                            <form onSubmit={handleAbsen} className="w-full">
                                <button
                                    type="submit"
                                    disabled={!isValidLocation || processing}
                                    className={`w-full py-3 rounded-xl font-semibold text-white flex justify-center items-center gap-2 transition-all ${
                                        isValidLocation
                                        ? 'bg-[#31735a] hover:bg-[#265e49]'
                                        : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <Camera className="w-5 h-5" />
                                    {processing
                                        ? 'Memproses...'
                                        : todayData?.check_in_time
                                            ? 'Ambil selfie & absen pulang'
                                            : 'Ambil selfie & absen masuk'}
                                </button>
                            </form>
                        </div>
                    </>
                )}

                {/* Sudah selesai absen hari ini */}
                {todayData?.check_in_time && todayData?.check_out_time && (
                    <div className="mt-6 p-4 bg-[#e2f1e9] rounded-2xl flex items-center gap-3">
                        <CheckCircle2 className="text-[#207c65] w-6 h-6" />
                        <p className="text-[#207c65] font-semibold text-sm">Absen masuk & pulang hari ini selesai.</p>
                    </div>
                )}

                {/* Ringkasan Hari Ini */}
                <h2 className="text-gray-500 font-medium text-sm mt-8 mb-2">Ringkasan hari ini</h2>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-500 text-sm">Jam masuk</span>
                        <span className="font-semibold text-gray-700">
                            {todayData?.check_in_time
                                ? new Date(todayData.check_in_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                                : '— : —'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-500 text-sm">Jam pulang</span>
                        <span className="font-semibold text-gray-700">
                            {todayData?.check_out_time
                                ? new Date(todayData.check_out_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                                : '— : —'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pt-3">
                        <span className="text-gray-500 text-sm">Status</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            todayData?.status === 'Tepat Waktu' ? 'bg-[#e2f1e9] text-[#207c65]' :
                            todayData?.status === 'Telat'      ? 'bg-orange-100 text-orange-600' :
                            'bg-gray-100 text-gray-500'
                        }`}>
                            {todayData?.status || 'Belum absen'}
                        </span>
                    </div>
                    {todayData?.late_minutes > 0 && (
                        <p className="text-xs text-orange-600 mt-2">Telat {todayData.late_minutes} menit</p>
                    )}
                    {todayData?.overtime_minutes > 0 && (
                        <p className="text-xs text-blue-600 mt-1">Lembur {todayData.overtime_minutes} menit</p>
                    )}
                </div>

                {/* Riwayat Minggu Ini */}
                <h2 className="text-gray-500 font-medium text-sm mt-8 mb-2">Riwayat minggu ini</h2>
                <div className="space-y-3">
                    {history && history.length > 0 ? (
                        history.map((item) => {
                            const isLate = item.late_minutes > 0;
                            return (
                                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#eef1f6] flex items-center justify-center">
                                            <Camera className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-800">
                                                {dayjs(item.work_date).format('dddd, DD MMMM')}
                                            </h4>
                                            <p className="text-xs text-gray-400">
                                                {item.check_in_time
                                                    ? new Date(item.check_in_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                                                    : '–'} — {item.check_out_time
                                                    ? new Date(item.check_out_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                                                    : '–'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${isLate ? 'bg-orange-100 text-orange-700' : 'bg-[#e2f1e9] text-[#207c65]'}`}>
                                            {item.status || (isLate ? `Telat ${item.late_minutes} mnt` : 'Tepat waktu')}
                                        </span>
                                        <p className="text-[10px] text-gray-400 mt-1">Di lokasi</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-400 text-sm py-4">Tidak ada riwayat minggu ini.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
