import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import StatsCard from '@/Components/StatsCard';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Keuangan({ auth, filters, rekap, piutang }) {
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('laporan.keuangan'), {
            start_date: startDate,
            end_date: endDate
        }, { preserveState: true });
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    };

    return (
        <AppLayout 
            title={
                <div className="flex flex-col justify-center mt-1">
                    <div className="flex items-center gap-3 leading-none">
                        <span>Laporan Keuangan</span>
                    </div>
                </div>
            }
        >
            <Head title="Laporan Keuangan" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Filters */}
                <Card className="!p-4">
                    <form onSubmit={handleFilter} className="flex gap-4 items-end">
                        <div>
                            <label className="block text-[11.5px] font-medium text-ink-soft uppercase tracking-wider mb-1">Tanggal Mulai</label>
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="mt-1 block w-full border-line bg-panel text-ink rounded-md focus:border-navy focus:ring-navy text-[13px]"
                            />
                        </div>
                        <div>
                            <label className="block text-[11.5px] font-medium text-ink-soft uppercase tracking-wider mb-1">Tanggal Akhir</label>
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="mt-1 block w-full border-line bg-panel text-ink rounded-md focus:border-navy focus:ring-navy text-[13px]"
                            />
                        </div>
                        <PrimaryButton type="submit">
                            Filter
                        </PrimaryButton>
                    </form>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard 
                        title="Omzet (Pendapatan)"
                        value={formatRupiah(rekap.omzet)}
                        status="accent"
                    />
                    <StatsCard 
                        title="Total Biaya (Pengeluaran)"
                        value={formatRupiah(rekap.total_biaya)}
                        status="danger"
                    />
                    <StatsCard 
                        title="Laba Kotor"
                        value={formatRupiah(rekap.laba_kotor)}
                        status="gold"
                    />
                </div>

                {/* Daftar Piutang */}
                <Card className="!p-0 overflow-hidden">
                    <div className="px-6 py-4 border-b border-line bg-panel">
                        <h3 className="text-[18px] font-oswald font-bold text-ink">Daftar Piutang (Belum Lunas)</h3>
                    </div>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Customer</Table.HeadCell>
                            <Table.HeadCell>Order ID</Table.HeadCell>
                            <Table.HeadCell>Total Tagihan</Table.HeadCell>
                            <Table.HeadCell>Sudah Dibayar</Table.HeadCell>
                            <Table.HeadCell>Sisa Tagihan</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {piutang && piutang.length > 0 ? (
                                piutang.map((p, i) => (
                                    <Table.Row key={i}>
                                        <Table.Cell className="font-bold text-ink">{p.customer?.nama || '-'}</Table.Cell>
                                        <Table.Cell className="font-mono text-[12px]">{p.no_order}</Table.Cell>
                                        <Table.Cell>{formatRupiah(p.total_harga)}</Table.Cell>
                                        <Table.Cell>{formatRupiah(p.dp)}</Table.Cell>
                                        <Table.Cell className="font-bold text-danger">{formatRupiah(p.sisa_bayar)}</Table.Cell>
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.Cell colSpan="5" className="text-center text-ink-soft py-6">
                                        Tidak ada piutang untuk periode ini
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </Card>
            </div>
        </AppLayout>
    );
}
