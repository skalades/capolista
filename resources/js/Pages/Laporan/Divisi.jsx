import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';

export default function Divisi({ auth, filters, performa_divisi }) {
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('laporan.divisi'), {
            start_date: startDate,
            end_date: endDate
        }, { preserveState: true });
    };

    const divisionNames = {
        desain: 'Desain',
        printing: 'Printing',
        produksi: 'Produksi',
        pemasangan: 'Pemasangan'
    };

    // Default empty state if no data
    const divisiData = Object.keys(divisionNames).map(key => {
        return {
            key,
            name: divisionNames[key],
            diproses: performa_divisi[key]?.diproses || 0,
            avg_waktu: performa_divisi[key]?.avg_waktu || 0,
            terlambat: performa_divisi[key]?.terlambat || 0
        };
    });

    return (
        <AppLayout title="Laporan Performa Divisi">
            <Head title="Laporan Performa Divisi" />

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

                    {/* Divisi Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {divisiData.map((div) => (
                            <div key={div.key} className="bg-white p-6 shadow-sm sm:rounded-lg border-t-4 border-brand-500 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">{div.name}</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-gray-500">Order Diproses</div>
                                        <div className="text-xl font-semibold">{div.diproses}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Rata-rata Waktu (Hari)</div>
                                        <div className="text-xl font-semibold">{div.avg_waktu}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Keterlambatan</div>
                                        <div className={`text-xl font-semibold ${div.terlambat > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {div.terlambat}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
