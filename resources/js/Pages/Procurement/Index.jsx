import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import StatsCard from '@/Components/StatsCard';
import Alert from '@/Components/Alert';

export default function Index({ auth, stats }) {
    return (
        <AppLayout title="Dashboard Procurement">
            <div className="max-w-7xl mx-auto space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-6">
                    <div>
                        <h2 className="text-[24px] font-oswald font-bold text-ink">Dashboard Procurement</h2>
                        <div className="flex gap-2 mt-4">
                            <Link 
                                href={route('procurement.supplier.index')} 
                                className="inline-flex items-center justify-center rounded bg-navy px-4 py-2 text-[13px] font-medium font-sans text-white shadow-sm transition-colors hover:bg-navy/90"
                            >
                                Kelola Supplier
                            </Link>
                            <Link 
                                href={route('procurement.po.index')} 
                                className="inline-flex items-center justify-center rounded bg-panel border border-line px-4 py-2 text-[13px] font-medium font-sans text-ink shadow-sm transition-colors hover:bg-line/20"
                            >
                                Daftar Purchase Order
                            </Link>
                        </div>
                    </div>
                </div>

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
