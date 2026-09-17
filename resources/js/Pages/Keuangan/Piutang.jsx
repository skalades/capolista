import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

export default function Piutang({ piutangs, filters }) {
    const fmtRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
    
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('keuangan.piutang.index'), { search }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout title="Daftar Piutang">
            <Head title="Piutang" />

            <div className="flex flex-col md:flex-row justify-between mb-6 items-center gap-4">
                <h2 className="text-xl font-bold">Daftar Piutang Customer</h2>
                
                <form onSubmit={handleSearch} className="flex">
                    <input 
                        type="text" 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                        placeholder="Cari no order / customer..."
                        className="rounded-l border-gray-300 focus:ring-navy focus:border-navy"
                    />
                    <button type="submit" className="bg-navy text-white px-4 py-2 rounded-r">
                        Cari
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-4">Tgl Order</th>
                            <th className="p-4">No. Order</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Total Harga</th>
                            <th className="p-4">Sisa Bayar (Piutang)</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {piutangs.data.map(o => (
                            <tr key={o.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{o.tanggal_order}</td>
                                <td className="p-4 font-mono">#{o.no_order}</td>
                                <td className="p-4">{o.customer?.nama}</td>
                                <td className="p-4">{fmtRupiah(o.total_harga)}</td>
                                <td className="p-4 font-bold text-red-600">{fmtRupiah(o.sisa_bayar)}</td>
                                <td className="p-4 capitalize">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">{o.status}</span>
                                </td>
                            </tr>
                        ))}
                        {piutangs.data.length === 0 && (
                            <tr><td colSpan="6" className="p-4 text-center">Tidak ada piutang.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {piutangs.links && piutangs.data.length > 0 && (
                <div className="mt-4">
                    <Pagination 
                        links={piutangs.links} 
                        from={piutangs.from} 
                        to={piutangs.to} 
                        total={piutangs.total} 
                    />
                </div>
            )}
        </AppLayout>
    );
}
