import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import StatsCard from '@/Components/StatsCard';
import Table from '@/Components/Table';
import Badge from '@/Components/Badge';
import EmptyState from '@/Components/EmptyState';
import { CurrencyDollarIcon, BanknotesIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import HRTabs from './HRTabs';

export default function Index({ penggajians, summary, divisiList, filters }) {
    
    const handleApprove = (id) => {
        if (confirm('Setujui slip gaji ini?')) {
            router.post(route('hr.penggajian.approve', id));
        }
    };

    const handleBayar = (id) => {
        if (confirm('Tandai slip gaji ini sudah ditransfer/dibayar?')) {
            router.post(route('hr.penggajian.bayar', id));
        }
    };

    return (
        <AppLayout title="Manajemen Penggajian & HR">
            <div className="flex justify-between items-end mb-6">
                <div>
                    {/* Tab Navigation */}
                    <HRTabs />
                </div>
                <Link
                    href={route('hr.penggajian.create')}
                    className="inline-flex items-center rounded bg-navy px-4 py-2 text-[13px] font-medium font-sans text-white shadow-sm transition-colors hover:bg-navy/90 mb-[3px]"
                >
                    + Generate Slip Gaji
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatsCard title="Menunggu Persetujuan (Draft)" value={summary.total_draft} status="gold" />
                <StatsCard title="Siap Bayar" value={summary.total_disetujui} status="accent" />
                <StatsCard 
                    title="Total Dibayar Bulan Ini" 
                    value={`Rp ${summary.total_dibayar.toLocaleString('id-ID')}`} 
                    status="accent" 
                />
            </div>

            <Card title="Daftar Slip Gaji">
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <select 
                        className="rounded-md border-line py-1.5 text-ink text-[13px] focus:ring-2 focus:ring-navy focus:border-navy"
                        value={filters.divisi || ''}
                        onChange={e => router.get(route('hr.penggajian.index'), { ...filters, divisi: e.target.value }, { preserveState: true })}
                    >
                        <option value="">Semua Divisi</option>
                        {Object.entries(divisiList).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                        ))}
                    </select>
                    
                    <select 
                        className="rounded-md border-line py-1.5 text-ink text-[13px] focus:ring-2 focus:ring-navy focus:border-navy"
                        value={filters.tipe_gaji || ''}
                        onChange={e => router.get(route('hr.penggajian.index'), { ...filters, tipe_gaji: e.target.value }, { preserveState: true })}
                    >
                        <option value="">Semua Tipe Gaji</option>
                        <option value="borongan">Borongan</option>
                        <option value="harian">Harian</option>
                        <option value="bulanan">Bulanan</option>
                    </select>
                </div>

                {!penggajians.data || penggajians.data.length === 0 ? (
                    <EmptyState 
                        title="Tidak ada slip gaji" 
                        description="Belum ada data penggajian untuk periode ini." 
                        icon={DocumentCheckIcon}
                    />
                ) : (
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Karyawan</Table.HeadCell>
                            <Table.HeadCell>Periode</Table.HeadCell>
                            <Table.HeadCell>Tipe</Table.HeadCell>
                            <Table.HeadCell className="text-right">Total Bersih</Table.HeadCell>
                            <Table.HeadCell className="text-center">Status</Table.HeadCell>
                            <Table.HeadCell className="text-right">Aksi</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {penggajians.data.map((item) => (
                                <Table.Row key={item.id}>
                                    <Table.Cell>
                                        <div className="font-medium text-ink">{item.karyawan?.name}</div>
                                        <div className="text-[11.5px] text-ink-soft capitalize mt-0.5">{item.karyawan?.divisi}</div>
                                    </Table.Cell>
                                    <Table.Cell className="text-ink-soft">
                                        {item.periode_mulai} <br/> s/d {item.periode_selesai}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge status={
                                            item.tipe_gaji === 'borongan' ? 'accent' :
                                            item.tipe_gaji === 'harian' ? 'gold' : 'neutral'
                                        }>
                                            {item.tipe_gaji.toUpperCase()}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="text-right font-medium text-ink">
                                        Rp {parseFloat(item.total_upah_bersih).toLocaleString('id-ID')}
                                    </Table.Cell>
                                    <Table.Cell className="text-center">
                                        <Badge status={
                                            item.status_bayar === 'dibayar' ? 'accent' :
                                            item.status_bayar === 'disetujui' ? 'gold' : 'neutral'
                                        }>
                                            {item.status_bayar.toUpperCase()}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="text-right space-x-3">
                                        <a href={route('hr.penggajian.print', item.id)} target="_blank" className="text-[12px] font-medium text-navy hover:text-navy/70">
                                            Print
                                        </a>
                                        {item.status_bayar === 'draft' && (
                                            <button onClick={() => handleApprove(item.id)} className="text-[12px] font-medium text-accent hover:text-accent/70">
                                                Approve
                                            </button>
                                        )}
                                        {item.status_bayar === 'disetujui' && (
                                            <button onClick={() => handleBayar(item.id)} className="text-[12px] font-medium text-accent hover:text-accent/70">
                                                Bayar
                                            </button>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                )}
            </Card>
        </AppLayout>
    );
}
