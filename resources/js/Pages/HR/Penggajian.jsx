import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import StatsCard from '@/Components/StatsCard';
import { CurrencyDollarIcon, BanknotesIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

export default function Index({ penggajians, summary, divisiList, filters }) {
    
    const handleApprove = (id) => {
        if (confirm('Setujui slip gaji ini?')) {
            router.post(route('hr.penggajian.approve', id));
        }
    };

    const handleBayar = (id) => {
        if (confirm('Tandai slip gaji ini sudah ditransfer/dibayar?')) {
            router.post(route('hr.penggajian.bayar', id));
        }
    };

    return (
        <AppLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Penggajian</h2>}>
            <Head title="Penggajian" />

            <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Manajemen Penggajian & HR</h3>
                        <div className="mt-2 flex gap-2">
                            <Link
                                href={route('hr.penggajian.index')}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white shadow-sm"
                            >
                                Daftar Gaji
                            </Link>
                            <Link
                                href={route('hr.absensi.index')}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Input Absensi
                            </Link>
                            <Link
                                href={route('hr.absensi.rekap')}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Rekap Absensi
                            </Link>
                            <Link
                                href={route('hr.output.rekap')}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Rekap Output
                            </Link>
                        </div>
                    </div>
                    <Link
                        href={route('hr.penggajian.create')}
                        className="inline-flex items-center px-4 py-2 bg-brand-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-brand-700"
                    >
                        + Generate Slip Gaji
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard title="Menunggu Persetujuan (Draft)" value={summary.total_draft} icon={DocumentCheckIcon} color="orange" />
                    <StatsCard title="Siap Bayar" value={summary.total_disetujui} icon={BanknotesIcon} color="blue" />
                    <StatsCard 
                        title="Total Dibayar Bulan Ini" 
                        value={`Rp ${summary.total_dibayar.toLocaleString('id-ID')}`} 
                        icon={CurrencyDollarIcon} 
                        color="green" 
                    />
                </div>

                <Card title="Daftar Slip Gaji">
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <select 
                            className="border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm"
                            value={filters.divisi || ''}
                            onChange={e => router.get(route('hr.penggajian.index'), { ...filters, divisi: e.target.value }, { preserveState: true })}
                        >
                            <option value="">Semua Divisi</option>
                            {Object.entries(divisiList).map(([k, v]) => (
                                <option key={k} value={k}>{v}</option>
                            ))}
                        </select>
                        
                        <select 
                            className="border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm"
                            value={filters.tipe_gaji || ''}
                            onChange={e => router.get(route('hr.penggajian.index'), { ...filters, tipe_gaji: e.target.value }, { preserveState: true })}
                        >
                            <option value="">Semua Tipe Gaji</option>
                            <option value="borongan">Borongan</option>
                            <option value="harian">Harian</option>
                            <option value="bulanan">Bulanan</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Karyawan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bersih</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {penggajians.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            Tidak ada data slip gaji.
                                        </td>
                                    </tr>
                                ) : (
                                    penggajians.data.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{item.karyawan?.name}</div>
                                                <div className="text-xs text-gray-500 capitalize">{item.karyawan?.divisi}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.periode_mulai} s/d {item.periode_selesai}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    item.tipe_gaji === 'borongan' ? 'bg-blue-100 text-blue-800' :
                                                    item.tipe_gaji === 'harian' ? 'bg-green-100 text-green-800' :
                                                    'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {item.tipe_gaji.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900">
                                                Rp {parseFloat(item.total_upah_bersih).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    item.status_bayar === 'dibayar' ? 'bg-green-100 text-green-800' :
                                                    item.status_bayar === 'disetujui' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {item.status_bayar.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                <a href={route('hr.penggajian.print', item.id)} target="_blank" className="text-gray-600 hover:text-gray-900">
                                                    Print
                                                </a>
                                                {item.status_bayar === 'draft' && (
                                                    <button onClick={() => handleApprove(item.id)} className="text-blue-600 hover:text-blue-900">
                                                        Approve
                                                    </button>
                                                )}
                                                {item.status_bayar === 'disetujui' && (
                                                    <button onClick={() => handleBayar(item.id)} className="text-green-600 hover:text-green-900">
                                                        Bayar
                                                    </button>
                                                )}
                                            </td>
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
