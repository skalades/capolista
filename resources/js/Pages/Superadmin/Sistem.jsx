import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Sistem({ auth, phpVersion, laravelVersion, diskUsage, recordCounts }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Informasi Sistem</h2>}
        >
            <Head title="Informasi Sistem" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Server</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="border rounded-lg p-4">
                                <div className="text-sm text-gray-500">Versi PHP</div>
                                <div className="text-2xl font-semibold mt-1">{phpVersion}</div>
                            </div>
                            <div className="border rounded-lg p-4">
                                <div className="text-sm text-gray-500">Versi Laravel</div>
                                <div className="text-2xl font-semibold mt-1">{laravelVersion}</div>
                            </div>
                            <div className="border rounded-lg p-4">
                                <div className="text-sm text-gray-500">Disk Usage</div>
                                <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div 
                                            className={`h-4 rounded-full ${diskUsage > 80 ? 'bg-red-600' : (diskUsage > 60 ? 'bg-yellow-400' : 'bg-blue-600')}`} 
                                            style={{ width: `${diskUsage}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-right text-xs mt-1">{diskUsage}% Used</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Statistik Database</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Tabel</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Record</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recordCounts.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {item.table}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                {item.count}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
