import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Card from '@/Components/Card';
import { ArrowLeftIcon, PlayIcon } from '@heroicons/react/24/outline';

export default function PenggajianCreate({ karyawanList, divisiList }) {
    const today = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm({
        karyawan_ids: [],
        periode_mulai: firstDayOfMonth,
        periode_selesai: today,
    });

    const [selectedDivisi, setSelectedDivisi] = useState('');

    const filteredKaryawan = selectedDivisi
        ? karyawanList.filter((k) => k.divisi === selectedDivisi)
        : karyawanList;

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = Array.from(new Set([...data.karyawan_ids, ...filteredKaryawan.map((k) => k.id)]));
            setData('karyawan_ids', allIds);
        } else {
            const filteredIds = new Set(filteredKaryawan.map((k) => k.id));
            setData('karyawan_ids', data.karyawan_ids.filter((id) => !filteredIds.has(id)));
        }
    };

    const handleToggleKaryawan = (id) => {
        if (data.karyawan_ids.includes(id)) {
            setData('karyawan_ids', data.karyawan_ids.filter((i) => i !== id));
        } else {
            setData('karyawan_ids', [...data.karyawan_ids, id]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('hr.penggajian.generate'));
    };

    return (
        <AppLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Generate Slip Gaji</h2>}>
            <Head title="Generate Slip Gaji" />

            <div className="py-8 max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-6">
                <div className="flex justify-between items-center">
                    <Link
                        href={route('hr.penggajian.index')}
                        className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Kembali ke Penggajian
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card title="Pengaturan Periode Penggajian">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Periode Mulai</label>
                                <input
                                    type="date"
                                    className="w-full border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm"
                                    value={data.periode_mulai}
                                    onChange={(e) => setData('periode_mulai', e.target.value)}
                                />
                                {errors.periode_mulai && <p className="text-red-500 text-xs mt-1">{errors.periode_mulai}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Periode Selesai</label>
                                <input
                                    type="date"
                                    className="w-full border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm"
                                    value={data.periode_selesai}
                                    onChange={(e) => setData('periode_selesai', e.target.value)}
                                />
                                {errors.periode_selesai && <p className="text-red-500 text-xs mt-1">{errors.periode_selesai}</p>}
                            </div>
                        </div>
                    </Card>

                    <Card
                        title={`Pilih Karyawan (${data.karyawan_ids.length} dipilih)`}
                        actions={
                            <div className="flex items-center gap-3">
                                <select
                                    className="border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm text-sm"
                                    value={selectedDivisi}
                                    onChange={(e) => setSelectedDivisi(e.target.value)}
                                >
                                    <option value="">Semua Divisi</option>
                                    {Object.entries(divisiList).map(([k, v]) => (
                                        <option key={k} value={k}>{v}</option>
                                    ))}
                                </select>
                            </div>
                        }
                    >
                        {errors.karyawan_ids && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                                {errors.karyawan_ids}
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left w-12">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                                onChange={handleSelectAll}
                                                checked={filteredKaryawan.length > 0 && filteredKaryawan.every((k) => data.karyawan_ids.includes(k.id))}
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Divisi</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe Gaji</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tarif / Gaji Pokok</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredKaryawan.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-6 text-center text-gray-500 text-sm">
                                                Tidak ada karyawan yang sesuai filter.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredKaryawan.map((k) => (
                                            <tr
                                                key={k.id}
                                                className={`cursor-pointer hover:bg-brand-50/50 ${data.karyawan_ids.includes(k.id) ? 'bg-brand-50/40' : ''}`}
                                                onClick={() => handleToggleKaryawan(k.id)}
                                            >
                                                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                                        checked={data.karyawan_ids.includes(k.id)}
                                                        onChange={() => handleToggleKaryawan(k.id)}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{k.name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-500 capitalize">{k.divisi}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        k.tipe_gaji === 'borongan' ? 'bg-blue-100 text-blue-800' :
                                                        k.tipe_gaji === 'harian' ? 'bg-emerald-100 text-emerald-800' :
                                                        'bg-purple-100 text-purple-800'
                                                    }`}>
                                                        {k.tipe_gaji}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right font-medium text-gray-700">
                                                    Rp {Number(k.tarif_default || 0).toLocaleString('id-ID')}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing || data.karyawan_ids.length === 0}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 rounded-lg text-white font-semibold text-sm hover:bg-brand-700 shadow-sm disabled:opacity-50"
                            >
                                <PlayIcon className="h-4 w-4" />
                                {processing ? 'Memproses...' : `Generate Gaji (${data.karyawan_ids.length})`}
                            </button>
                        </div>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
