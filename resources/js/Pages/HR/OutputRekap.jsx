import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import StatsCard from '@/Components/StatsCard';
import Pagination from '@/Components/Pagination';
import { CheckCircleIcon, ClockIcon, CurrencyDollarIcon, CubeIcon } from '@heroicons/react/24/outline';

export default function OutputRekap({ outputs, stats, filters }) {
    const handleFilterChange = (key, value) => {
        router.get(route('hr.output.rekap'), { ...filters, [key]: value }, { preserveState: true });
    };

    return (
        <AppLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Rekap Output Borongan</h2>}>
            <Head title="Rekap Output Borongan" />

            <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                <Card>
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                            <input
                                type="date"
                                className="border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm text-sm"
                                value={filters.tanggal}
                                onChange={(e) => handleFilterChange('tanggal', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Divisi</label>
                            <select
                                className="border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm text-sm"
                                value={filters.divisi}
                                onChange={(e) => handleFilterChange('divisi', e.target.value)}
                            >
                                <option value="jahit">Jahit</option>
                                <option value="cutting">Cutting</option>
                            </select>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard title="Menunggu Approval" value={stats.menunggu} icon={ClockIcon} color="yellow" />
                    <StatsCard title="Disetujui" value={stats.approved} icon={CheckCircleIcon} color="blue" />
                    <StatsCard title="Total Pcs Disetujui" value={`${stats.total_pcs} pcs`} icon={CubeIcon} color="indigo" />
                    <StatsCard
                        title="Total Upah Borongan"
                        value={`Rp ${Number(stats.total_upah || 0).toLocaleString('id-ID')}`}
                        icon={CurrencyDollarIcon}
                        color="green"
                    />
                </div>

                <Card title="Daftar Output Operator">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Operator</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Order / Customer</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase text-xs">Klaim Pcs</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase text-xs">Approved Pcs</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase text-xs">Upah Kotor</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase text-xs">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {outputs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                                            Tidak ada catatan output pada tanggal ini.
                                        </td>
                                    </tr>
                                ) : (
                                    outputs.data.map((row) => (
                                        <tr key={row.id}>
                                            <td className="px-4 py-3 font-medium text-gray-900">{row.operator?.name}</td>
                                            <td className="px-4 py-3 text-gray-600">
                                                <div>#{row.order?.no_order}</div>
                                                <div className="text-xs text-gray-400">{row.order?.customer?.nama}</div>
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-700">{row.pcs_klaim}</td>
                                            <td className="px-4 py-3 text-center font-semibold text-gray-900">{row.pcs_approved ?? '-'}</td>
                                            <td className="px-4 py-3 text-right font-medium text-brand-600">
                                                Rp {Number(row.upah_kotor || 0).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                    row.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                                    row.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                                                    'bg-amber-100 text-amber-800'
                                                }`}>
                                                    {row.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {outputs.links && (
                        <div className="mt-4">
                            <Pagination links={outputs.links} />
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
