import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Table from '@/Components/Table';

export default function PoIndex({ auth, purchaseOrders, filters }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleFilterChange = (e) => {
        const val = e.target.value;
        const newStatus = val === 'all' ? '' : val;
        setStatusFilter(newStatus);
        
        router.get(route('procurement.po.index'), 
            { status: newStatus },
            { preserveState: true }
        );
    };

    return (
        <AppLayout
            title="Daftar Purchase Order"
        >
            

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Filter Status:</span>
                            <select 
                                value={statusFilter || 'all'} 
                                onChange={handleFilterChange}
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            >
                                <option value="all">Semua Status</option>
                                <option value="draft">Draft</option>
                                <option value="dikirim">Dikirim</option>
                                <option value="diterima">Diterima</option>
                                <option value="dibatalkan">Dibatalkan</option>
                            </select>
                        </div>
                        <PrimaryButton asChild>
                            <Link href={route('procurement.po.create')}>Buat PO Baru</Link>
                        </PrimaryButton>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <Table>
                            <Table.Head>
                                <Table.Row>
                                    <Table.HeadCell>No. PO</Table.HeadCell>
                                    <Table.HeadCell>Tanggal</Table.HeadCell>
                                    <Table.HeadCell>Supplier</Table.HeadCell>
                                    <Table.HeadCell>Total Harga</Table.HeadCell>
                                    <Table.HeadCell>Status</Table.HeadCell>
                                    <Table.HeadCell>Aksi</Table.HeadCell>
                                </Table.Row>
                            </Table.Head>
                            <Table.Body>
                                {purchaseOrders.data.map((po) => (
                                    <Table.Row key={po.id}>
                                        <Table.Cell className="font-medium">{po.no_po}</Table.Cell>
                                        <Table.Cell>{po.tanggal_po}</Table.Cell>
                                        <Table.Cell>{po.supplier?.nama}</Table.Cell>
                                        <Table.Cell>Rp {Number(po.total_harga).toLocaleString()}</Table.Cell>
                                        <Table.Cell>
                                            <span className={`px-2 py-1 rounded text-xs text-white ${po.status === 'draft' ? 'bg-gray-500' : po.status === 'dikirim' ? 'bg-blue-500' : po.status === 'diterima' ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {po.status.toUpperCase()}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <SecondaryButton size="sm" asChild>
                                                <Link href={route('procurement.po.show', po.id)}>Detail</Link>
                                            </SecondaryButton>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                                {purchaseOrders.data.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell colSpan={6} className="text-center py-4">Belum ada Purchase Order</Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
