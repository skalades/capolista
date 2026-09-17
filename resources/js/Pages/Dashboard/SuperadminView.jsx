import React from 'react';
import StatsCard from '@/Components/StatsCard';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Badge from '@/Components/Badge';
import EmptyState from '@/Components/EmptyState';
import { UsersIcon, DocumentTextIcon, ExclamationCircleIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';

export default function SuperadminView({ stats, extraData, recentOrders }) {
    const totalDivisi = Object.keys(extraData.ringkasan_divisi || {}).length;

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(new Date(dateString));
    };

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard 
                    title="Order Aktif" 
                    value={stats.total_order_aktif || 0} 
                    status="accent"
                    action={<Link href={route('orders.index')} className="text-[11.5px] text-accent hover:underline">Lihat Order</Link>}
                />
                <StatsCard 
                    title="Total Piutang Berjalan" 
                    value={formatRupiah(extraData.total_piutang || 0)} 
                    status="danger"
                    action={<span className="text-[11.5px] text-danger">Butuh penagihan</span>}
                />
                <StatsCard 
                    title="User Aktif" 
                    value={extraData.active_users || 0} 
                    status="neutral" 
                    action={<Link href={route('users.index')} className="text-[11.5px] text-ink-soft hover:underline">Kelola User</Link>}
                />
                <StatsCard 
                    title="Jumlah Divisi" 
                    value={totalDivisi} 
                    status="neutral" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Panel Order Terbaru */}
                <Card title="Order Terbaru">
                    {(!recentOrders || recentOrders.length === 0) ? (
                        <EmptyState 
                            icon={DocumentTextIcon}
                            title="Belum ada order"
                            description="Belum ada pesanan yang masuk ke sistem."
                        />
                    ) : (
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>ID Order</Table.HeadCell>
                                <Table.HeadCell>Klien</Table.HeadCell>
                                <Table.HeadCell>Deadline</Table.HeadCell>
                                <Table.HeadCell>Status</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {recentOrders.map((order) => (
                                    <Table.Row key={order.id}>
                                        <Table.Cell className="font-mono text-[11.5px] text-ink">{order.nomor_order}</Table.Cell>
                                        <Table.Cell className="font-medium text-ink">{order.customer?.nama || '-'}</Table.Cell>
                                        <Table.Cell className="text-ink-soft">{formatDate(order.deadline)}</Table.Cell>
                                        <Table.Cell>
                                            <Badge status={['selesai', 'dikirim'].includes(order.status) ? 'accent' : 'gold'}>
                                                {order.status}
                                            </Badge>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    )}
                </Card>

                {/* Panel Piutang Lama */}
                <Card title="Piutang Terlama (Belum Lunas)">
                    {(!extraData.piutang_lama || extraData.piutang_lama.length === 0) ? (
                        <EmptyState 
                            icon={BanknotesIcon}
                            title="Tidak ada piutang"
                            description="Semua pembayaran klien saat ini berjalan lancar."
                        />
                    ) : (
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>ID Order</Table.HeadCell>
                                <Table.HeadCell>Klien</Table.HeadCell>
                                <Table.HeadCell>Sisa Bayar</Table.HeadCell>
                                <Table.HeadCell>Status</Table.HeadCell>
                                <Table.HeadCell></Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {extraData.piutang_lama.map((order) => (
                                    <Table.Row key={order.id}>
                                        <Table.Cell className="font-mono text-[11.5px] text-ink">{order.nomor_order}</Table.Cell>
                                        <Table.Cell className="font-medium text-ink">{order.customer?.nama || '-'}</Table.Cell>
                                        <Table.Cell className="font-mono text-[11.5px] text-danger font-medium">{formatRupiah(order.sisa_bayar)}</Table.Cell>
                                        <Table.Cell>
                                            <Badge status="danger">Belum Lunas</Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link href={route('orders.show', order.id)} className="text-accent hover:underline text-[11.5px]">Detail</Link>
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
