import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import StatsCard from '@/Components/StatsCard';
import Alert from '@/Components/Alert';

export default function Index({ auth, stats }) {
    return (
        <AppLayout 
            title="Dashboard Procurement"
            headerActions={
                <div className="flex gap-2">
                    <Link 
                        href={route('procurement.supplier.index')} 
                        className="inline-flex items-center justify-center rounded bg-navy px-3 py-1.5 text-[12.5px] font-medium font-sans text-white shadow-sm transition-colors hover:bg-navy/90"
                    >
                        Kelola Supplier
                    </Link>
                    <Link 
                        href={route('procurement.po.index')} 
                        className="inline-flex items-center justify-center rounded bg-panel border border-line px-3 py-1.5 text-[12.5px] font-medium font-sans text-ink shadow-sm transition-colors hover:bg-line/20"
                    >
                        Purchase Order
                    </Link>
                </div>
            }
        >
            <div className="max-w-7xl mx-auto space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatsCard 
                        title="Purchase Order Aktif"
                        value={stats.aktifPoCount}
                        status="accent"
                    />
                    <StatsCard 
                        title="Total Supplier"
                        value={stats.supplierCount}
                        status="neutral"
                    />
                </div>

                {stats.kebutuhanBahan && stats.kebutuhanBahan.length > 0 && (
                    <Alert type="warning" title={`⚠️ Ada ${stats.kebutuhanBahan.length} bahan yang stoknya menipis. Segera buat PO.`} />
                )}
            </div>
        </AppLayout>
    );
}
