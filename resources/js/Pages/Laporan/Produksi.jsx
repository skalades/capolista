import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';

export default function Produksi({ auth, filters, orders, stats }) {
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('laporan.produksi'), {
            start_date: startDate,
            end_date: endDate
        }, { preserveState: true });
    };

    return (
        <AppLayout title="Laporan Produksi">
            <Head title="Laporan Produksi" />

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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 shadow-sm sm:rounded-lg">
                            <div className="text-gray-500 text-sm">Total Selesai</div>
                            <div className="text-2xl font-bold">{stats.total_selesai}</div>
                        </div>
                        <div className="bg-white p-4 shadow-sm sm:rounded-lg">
                            <div className="text-gray-500 text-sm">Rata-rata Durasi (Hari)</div>
                            <div className="text-2xl font-bold">{stats.avg_durasi_hari}</div>
                        </div>
                        <div className="bg-white p-4 shadow-sm sm:rounded-lg">
                            <div className="text-gray-500 text-sm">Tepat Waktu</div>
                            <div className="text-2xl font-bold text-green-600">{stats.on_time}</div>
                        </div>
                        <div className="bg-white p-4 shadow-sm sm:rounded-lg">
                            <div className="text-gray-500 text-sm">Terlambat</div>
                            <div className="text-2xl font-bold text-red-600">{stats.terlambat}</div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Masuk</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Selesai</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status SLA</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders && orders.length > 0 ? (
                                    orders.map((order, i) => (
                                        <tr key={i}>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.customer_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.start_date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.completed_date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.is_late ? 'Terlambat' : 'Tepat Waktu'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Tidak ada data untuk periode ini</td>
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
