import React from 'react';
import StatsCard from '@/Components/StatsCard';
import Card from '@/Components/Card';
import { BriefcaseIcon, ClockIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

export default function KepalaView({ extraData }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <StatsCard title="Tugas Aktif Divisi" value={extraData.tugas_aktif_count || 0} icon={BriefcaseIcon} color="blue" />
                <StatsCard title="Bottleneck Divisi (>3 Hari)" value={extraData.bottleneck_count || 0} icon={ClockIcon} color="orange" />
                <StatsCard title="Selesai Minggu Ini" value={extraData.selesai_minggu_ini || 0} icon={CheckBadgeIcon} color="green" />
            </div>

            <Card title="Daftar Tugas Divisi">
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Order</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {extraData.tugas_divisi?.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.no_order}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer?.nama || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.jenis_produk}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                        {formatDate(order.deadline)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {(!extraData.tugas_divisi || extraData.tugas_divisi.length === 0) && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">Belum ada tugas aktif untuk divisi ini</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );
}
