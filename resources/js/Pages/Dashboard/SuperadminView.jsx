import React from 'react';
import StatsCard from '@/Components/StatsCard';
import Card from '@/Components/Card';
import { UsersIcon, UserIcon, BriefcaseIcon, KeyIcon } from '@heroicons/react/24/outline';

export default function SuperadminView({ extraData }) {
    const totalDivisi = Object.keys(extraData.ringkasan_divisi || {}).length;

    return (
        <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatsCard title="Total User" value={extraData.total_users || 0} icon={UsersIcon} color="blue" />
                <StatsCard title="User Aktif" value={extraData.active_users || 0} icon={UserIcon} color="green" />
                <StatsCard title="Jumlah Divisi" value={totalDivisi} icon={BriefcaseIcon} color="brand" />
                <StatsCard title="Jumlah Role" value={extraData.total_roles || 0} icon={KeyIcon} color="purple" />
            </div>

            <Card title="User Terbaru">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Divisi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {extraData.recent_users?.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{user.divisi || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {(!extraData.recent_users || extraData.recent_users.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">Belum ada data user</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );
}
