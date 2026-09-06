import React from 'react';
import StatsCard from '@/Components/StatsCard';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Badge from '@/Components/Badge';
import EmptyState from '@/Components/EmptyState';
import { BriefcaseIcon } from '@heroicons/react/24/outline';

export default function KepalaView({ extraData }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatsCard title="Tugas Aktif Divisi" value={extraData.tugas_aktif_count || 0} status="accent" />
                <StatsCard title="Bottleneck Divisi (>3 Hari)" value={extraData.bottleneck_count || 0} status="danger" />
                <StatsCard title="Selesai Minggu Ini" value={extraData.selesai_minggu_ini || 0} status="neutral" />
            </div>

            <Card title="Daftar Tugas Divisi">
                {(!extraData.tugas_divisi || extraData.tugas_divisi.length === 0) ? (
                    <EmptyState 
                        icon={BriefcaseIcon}
                        title="Divisi Kosong"
                        description="Belum ada tugas aktif untuk divisi ini."
                    />
                ) : (
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>No Order</Table.HeadCell>
                            <Table.HeadCell>Customer</Table.HeadCell>
                            <Table.HeadCell>Produk</Table.HeadCell>
                            <Table.HeadCell>Deadline</Table.HeadCell>
                            <Table.HeadCell>Status</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {extraData.tugas_divisi.map((order) => (
                                <Table.Row key={order.id}>
                                    <Table.Cell className="font-mono text-ink-soft">{order.no_order}</Table.Cell>
                                    <Table.Cell className="font-medium text-ink">{order.customer?.nama || '-'}</Table.Cell>
                                    <Table.Cell>{order.jenis_produk}</Table.Cell>
                                    <Table.Cell className="text-danger font-semibold">{formatDate(order.deadline)}</Table.Cell>
                                    <Table.Cell>
                                        <Badge status="gold">
                                            {order.status}
                                        </Badge>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                )}
            </Card>
        </div>
    );
}
