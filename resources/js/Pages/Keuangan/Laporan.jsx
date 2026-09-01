import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

export default function Laporan({ startDate, endDate, pendapatan, biaya, laba, piutangCustomer }) {
    const fmtRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);

    return (
        <AppLayout title="Laporan Laba Rugi">
            <Head title="Laporan" />

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold">Laporan Laba Rugi</h2>
                    <p className="text-gray-500">Periode: {startDate} s/d {endDate}</p>
                </div>
                <form className="flex gap-2" method="GET" action={route('keuangan.laporan')}>
                    <input type="date" name="start_date" defaultValue={startDate} className="border-gray-300 rounded text-sm" />
                    <input type="date" name="end_date" defaultValue={endDate} className="border-gray-300 rounded text-sm" />
                    <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded text-sm">Filter</button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Pendapatan (Masuk)</h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">{fmtRupiah(pendapatan)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Biaya (Keluar)</h3>
                    <p className="text-2xl font-bold text-red-600 mt-2">{fmtRupiah(biaya)}</p>
                </div>
                <div className="bg-brand-50 p-6 rounded-lg shadow-sm border border-brand-200">
                    <h3 className="text-brand-800 text-sm font-medium">Laba / Rugi</h3>
                    <p className={`text-3xl font-bold mt-2 ${laba >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {fmtRupiah(laba)}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold mb-4">Rekap Piutang Customer (Belum Lunas)</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="pb-2">Nama Customer</th>
                                <th className="pb-2 text-right">Total Piutang</th>
                            </tr>
                        </thead>
                        <tbody>
                            {piutangCustomer.map((p, i) => (
                                <tr key={i} className="border-b last:border-0">
                                    <td className="py-3">{p.customer}</td>
                                    <td className="py-3 text-right text-orange-600 font-medium">{fmtRupiah(p.total_piutang)}</td>
                                </tr>
                            ))}
                            {piutangCustomer.length === 0 && (
                                <tr>
                                    <td colSpan="2" className="py-4 text-center text-gray-500">Tidak ada piutang saat ini.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
