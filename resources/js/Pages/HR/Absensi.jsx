import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import { ClipboardDocumentListIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const STATUS_OPTIONS = [
    { value: 'hadir',  label: 'Hadir',  color: 'bg-green-100 text-green-800' },
    { value: 'izin',   label: 'Izin',   color: 'bg-blue-100 text-blue-800' },
    { value: 'sakit',  label: 'Sakit',  color: 'bg-yellow-100 text-yellow-800' },
    { value: 'alpha',  label: 'Alpha',  color: 'bg-red-100 text-red-800' },
];

function RekapBadge({ rekap }) {
    if (!rekap) return <span className="text-gray-400 text-xs">—</span>;
    return (
        <div className="flex flex-wrap gap-1">
            {rekap.map((r) => {
                const opt = STATUS_OPTIONS.find((s) => s.value === r.status_hadir);
                return (
                    <span key={r.status_hadir} className={`px-1.5 py-0.5 rounded text-xs font-medium ${opt?.color ?? 'bg-gray-100 text-gray-800'}`}>
                        {opt?.label ?? r.status_hadir} {r.total}x
                    </span>
                );
            })}
        </div>
    );
}

export default function Absensi({ karyawanList, absensiHariIni, rekapBulan, divisiList, filters }) {
    const [rows, setRows] = useState(() =>
        karyawanList.map((k) => {
            const existing = absensiHariIni[k.id];
            return {
                karyawan_id:  k.id,
                status_hadir: existing?.status_hadir ?? 'hadir',
                jam_lembur:   existing?.jam_lembur ?? 0,
                keterangan:   existing?.keterangan ?? '',
            };
        })
    );
    const [submitting, setSubmitting] = useState(false);

    const updateRow = (idx, field, value) =>
        setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        router.post(route('hr.absensi.store'), { tanggal: filters.tanggal, absensi: rows }, {
            onFinish: () => setSubmitting(false),
        });
    };

    const handleFilterChange = (field, value) =>
        router.get(route('hr.absensi.index'), { ...filters, [field]: value }, { preserveState: true });

    return (
        <AppLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Absensi Karyawan</h2>}>
            <Head title="Absensi" />
            <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                <Card>
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Divisi</label>
                            <select
                                className="border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm"
                                value={filters.divisi}
                                onChange={(e) => handleFilterChange('divisi', e.target.value)}
                            >
                                {Object.entries(divisiList).map(([k, v]) => (
                                    <option key={k} value={k}>{v}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                            <input
                                type="date"
                                className="border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm"
                                value={filters.tanggal}
                                max={new Date().toISOString().split('T')[0]}
                                onChange={(e) => handleFilterChange('tanggal', e.target.value)}
                            />
                        </div>
                        <Link
                            href={route('hr.absensi.rekap')}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <ClipboardDocumentListIcon className="h-4 w-4 mr-1" />
                            Lihat Rekap
                        </Link>
                    </div>
                </Card>

                <form onSubmit={handleSubmit}>
                    <Card
                        title={`Input Absensi — ${filters.tanggal}`}
                        actions={
                            <button
                                type="submit"
                                disabled={submitting || karyawanList.length === 0}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 disabled:opacity-50"
                            >
                                <CheckCircleIcon className="h-4 w-4" />
                                {submitting ? 'Menyimpan...' : 'Simpan Absensi'}
                            </button>
                        }
                    >
                        {karyawanList.length === 0 ? (
                            <p className="text-center text-gray-500 py-6">Tidak ada karyawan aktif di divisi ini.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jabatan</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe Gaji</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status Hadir</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Jam Lembur</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rekap Bulan Ini</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {karyawanList.map((k, idx) => (
                                            <tr key={k.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{k.name}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">{k.jabatan ?? '—'}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        k.tipe_gaji === 'borongan' ? 'bg-blue-100 text-blue-800' :
                                                        k.tipe_gaji === 'harian'   ? 'bg-green-100 text-green-800' :
                                                        k.tipe_gaji === 'bulanan'  ? 'bg-purple-100 text-purple-800' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>{k.tipe_gaji ?? '—'}</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <select
                                                        className="border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm text-sm"
                                                        value={rows[idx].status_hadir}
                                                        onChange={(e) => updateRow(idx, 'status_hadir', e.target.value)}
                                                    >
                                                        {STATUS_OPTIONS.map((s) => (
                                                            <option key={s.value} value={s.value}>{s.label}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <input
                                                        type="number" min="0" max="12" step="0.5"
                                                        className="w-20 border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm text-sm text-center"
                                                        value={rows[idx].jam_lembur}
                                                        onChange={(e) => updateRow(idx, 'jam_lembur', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        className="w-full border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm text-sm"
                                                        placeholder="Opsional"
                                                        value={rows[idx].keterangan}
                                                        onChange={(e) => updateRow(idx, 'keterangan', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-4 py-3"><RekapBadge rekap={rekapBulan[k.id]} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
