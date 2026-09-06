import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    DocumentChartBarIcon, 
    CurrencyDollarIcon, 
    UserGroupIcon 
} from '@heroicons/react/24/outline';

export default function Index({ auth }) {
    const reportTypes = [
        {
            title: 'Laporan Produksi',
            description: 'Laporan order selesai, rata-rata waktu pengerjaan.',
            href: route('laporan.produksi'),
            icon: DocumentChartBarIcon,
            color: 'bg-blue-500'
        },
        {
            title: 'Laporan Keuangan',
            description: 'Rekap omzet, total biaya, laba kotor, daftar piutang.',
            href: route('laporan.keuangan'),
            icon: CurrencyDollarIcon,
            color: 'bg-green-500'
        },
        {
            title: 'Laporan Performa Divisi',
            description: 'Jumlah order diproses, rata-rata waktu, keterlambatan per divisi.',
            href: route('laporan.divisi'),
            icon: UserGroupIcon,
            color: 'bg-purple-500'
        }
    ];

    return (
        <AppLayout title="Laporan & Analitik">
            <Head title="Laporan & Analitik" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {reportTypes.map((report, index) => (
                            <Link 
                                key={index} 
                                href={report.href}
                                className="bg-white overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition-shadow duration-300 group"
                            >
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className={`p-3 rounded-full ${report.color} text-white`}>
                                            <report.icon className="w-8 h-8" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                                                {report.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-gray-500">
                                        {report.description}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
