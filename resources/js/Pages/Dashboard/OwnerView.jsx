import React from 'react';
import StatsCard from '@/Components/StatsCard';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Badge from '@/Components/Badge';
import EmptyState from '@/Components/EmptyState';
import { CalendarIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';

export default function OwnerView({ extraData, recentOrders, upcomingDeadlines }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard 
                    title="Omzet Bulan Ini" 
                    value={formatCurrency(extraData.omzet_bulan_ini)} 
                    status="accent" 
                />
                <StatsCard 
                    title="Total Piutang" 
                    value={formatCurrency(extraData.total_piutang)} 
                    status="danger" 
                    actionLink={route('keuangan.index')}
                    actionLabel="Lihat Detail Piutang"
                />
                <StatsCard 
                    title="Order Selesai" 
                    value={extraData.order_selesai || 0} 
                    status="neutral" 
                />
                <StatsCard 
                    title="Order Terlambat" 
                    value={extraData.order_terlambat || 0} 
                    status="danger" 
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card title="Upcoming Deadlines">
                    {(!upcomingDeadlines || upcomingDeadlines.length === 0) ? (
                        <EmptyState 
                            icon={CalendarIcon}
                            title="Aman!"
                            description="Tidak ada deadline dalam waktu dekat."
                        />
                    ) : (
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>Order ID</Table.HeadCell>
                                <Table.HeadCell>Customer</Table.HeadCell>
                                <Table.HeadCell>Deadline</Table.HeadCell>
                                <Table.HeadCell>Status</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {upcomingDeadlines.map((order) => (
                                    <Table.Row key={order.id}>
                                        <Table.Cell className="font-mono text-ink-soft">{order.no_order}</Table.Cell>
                                        <Table.Cell className="font-medium text-ink">{order.customer?.nama || 'Unknown'}</Table.Cell>
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

                <Card title="Recent Orders" actions={<Link href={route('orders.index')} className="text-[11px] font-medium text-navy hover:text-accent">Semua Order &rarr;</Link>}>
                    {(!recentOrders || recentOrders.length === 0) ? (
                        <EmptyState 
                            icon={ClipboardDocumentListIcon}
                            title="Belum ada order"
                            description="Belum ada order masuk."
                        />
                    ) : (
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>Order ID</Table.HeadCell>
                                <Table.HeadCell>Produk</Table.HeadCell>
                                <Table.HeadCell>Nilai</Table.HeadCell>
                                <Table.HeadCell>Status</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {recentOrders.map((order) => (
                                    <Table.Row key={order.id}>
                                        <Table.Cell className="font-mono text-ink-soft">{order.no_order}</Table.Cell>
                                        <Table.Cell className="font-medium text-ink">{order.jenis_produk}</Table.Cell>
                                        <Table.Cell>{formatCurrency(order.total_harga)}</Table.Cell>
                                        <Table.Cell>
                                            <Badge status={order.status === 'selesai' ? 'accent' : 'neutral'}>
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
        </div>
    );
}
