import React from 'react';
import StatsCard from '@/Components/StatsCard';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Badge from '@/Components/Badge';
import EmptyState from '@/Components/EmptyState';
import { DocumentTextIcon, ExclamationCircleIcon, BanknotesIcon, TruckIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';
import Chart from 'react-apexcharts';

export default function SuperadminView({ stats, extraData, recentOrders, lowStockCount, upcomingDeadlines }) {
    
    const formatShort = (num) => {
        if (!num) return '0';
        if (num >= 1000000) {
            return (num / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + 'jt';
        }
        if (num >= 1000) {
            return (num / 1000).toLocaleString('id-ID', { maximumFractionDigits: 0 }) + 'rb';
        }
        return num.toLocaleString('id-ID');
    };

    const fmtRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka || 0);
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
        <div className="space-y-8">
            
            {/* 1. Modul Ringkasan Utama (Top Level KPIs) */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-4 bg-navy rounded-full"></div>
                    <h2 className="text-[16px] font-oswald font-bold text-ink uppercase tracking-wide">Ringkasan Utama</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard 
                        title="Order Aktif" 
                        value={stats.total_order_aktif || 0} 
                        status="accent"
                        caption="Dalam proses produksi"
                    />
                    <StatsCard 
                        title="Order Selesai" 
                        value={extraData.order_selesai_bulan_ini || 0} 
                        status="neutral"
                        caption="Bulan ini"
                    />
                    <StatsCard 
                        title="Total Pendapatan" 
                        value={"Rp " + formatShort(extraData.pendapatan_bulan_ini || 0)} 
                        status="neutral" 
                        caption="Bulan ini (Kasar)"
                    />
                    <StatsCard 
                        title="Kehadiran Karyawan" 
                        value={`${extraData.karyawan_hadir || 0}/${extraData.total_karyawan || 0}`} 
                        status={extraData.karyawan_hadir === extraData.total_karyawan ? 'accent' : 'gold'} 
                        caption="Hadir hari ini"
                    />
                </div>
            </section>

            {/* 2. Modul Pemantauan Jalur Produksi & 3. Actionable Alerts */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Pipeline */}
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-4 bg-navy rounded-full"></div>
                        <h2 className="text-[16px] font-oswald font-bold text-ink uppercase tracking-wide">Jalur Produksi (Pipeline)</h2>
                    </div>
                    <Card className="!p-6 flex flex-col justify-center h-[calc(100%-2rem)]">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-center w-full">
                                <div className="text-[28px] font-oswald font-bold text-ink">{extraData.funnel?.draft || 0}</div>
                                <div className="text-[11px] text-ink-soft mt-1">DRAFT / MENUNGGU</div>
                            </div>
                            <div className="hidden sm:block text-line">→</div>
                            <div className="text-center w-full">
                                <div className="text-[28px] font-oswald font-bold text-gold">{extraData.funnel?.printing || 0}</div>
                                <div className="text-[11px] text-ink-soft mt-1">PRINTING / SABLON</div>
                            </div>
                            <div className="hidden sm:block text-line">→</div>
                            <div className="text-center w-full">
                                <div className="text-[28px] font-oswald font-bold text-gold">{extraData.funnel?.cutting_jahit || 0}</div>
                                <div className="text-[11px] text-ink-soft mt-1">CUTTING & JAHIT</div>
                            </div>
                            <div className="hidden sm:block text-line">→</div>
                            <div className="text-center w-full">
                                <div className="text-[28px] font-oswald font-bold text-accent">{extraData.funnel?.qc_packing || 0}</div>
                                <div className="text-[11px] text-ink-soft mt-1">QC & PACKING</div>
                            </div>
                            <div className="hidden sm:block text-line">→</div>
                            <div className="text-center w-full">
                                <div className="text-[28px] font-oswald font-bold text-accent">{extraData.funnel?.dikirim || 0}</div>
                                <div className="text-[11px] text-ink-soft mt-1">SIAP DIKIRIM</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Alerts */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-4 bg-danger rounded-full"></div>
                        <h2 className="text-[16px] font-oswald font-bold text-danger uppercase tracking-wide">Tindakan Cepat</h2>
                    </div>
                    <Card className="!p-0 h-[calc(100%-2rem)]">
                        <div className="divide-y divide-line">
                            <Link href={route('orders.index')} className="p-4 flex items-center justify-between hover:bg-line/20 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                                        <ExclamationCircleIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[13px] text-ink group-hover:text-gold transition-colors">Menunggu Approval</p>
                                        <p className="text-[11px] text-ink-soft">Desain & Kasbon</p>
                                    </div>
                                </div>
                                <div className="font-oswald text-[18px] font-bold text-ink">{extraData.menunggu_approval || 0}</div>
                            </Link>

                            <Link href={route('procurement.index')} className="p-4 flex items-center justify-between hover:bg-line/20 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center text-danger">
                                        <ExclamationCircleIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[13px] text-ink group-hover:text-danger transition-colors">Stok Tipis</p>
                                        <p className="text-[11px] text-ink-soft">Bahan perlu procurement</p>
                                    </div>
                                </div>
                                <div className="font-oswald text-[18px] font-bold text-ink">{lowStockCount || 0}</div>
                            </Link>

                            <div className="p-4 flex items-center justify-between hover:bg-line/20 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center text-danger">
                                        <ExclamationCircleIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[13px] text-ink">Deadline Terdekat</p>
                                        <p className="text-[11px] text-ink-soft">{"<"} 3 hari tersisa</p>
                                    </div>
                                </div>
                                <div className="font-oswald text-[18px] font-bold text-ink">{upcomingDeadlines?.length || 0}</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* 4. Modul Visualisasi Tren */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-4 bg-navy rounded-full"></div>
                    <h2 className="text-[16px] font-oswald font-bold text-ink uppercase tracking-wide">Visualisasi Tren</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Pendapatan vs Pengeluaran (6 Bulan Terakhir)">
                        <div className="h-[280px]">
                            <Chart
                                options={{
                                    chart: { type: 'bar', toolbar: { show: false }, fontFamily: '"IBM Plex Sans", sans-serif' },
                                    colors: ['#29394A', '#A8402F'],
                                    dataLabels: { enabled: false },
                                    stroke: { show: true, width: 2, colors: ['transparent'] },
                                    xaxis: { categories: extraData.arus_kas?.map(a => a.date) || [] },
                                    yaxis: { labels: { formatter: (val) => 'Rp ' + formatShort(val) } },
                                    fill: { opacity: 1 },
                                    tooltip: { y: { formatter: (val) => 'Rp ' + fmtRupiah(val) } }
                                }}
                                series={[
                                    { name: 'Pemasukan', data: extraData.arus_kas?.map(a => a.pemasukan) || [] },
                                    { name: 'Pengeluaran', data: extraData.arus_kas?.map(a => a.pengeluaran) || [] }
                                ]}
                                type="bar"
                                height={280}
                            />
                        </div>
                    </Card>

                    <Card title="Tren Order Masuk (7 Hari Terakhir)">
                        <div className="h-[280px]">
                            <Chart
                                options={{
                                    chart: { type: 'line', toolbar: { show: false }, fontFamily: '"IBM Plex Sans", sans-serif' },
                                    colors: ['#2F6F62'],
                                    dataLabels: { enabled: true, style: { fontSize: '10px' } },
                                    stroke: { curve: 'smooth', width: 3 },
                                    xaxis: { categories: extraData.tren_order?.map(t => t.date) || [] },
                                }}
                                series={[
                                    { name: 'Jumlah Order', data: extraData.tren_order?.map(t => t.total) || [] }
                                ]}
                                type="line"
                                height={280}
                            />
                        </div>
                    </Card>
                </div>
            </section>

            {/* 5. Modul Tabel Data Terbaru & Piutang */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-4 bg-navy rounded-full"></div>
                    <h2 className="text-[16px] font-oswald font-bold text-ink uppercase tracking-wide">Data Terbaru & Piutang</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Kolom Kiri: Tabel Order Terbaru & Pengiriman (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card title="Order Terbaru">
                            {(!recentOrders || recentOrders.length === 0) ? (
                                <EmptyState icon={DocumentTextIcon} title="Belum ada order" description="Belum ada pesanan yang masuk ke sistem." />
                            ) : (
                                <Table>
                                    <Table.Head>
                                        <Table.HeadCell>ID Order</Table.HeadCell>
                                        <Table.HeadCell>Klien</Table.HeadCell>
                                        <Table.HeadCell>Total Harga</Table.HeadCell>
                                        <Table.HeadCell>Deadline</Table.HeadCell>
                                        <Table.HeadCell>Status</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {recentOrders.map((order) => (
                                            <Table.Row key={order.id}>
                                                <Table.Cell className="font-mono text-[11.5px] text-ink">{order.nomor_order || order.no_order}</Table.Cell>
                                                <Table.Cell className="font-medium text-ink">{order.customer?.nama || '-'}</Table.Cell>
                                                <Table.Cell className="font-mono text-[11.5px]">{fmtRupiah(order.total_harga)}</Table.Cell>
                                                <Table.Cell className="text-ink-soft">{formatDate(order.deadline)}</Table.Cell>
                                                <Table.Cell>
                                                    <Badge status={['selesai', 'dikirim'].includes(order.status) ? 'accent' : 'gold'}>{order.status}</Badge>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            )}
                        </Card>

                        <Card title="Pengiriman Hari Ini">
                            {(!extraData.pengiriman_hari_ini || extraData.pengiriman_hari_ini.length === 0) ? (
                                <EmptyState icon={TruckIcon} title="Tidak ada pengiriman" description="Tidak ada jadwal pengiriman barang hari ini." />
                            ) : (
                                <Table>
                                    <Table.Head>
                                        <Table.HeadCell>ID Order</Table.HeadCell>
                                        <Table.HeadCell>Klien</Table.HeadCell>
                                        <Table.HeadCell>Alamat / Info</Table.HeadCell>
                                        <Table.HeadCell>Status</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {extraData.pengiriman_hari_ini.map((order) => (
                                            <Table.Row key={order.id}>
                                                <Table.Cell className="font-mono text-[11.5px] text-ink">{order.no_order}</Table.Cell>
                                                <Table.Cell className="font-medium text-ink">{order.customer?.nama || '-'}</Table.Cell>
                                                <Table.Cell className="text-ink-soft text-[11px] truncate max-w-[200px]">{order.customer?.alamat || '-'}</Table.Cell>
                                                <Table.Cell>
                                                    <Badge status={order.status === 'dikirim' ? 'accent' : 'gold'}>{order.status}</Badge>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            )}
                        </Card>
                    </div>

                    {/* Kolom Kanan: Piutang Menunggak (1/3 width, Match with Keuangan UI) */}
                    <div>
                        <Card className="!p-0 overflow-hidden h-full flex flex-col">
                            <div className="p-5 border-b border-line flex-shrink-0">
                                <h3 className="text-[18px] font-oswald font-bold text-ink">Piutang menunggak</h3>
                            </div>
                            <div className="divide-y divide-line flex-1">
                                {extraData.piutang_menunggak?.map(p => (
                                    <div key={p.id} className="p-4 flex justify-between items-center hover:bg-line/20 transition-colors">
                                        <div>
                                            <p className="font-bold text-[13px] text-ink uppercase">{p.customer}</p>
                                            <p className="text-[11px] text-ink-soft font-mono mt-0.5">Order #{p.no_order}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-[13px] text-ink">Rp {formatShort(p.sisa_bayar)}</p>
                                            <p className="text-[11px] text-danger font-medium mt-0.5">{p.hari} hari</p>
                                        </div>
                                    </div>
                                ))}
                                {(!extraData.piutang_menunggak || extraData.piutang_menunggak.length === 0) && (
                                    <div className="p-8 h-full flex flex-col items-center justify-center">
                                        <BanknotesIcon className="w-8 h-8 text-line mb-3" />
                                        <div className="text-center text-[12px] text-ink-soft">Tidak ada piutang menunggak.</div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                </div>
            </section>
        </div>
    );
}
