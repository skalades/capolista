import React from 'react';
import StatsCard from '@/Components/StatsCard';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Badge from '@/Components/Badge';
import EmptyState from '@/Components/EmptyState';
import { UsersIcon } from '@heroicons/react/24/outline';

export default function SuperadminView({ extraData }) {
    const totalDivisi = Object.keys(extraData.ringkasan_divisi || {}).length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total User" value={extraData.total_users || 0} status="neutral" />
                <StatsCard title="User Aktif" value={extraData.active_users || 0} status="accent" />
                <StatsCard title="Jumlah Divisi" value={totalDivisi} status="gold" />
                <StatsCard title="Jumlah Role" value={extraData.total_roles || 0} status="neutral" />
            </div>

            <Card title="User Terbaru">
                {(!extraData.recent_users || extraData.recent_users.length === 0) ? (
                    <EmptyState 
                        icon={UsersIcon}
                        title="Belum ada user"
                        description="Sistem belum memiliki pengguna yang terdaftar."
                    />
                ) : (
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Nama</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Divisi</Table.HeadCell>
                            <Table.HeadCell>Status</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {extraData.recent_users.map((user) => (
                                <Table.Row key={user.id}>
                                    <Table.Cell className="font-medium text-ink">{user.name}</Table.Cell>
                                    <Table.Cell className="text-ink-soft">{user.email}</Table.Cell>
                                    <Table.Cell className="capitalize">{user.divisi || '-'}</Table.Cell>
                                    <Table.Cell>
                                        <Badge status={user.is_active ? 'accent' : 'danger'}>
                                            {user.is_active ? 'Aktif' : 'Nonaktif'}
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
