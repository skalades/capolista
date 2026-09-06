import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import StatsCard from '@/Components/StatsCard';

export default function Laporan({ startDate, endDate, pendapatan, biaya, laba, piutangCustomer }) {
    const fmtRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);

    return (
        <AppLayout title="Laporan Laba Rugi">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-[24px] font-oswald font-bold text-ink">Laporan Laba Rugi</h2>
                        <p className="text-[13px] text-ink-soft">Periode: {startDate} s/d {endDate}</p>
                    </div>
                    <form className="flex gap-2 items-center" method="GET" action={route('keuangan.laporan')}>
                        <TextInput type="date" name="start_date" defaultValue={startDate} className="w-auto text-[13px]" />
                        <TextInput type="date" name="end_date" defaultValue={endDate} className="w-auto text-[13px]" />
                        <PrimaryButton type="submit">Filter</PrimaryButton>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatsCard 
                        title="Total Pendapatan (Masuk)" 
                        value={fmtRupiah(pendapatan)} 
                        status="accent"
                    />
                    <StatsCard 
                        title="Total Biaya (Keluar)" 
                        value={fmtRupiah(biaya)} 
                        status="danger"
                    />
                    <StatsCard 
                        title="Laba / Rugi" 
                        value={fmtRupiah(laba)} 
                        status={laba >= 0 ? "accent" : "danger"}
                    />
                </div>

                <Card className="!p-0 overflow-hidden">
                    <div className="p-5 border-b border-line">
                        <h3 className="text-[18px] font-oswald font-bold text-ink">Rekap Piutang Customer</h3>
                        <p className="text-[11px] text-ink-soft">Daftar customer yang belum lunas</p>
                    </div>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Nama Customer</Table.HeadCell>
                            <Table.HeadCell className="text-right">Total Piutang</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {piutangCustomer.map((p, i) => (
                                <Table.Row key={i}>
                                    <Table.Cell className="font-bold text-[13px] text-ink">{p.customer}</Table.Cell>
                                    <Table.Cell className="text-right text-danger font-mono font-bold text-[14px]">{fmtRupiah(p.total_piutang)}</Table.Cell>
                                </Table.Row>
                            ))}
                            {piutangCustomer.length === 0 && (
                                <Table.Row>
                                    <Table.Cell colSpan={2} className="py-6 text-center text-[12px] text-ink-soft">
                                        Tidak ada piutang saat ini.
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
