import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';

export default function Keuangan({ auth, filters, rekap, piutang }) {
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('laporan.keuangan'), {
            start_date: startDate,
            end_date: endDate
        }, { preserveState: true });
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    };

    return (
        <AppLayout title="Laporan Keuangan">
            <Head title="Laporan Keuangan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Filters */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-4">
                        <form onSubmit={handleFilter} className="flex gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
                                <input 
                                    type="date" 
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tanggal Akhir</label>
                                <input 
                                    type="date" 
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                                />
                            </div>
                            <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700">
                                Filter
                            </button>
                        </form>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 shadow-sm sm:rounded-lg">
                            <div className="text-gray-500 text-sm">Omzet (Pendapatan)</div>
                            <div className="text-2xl font-bold text-green-600">{formatRupiah(rekap.omzet)}</div>
                        </div>
                        <div className="bg-white p-4 shadow-sm sm:rounded-lg">
                            <div className="text-gray-500 text-sm">Total Biaya (Pengeluaran)</div>
                            <div className="text-2xl font-bold text-red-600">{formatRupiah(rekap.total_biaya)}</div>
                        </div>
                        <div className="bg-white p-4 shadow-sm sm:rounded-lg">
                            <div className="text-gray-500 text-sm">Laba Kotor</div>
                            <div className="text-2xl font-bold text-brand-600">{formatRupiah(rekap.laba_kotor)}</div>
                        </div>
                    </div>

                    {/* Daftar Piutang */}
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Daftar Piutang (Belum Lunas)</h3>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Tagihan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sudah Dibayar</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sisa Tagihan</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {piutang && piutang.length > 0 ? (
                                    piutang.map((p, i) => (
                                        <tr key={i}>
                                            <td className="px-6 py-4 whitespace-nowrap">{p.customer?.nama || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{p.no_order}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{formatRupiah(p.total_harga)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{formatRupiah(p.dp)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold text-red-600">{formatRupiah(p.sisa_bayar)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Tidak ada piutang untuk periode ini</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
