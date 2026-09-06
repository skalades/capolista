import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Table from '@/Components/Table';
import EmptyState from '@/Components/EmptyState';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Badge from '@/Components/Badge';
import Card from '@/Components/Card';

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

    const STATUS_SEMANTICS = {
        draft: 'neutral',
        dikirim: 'accent',
        diterima: 'accent',
        dibatalkan: 'danger'
    };

    return (
        <AppLayout title="Daftar Purchase Order">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-6">
                    <div>
                        <h2 className="text-[24px] font-oswald font-bold text-ink">Daftar Purchase Order</h2>
                        <div className="flex items-center gap-2 mt-4">
                            <span className="text-[12px] font-medium text-ink-soft">Filter Status:</span>
                            <select 
                                value={statusFilter || 'all'} 
                                onChange={handleFilterChange}
                                className="rounded-md border-line py-1.5 text-ink text-[13px] focus:ring-2 focus:ring-navy focus:border-navy"
                            >
                                <option value="all">Semua Status</option>
                                <option value="draft">Draft</option>
                                <option value="dikirim">Dikirim</option>
                                <option value="diterima">Diterima</option>
                                <option value="dibatalkan">Dibatalkan</option>
                            </select>
                        </div>
                    </div>
                    <Link 
                        href={route('procurement.po.create')} 
                        className="inline-flex items-center justify-center rounded bg-navy px-4 py-2 text-[13px] font-medium font-sans text-white shadow-sm transition-colors hover:bg-navy/90 mb-[3px]"
                    >
                        + Buat PO Baru
                    </Link>
                </div>

                <Card>
                    {(!purchaseOrders.data || purchaseOrders.data.length === 0) ? (
                        <EmptyState 
                            title="Tidak ada PO"
                            description="Belum ada data Purchase Order dengan status tersebut."
                            icon={DocumentTextIcon}
                        />
                    ) : (
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>No. PO</Table.HeadCell>
                                <Table.HeadCell>Tanggal</Table.HeadCell>
                                <Table.HeadCell>Supplier</Table.HeadCell>
                                <Table.HeadCell className="text-right">Total Harga</Table.HeadCell>
                                <Table.HeadCell className="text-center">Status</Table.HeadCell>
                                <Table.HeadCell className="text-right">Aksi</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {purchaseOrders.data.map((po) => (
                                    <Table.Row key={po.id}>
                                        <Table.Cell className="font-mono text-ink font-medium">{po.no_po}</Table.Cell>
                                        <Table.Cell className="text-ink-soft">{po.tanggal_po}</Table.Cell>
                                        <Table.Cell className="font-medium text-ink">{po.supplier?.nama}</Table.Cell>
                                        <Table.Cell className="text-right font-medium text-ink">Rp {Number(po.total_harga).toLocaleString('id-ID')}</Table.Cell>
                                        <Table.Cell className="text-center">
                                            <Badge status={STATUS_SEMANTICS[po.status] || 'neutral'}>
                                                {po.status.toUpperCase()}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell className="text-right">
                                            <Link href={route('procurement.po.show', po.id)} className="text-[12px] font-medium text-navy hover:text-navy/70">Detail</Link>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
