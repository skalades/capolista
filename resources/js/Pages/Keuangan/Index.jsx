import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { formatRupiah } from '@/utils'; // Assuming this exists or create a simple formatter

export default function Index({ omzet, kasKeluar, piutang, recentPembayarans, recentPengeluarans }) {
    const fmtRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
    };

    return (
        <AppLayout title="Dashboard Keuangan">
            <Head title="Keuangan" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Omzet Bulan Ini</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">{fmtRupiah(omzet)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Kas Keluar Bulan Ini</h3>
                    <p className="text-3xl font-bold text-red-600 mt-2">{fmtRupiah(kasKeluar)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Piutang</h3>
                    <p className="text-3xl font-bold text-orange-600 mt-2">{fmtRupiah(piutang)}</p>
                </div>
            </div>

            <div className="flex gap-4 mb-8">
                <Link href={route('keuangan.pembayaran.index')} className="bg-brand-600 text-white px-4 py-2 rounded shadow hover:bg-brand-700">
                    Kelola Pembayaran
                </Link>
                <Link href={route('keuangan.pengeluaran.index')} className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700">
                    Kelola Pengeluaran
                </Link>
                <Link href={route('keuangan.laporan')} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
                    Laporan Laba Rugi
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold mb-4">5 Pembayaran Terakhir</h3>
                    <div className="space-y-4">
                        {recentPembayarans.map(p => (
                            <div key={p.id} className="flex justify-between items-center border-b pb-2">
                                <div>
                                    <p className="font-medium">Order #{p.order_id}</p>
                                    <p className="text-sm text-gray-500">{p.tanggal} - {p.metode}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600">+{fmtRupiah(p.jumlah)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold mb-4">5 Pengeluaran Terakhir</h3>
                    <div className="space-y-4">
                        {recentPengeluarans.map(p => (
                            <div key={p.id} className="flex justify-between items-center border-b pb-2">
                                <div>
                                    <p className="font-medium">{p.kategori}</p>
                                    <p className="text-sm text-gray-500">{p.tanggal} - {p.deskripsi}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-red-600">-{fmtRupiah(p.jumlah)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
