import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Card from '@/Components/Card';
import { ShoppingCart, Users, AlertCircle } from 'lucide-react';
import Alert from '@/Components/Alert';

export default function Index({ auth, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Procurement</h2>}
        >
            <Head title="Procurement Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card title={
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-gray-500" />
                                <span>Purchase Order Aktif</span>
                            </div>
                        }>
                            <div className="text-2xl font-bold">{stats.aktifPoCount}</div>
                            <p className="text-sm text-gray-500 mt-1">PO dengan status Draft atau Dikirim</p>
                        </Card>
                        
                        <Card title={
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-gray-500" />
                                <span>Total Supplier</span>
                            </div>
                        }>
                            <div className="text-2xl font-bold">{stats.supplierCount}</div>
                            <p className="text-sm text-gray-500 mt-1">Supplier terdaftar</p>
                        </Card>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <Link href={route('procurement.supplier.index')} className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm font-medium">Kelola Supplier</Link>
                        <Link href={route('procurement.po.index')} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors shadow-sm font-medium">Daftar Purchase Order</Link>
                    </div>

                    {stats.kebutuhanBahan && stats.kebutuhanBahan.length > 0 && (
                        <Alert type="warning" message={`Ada ${stats.kebutuhanBahan.length} bahan yang stoknya menipis. Segera buat PO.`} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
