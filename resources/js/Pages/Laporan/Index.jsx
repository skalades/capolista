import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    DocumentChartBarIcon, 
    CurrencyDollarIcon, 
    UserGroupIcon 
} from '@heroicons/react/24/outline';
import Card from '@/Components/Card';

export default function Index({ auth }) {
    const reportTypes = [
        {
            title: 'Laporan Produksi',
            description: 'Laporan order selesai, rata-rata waktu pengerjaan.',
            href: route('laporan.produksi'),
            icon: DocumentChartBarIcon,
            colorClass: 'text-navy bg-navy/10'
        },
        {
            title: 'Laporan Keuangan',
            description: 'Rekap omzet, total biaya, laba kotor, daftar piutang.',
            href: route('laporan.keuangan'),
            icon: CurrencyDollarIcon,
            colorClass: 'text-accent bg-accent/10'
        },
        {
            title: 'Laporan Performa Divisi',
            description: 'Jumlah order diproses, rata-rata waktu, keterlambatan per divisi.',
            href: route('laporan.divisi'),
            icon: UserGroupIcon,
            colorClass: 'text-gold bg-gold/10'
        }
    ];

    return (
        <AppLayout title="Laporan & Analitik">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reportTypes.map((report, index) => (
                        <Link 
                            key={index} 
                            href={report.href}
                            className="block group"
                        >
                            <Card className="h-full border border-line hover:border-navy hover:shadow-md transition-all duration-300">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`p-3 rounded-xl ${report.colorClass}`}>
                                            <report.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-[18px] font-oswald font-bold text-ink group-hover:text-navy transition-colors leading-tight">
                                            {report.title}
                                        </h3>
                                    </div>
                                    <p className="text-[13px] text-ink-soft leading-relaxed mt-auto">
                                        {report.description}
                                    </p>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
