import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import MobileStaffLayout from '@/Layouts/MobileStaffLayout';
import { 
    CheckCircleIcon as CheckCircle, 
    XCircleIcon as XCircle,
    MapPinIcon as MapPin,
    ScissorsIcon,
    ClockIcon,
    BanknotesIcon,
    CameraIcon,
    BriefcaseIcon
} from '@heroicons/react/24/outline';
import { CameraIcon as CameraSolid, ScissorsIcon as ScissorsSolid, ClockIcon as ClockSolid, BanknotesIcon as BanknotesSolid, BriefcaseIcon as BriefcaseSolid } from '@heroicons/react/24/solid';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

const STATUS_HADIR_MAP = {
    hadir:  { label: 'Hadir',  color: 'bg-teal-100 text-teal-800' },
    izin:   { label: 'Izin',   color: 'bg-blue-100 text-blue-800' },
    sakit:  { label: 'Sakit',  color: 'bg-yellow-100 text-yellow-800' },
    alpha:  { label: 'Alpha',  color: 'bg-red-100 text-red-800' },
};

export default function SelfAbsensi({ absensiHariIni, riwayatMingguIni, lokasiKantor }) {
    const { auth, flash } = usePage().props;
    const [locationStatus, setLocationStatus] = useState('mencari');
    const [distanceInfo, setDistanceInfo] = useState('');
    const [currentLokasi, setCurrentLokasi] = useState(null);
    const [coords, setCoords] = useState(null);
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    // Gunakan ref untuk menyimpan foto agar tidak terjadi race condition dengan setData
    const fotoRef = useRef('');
    const submitTypeRef = useRef(null);
    const [cameraActive, setCameraActive] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        foto: '',
        latitude: '',
        longitude: '',
        lokasi_absen: ''
    });

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3;
        const p1 = lat1 * Math.PI/180;
        const p2 = lat2 * Math.PI/180;
        const dp = (lat2-lat1) * Math.PI/180;
        const dl = (lon2-lon1) * Math.PI/180;
        const a = Math.sin(dp/2) * Math.sin(dp/2) +
                Math.cos(p1) * Math.cos(p2) *
                Math.sin(dl/2) * Math.sin(dl/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return Math.floor(R * c);
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCoords({ latitude, longitude });
                    setData(data => ({ ...data, latitude, longitude }));

                    let nearest = null;
                    let minDistance = Infinity;

                    Object.entries(lokasiKantor).forEach(([nama, k]) => {
                        const dist = getDistance(latitude, longitude, parseFloat(k.lat), parseFloat(k.lng));
                        if (dist < minDistance) {
                            minDistance = dist;
                            nearest = { nama, ...k, distance: dist };
                        }
                    });

                    if (nearest) {
                        setCurrentLokasi(nearest);
                        setData('lokasi_absen', nearest.nama);
                        if (nearest.distance <= nearest.radius) {
                            setLocationStatus('dalam_radius');
                            setDistanceInfo(`Jarak ${nearest.distance}m dari titik ${nearest.nama} • radius diizinkan ${nearest.radius}m`);
                        } else {
                            setLocationStatus('luar_radius');
                            setDistanceInfo(`Jarak ${nearest.distance}m dari titik ${nearest.nama} • di luar radius ${nearest.radius}m`);
                        }
                    }
                },
                (error) => {
                    setLocationStatus('error');
                    setDistanceInfo('Gagal mendapatkan lokasi. Pastikan GPS aktif dan diizinkan.');
                },
                { enableHighAccuracy: true }
            );
        } else {
            setLocationStatus('error');
            setDistanceInfo('Browser tidak mendukung Geolocation.');
        }

        startCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, [lokasiKantor]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraActive(true);
            }
        } catch (err) {
            console.error("Camera error:", err);
            setCameraActive(false);
        }
    };

    const takePhotoAndSubmit = (type) => {
        if (!canvasRef.current || !videoRef.current) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Kompresi: Batasi dimensi maksimal gambar (misal lebar maks 800px)
        const MAX_WIDTH = 800;
        const scale = Math.min(MAX_WIDTH / video.videoWidth, 1);
        
        canvas.width = video.videoWidth * scale;
        canvas.height = video.videoHeight * scale;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Kompresi: Simpan sebagai JPEG dengan kualitas 70% (0.7)
        const base64Image = canvas.toDataURL('image/jpeg', 0.7);

        // Set semua data sekaligus lalu langsung submit
        // React batches state updates sehingga form.data sudah terupdate saat post dipanggil
        const formData = {
            foto: base64Image,
            latitude: data.latitude,
            longitude: data.longitude,
            lokasi_absen: data.lokasi_absen,
        };

        setData(formData);

        const routeName = type === 'masuk' ? 'karyawan.absensi.masuk' : 'karyawan.absensi.keluar';
        // Submit langsung dengan data yang sudah final, menghindari race condition setData
        router.post(route(routeName), formData, {
            preserveScroll: true,
        });
    };


    const isAbsenMasukDone = absensiHariIni && absensiHariIni.jam_masuk;
    const isAbsenKeluarDone = absensiHariIni && absensiHariIni.jam_keluar;

    const isOperator = ['jahit', 'cutting', 'pemasangan', 'printing'].includes(auth.user.divisi);
    const TugasIcon = isOperator ? ScissorsIcon : BriefcaseIcon;
    const TugasSolid = isOperator ? ScissorsSolid : BriefcaseSolid;

    const tabs = [
        { id: 'tugas', label: 'Tugas', icon: TugasIcon, activeIcon: TugasSolid, activeColorClass: 'text-teal-600', href: route('dashboard') },
        ...(isOperator ? [
            { id: 'riwayat', label: 'Riwayat', icon: ClockIcon, activeIcon: ClockSolid, activeColorClass: 'text-teal-600', href: route('dashboard') },
            { id: 'penghasilan', label: 'Penghasilan', icon: BanknotesIcon, activeIcon: BanknotesSolid, activeColorClass: 'text-amber-600', href: route('dashboard') },
        ] : []),
        { id: 'absensi', label: 'Absen', icon: CameraIcon, activeIcon: CameraSolid, activeColorClass: 'text-teal-600', href: route('karyawan.absensi.index') },
    ];

    return (
        <MobileStaffLayout 
            title={`Absensi — ${auth.user.name}`}
            headerSubtitle={dayjs().format('dddd, DD MMMM YYYY')}
            headerLabel="Shift pagi · 07.00–15.00"
            activeTab="absensi" 
            setActiveTab={() => {}} 
            tabs={tabs}
        >
            <div className="space-y-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-center space-x-3">
                        <CheckCircle className="text-teal-600 w-5 h-5 flex-shrink-0" />
                        <p className="text-teal-800 text-sm font-medium">{flash.success}</p>
                    </div>
                )}
                {flash?.error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                        <XCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
                        <p className="text-red-800 text-sm font-medium">{flash.error}</p>
                    </div>
                )}
                {Object.keys(errors).length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        {Object.values(errors).map((err, i) => (
                            <p key={i} className="text-red-700 text-sm">{err}</p>
                        ))}
                    </div>
                )}

                <div>
                    <h2 className="text-sm font-bold text-gray-800 mb-2 font-oswald uppercase tracking-wide">Status Lokasi</h2>
                    <div className={`p-4 rounded-xl flex items-start space-x-3 ${locationStatus === 'dalam_radius' ? 'bg-teal-50 border border-teal-100' : 'bg-red-50 border border-red-100'}`}>
                        {locationStatus === 'dalam_radius' ? (
                            <CheckCircle className="text-teal-600 mt-0.5 w-6 h-6" />
                        ) : (
                            <XCircle className="text-red-500 mt-0.5 w-6 h-6" />
                        )}
                        <div>
                            <h3 className={`font-bold ${locationStatus === 'dalam_radius' ? 'text-teal-800' : 'text-red-800'}`}>
                                {locationStatus === 'dalam_radius' ? 'Di dalam radius kantor' : 
                                 locationStatus === 'mencari' ? 'Mencari lokasi...' : 'Di luar jangkauan / Error'}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">{distanceInfo}</p>
                        </div>
                    </div>
                </div>

                {!isAbsenKeluarDone && (
                    <div>
                        <h2 className="text-sm font-bold text-gray-800 mb-2 font-oswald uppercase tracking-wide">
                            {!isAbsenMasukDone ? 'Absen Masuk' : 'Absen Keluar'}
                        </h2>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center">
                                {cameraActive ? (
                                    <video ref={videoRef} autoPlay playsInline muted className="object-cover w-full h-full transform scale-x-[-1]"></video>
                                ) : (
                                    <CameraIcon className="text-gray-400 w-12 h-12" />
                                )}
                            </div>
                            <canvas ref={canvasRef} className="hidden"></canvas>
                            
                            <p className="text-xs text-gray-500 mt-4 mb-5 text-center">
                                Pastikan wajah terlihat jelas untuk verifikasi
                            </p>
                            
                            {!isAbsenMasukDone ? (
                                <button 
                                    onClick={() => takePhotoAndSubmit('masuk')}
                                    disabled={locationStatus !== 'dalam_radius' || processing}
                                    className="w-full bg-[#1e40af] hover:bg-blue-800 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition shadow-md"
                                >
                                    <CameraIcon className="w-5 h-5" />
                                    <span>{processing ? 'Memproses...' : 'AMBIL SELFIE & ABSEN MASUK'}</span>
                                </button>
                            ) : (
                                <button 
                                    onClick={() => takePhotoAndSubmit('keluar')}
                                    disabled={locationStatus !== 'dalam_radius' || processing}
                                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition shadow-md"
                                >
                                    <CameraIcon className="w-5 h-5" />
                                    <span>{processing ? 'Memproses...' : 'AMBIL SELFIE & ABSEN KELUAR'}</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Ringkasan Hari Ini */}
                <div>
                    <h2 className="text-sm font-bold text-gray-800 mb-2 font-oswald uppercase tracking-wide">Ringkasan Hari Ini</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 divide-y divide-gray-100">
                        <div className="py-3 flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Jam masuk</span>
                            <span className="font-bold text-gray-800">{absensiHariIni?.jam_masuk ? absensiHariIni.jam_masuk.substring(0,5) : '– : –'}</span>
                        </div>
                        <div className="py-3 flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Jam pulang</span>
                            <span className="font-bold text-gray-800">{absensiHariIni?.jam_keluar ? absensiHariIni.jam_keluar.substring(0,5) : '– : –'}</span>
                        </div>
                        <div className="py-3 flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Status</span>
                            {isAbsenMasukDone ? (
                                <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold">Hadir</span>
                            ) : (
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">Belum absen</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Riwayat Minggu Ini */}
                {riwayatMingguIni && riwayatMingguIni.length > 0 && (
                    <div>
                        <h2 className="text-sm font-bold text-gray-800 mb-2 font-oswald uppercase tracking-wide">Riwayat Minggu Ini</h2>
                        <div className="space-y-2">
                            {riwayatMingguIni.map((item) => {
                                const statusInfo = STATUS_HADIR_MAP[item.status_hadir] ?? { label: item.status_hadir, color: 'bg-gray-100 text-gray-700' };
                                return (
                                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">
                                                {dayjs(item.tanggal).format('dddd, DD MMMM')}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {item.jam_masuk ? item.jam_masuk.substring(0,5) : '–'} — {item.jam_keluar ? item.jam_keluar.substring(0,5) : '–'}
                                                {item.jam_lembur > 0 && ` · Lembur ${item.jam_lembur}j`}
                                            </p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </MobileStaffLayout>
    );
}
