import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import HRTabs from './HRTabs';
import { CameraIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Modal from '@/Components/Modal';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

export default function AbsensiRiwayat({ riwayat, divisiList, filters }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const handleFilterChange = (key, value) => {
        router.get(route('hr.absensi.riwayat'), { ...filters, [key]: value }, { preserveState: true });
    };

    return (
        <AppLayout title="Riwayat Absensi Harian">
            <Head title="Riwayat Absensi Harian" />
            <div className="mb-6">
                <HRTabs />
            </div>
            <div className="space-y-6">

                <Card>
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Divisi</label>
                            <select
                                className="border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm text-sm"
                                value={filters.divisi}
                                onChange={(e) => handleFilterChange('divisi', e.target.value)}
                            >
                                <option value="">Semua Divisi</option>
                                {Object.entries(divisiList).map(([k, v]) => (
                                    <option key={k} value={k}>{v}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                            <input
                                type="date"
                                className="border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm text-sm"
                                value={filters.tanggal}
                                onChange={(e) => handleFilterChange('tanggal', e.target.value)}
                            />
                        </div>
                    </div>
                </Card>

                <Card title={`Riwayat Kehadiran - ${dayjs(filters.tanggal).format('DD MMMM YYYY')}`}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Karyawan</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Divisi</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Status</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase text-xs">Jam Masuk</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase text-xs">Jam Pulang</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Lokasi & Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {riwayat.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                                            Belum ada data riwayat absensi.
                                        </td>
                                    </tr>
                                ) : (
                                    riwayat.map((absen) => (
                                        <tr key={absen.id}>
                                            <td className="px-4 py-3 font-medium text-gray-900">{absen.karyawan}</td>
                                            <td className="px-4 py-3 text-gray-500 capitalize">{absen.divisi}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    absen.status_hadir === 'hadir' ? 'bg-emerald-100 text-emerald-800' :
                                                    absen.status_hadir === 'sakit' ? 'bg-amber-100 text-amber-800' :
                                                    absen.status_hadir === 'izin' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-rose-100 text-rose-800'
                                                }`}>
                                                    {absen.status_hadir}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="font-medium text-gray-900">{absen.jam_masuk ? absen.jam_masuk.substring(0, 5) : '-'}</span>
                                                    {absen.telat_menit > 0 && (
                                                        <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                                                            Telat {absen.telat_menit} mnt
                                                        </span>
                                                    )}
                                                    {absen.foto_masuk && (
                                                        <button 
                                                            onClick={() => setSelectedPhoto(absen.foto_masuk)}
                                                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                        >
                                                            <CameraIcon className="w-3 h-3" /> Foto
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="font-medium text-gray-900">{absen.jam_keluar ? absen.jam_keluar.substring(0, 5) : '-'}</span>
                                                    {absen.foto_keluar && (
                                                        <button 
                                                            onClick={() => setSelectedPhoto(absen.foto_keluar)}
                                                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                        >
                                                            <CameraIcon className="w-3 h-3" /> Foto
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                                                {absen.lokasi_absen && (
                                                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                                        <MapPinIcon className="w-3 h-3" /> {absen.lokasi_absen}
                                                    </div>
                                                )}
                                                {absen.keterangan && <div className="truncate text-xs">{absen.keterangan}</div>}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <Modal show={!!selectedPhoto} onClose={() => setSelectedPhoto(null)} maxWidth="sm">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Foto Absensi</h3>
                        <button onClick={() => setSelectedPhoto(null)} className="text-gray-500 hover:text-gray-700">&times;</button>
                    </div>
                    {selectedPhoto && (
                        <img src={selectedPhoto} alt="Bukti Kehadiran" className="w-full rounded-lg shadow-sm" />
                    )}
                </div>
            </Modal>
        </AppLayout>
    );
}
