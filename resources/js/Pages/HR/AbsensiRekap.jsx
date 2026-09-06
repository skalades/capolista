import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import HRTabs from './HRTabs';

const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function AbsensiRekap({ karyawanList, rekapData, divisiList, filters }) {
    const handleFilterChange = (key, value) => {
        router.get(route('hr.absensi.rekap'), { ...filters, [key]: value }, { preserveState: true });
    };

    const getCount = (karyawanId, status) => {
        const list = rekapData[karyawanId] || [];
        const found = list.find((item) => item.status_hadir === status);
        return found ? found.total : 0;
    };

    const getTotalLembur = (karyawanId) => {
        const list = rekapData[karyawanId] || [];
        return list.reduce((acc, curr) => acc + Number(curr.total_lembur || 0), 0);
    };

    return (
        <AppLayout title="Rekap Absensi Bulanan">
            <Head title="Rekap Absensi" />
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                            <select
                                className="border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm text-sm"
                                value={filters.bulan}
                                onChange={(e) => handleFilterChange('bulan', e.target.value)}
                            >
                                {MONTH_NAMES.map((name, idx) => (
                                    <option key={idx + 1} value={idx + 1}>{name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                            <input
                                type="number"
                                className="w-28 border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm text-sm"
                                value={filters.tahun}
                                onChange={(e) => handleFilterChange('tahun', e.target.value)}
                            />
                        </div>
                    </div>
                </Card>

                <Card title={`Rekap Periode ${MONTH_NAMES[filters.bulan - 1]} ${filters.tahun}`}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Karyawan</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Divisi</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Tipe Gaji</th>
                                    <th className="px-4 py-3 text-center font-medium text-emerald-600 uppercase text-xs">Hadir</th>
                                    <th className="px-4 py-3 text-center font-medium text-blue-600 uppercase text-xs">Izin</th>
                                    <th className="px-4 py-3 text-center font-medium text-amber-600 uppercase text-xs">Sakit</th>
                                    <th className="px-4 py-3 text-center font-medium text-rose-600 uppercase text-xs">Alpha</th>
                                    <th className="px-4 py-3 text-center font-medium text-brand-600 uppercase text-xs">Jam Lembur</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {karyawanList.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                                            Tidak ada data karyawan.
                                        </td>
                                    </tr>
                                ) : (
                                    karyawanList.map((k) => (
                                        <tr key={k.id}>
                                            <td className="px-4 py-3 font-medium text-gray-900">{k.name}</td>
                                            <td className="px-4 py-3 text-gray-500 capitalize">{k.divisi}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    k.tipe_gaji === 'borongan' ? 'bg-blue-100 text-blue-800' :
                                                    k.tipe_gaji === 'harian' ? 'bg-emerald-100 text-emerald-800' :
                                                    'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {k.tipe_gaji}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center font-semibold text-emerald-600">{getCount(k.id, 'hadir')}</td>
                                            <td className="px-4 py-3 text-center text-blue-600">{getCount(k.id, 'izin')}</td>
                                            <td className="px-4 py-3 text-center text-amber-600">{getCount(k.id, 'sakit')}</td>
                                            <td className="px-4 py-3 text-center font-semibold text-rose-600">{getCount(k.id, 'alpha')}</td>
                                            <td className="px-4 py-3 text-center font-medium text-brand-600">{getTotalLembur(k.id)} jam</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
