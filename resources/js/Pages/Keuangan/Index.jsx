import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import StatsCard from '@/Components/StatsCard';
import Card from '@/Components/Card';
import EmptyState from '@/Components/EmptyState';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { ChartBarSquareIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';

export default function Index({ omzet, kasKeluar, piutang, labaBersih, recentPembayarans, recentPengeluarans, piutangMenunggak, topOmzet, arusKas }) {
    
    const [activeTab, setActiveTab] = useState('ringkasan');
    const [analitikFilter, setAnalitikFilter] = useState('bulan_ini');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [chartData, setChartData] = useState({ labels: [], pemasukan: [], pengeluaran: [] });
    const [loadingChart, setLoadingChart] = useState(false);

    // Arus Kas chart filter state
    const [kasFilter, setKasFilter] = useState('7_hari');
    const [kasStart, setKasStart] = useState('');
    const [kasEnd, setKasEnd] = useState('');
    const [kasChartData, setKasChartData] = useState({
        labels: arusKas.map(d => d.date),
        pemasukan: arusKas.map(d => d.pemasukan),
        pengeluaran: arusKas.map(d => d.pengeluaran),
    });
    const [kasLoading, setKasLoading] = useState(false);

    const toDateStr = (date) => date.toISOString().split('T')[0];

    const fetchKasData = (filter, start, end) => {
        if (filter === 'custom' && (!start || !end)) return;
        setKasLoading(true);
        const today = new Date();
        let params = {};
        if (filter === '7_hari') {
            const s = new Date(today); s.setDate(today.getDate() - 6);
            params = { filter: 'custom', start_date: toDateStr(s), end_date: toDateStr(today) };
        } else if (filter === '14_hari') {
            const s = new Date(today); s.setDate(today.getDate() - 13);
            params = { filter: 'custom', start_date: toDateStr(s), end_date: toDateStr(today) };
        } else if (filter === '30_hari') {
            const s = new Date(today); s.setDate(today.getDate() - 29);
            params = { filter: 'custom', start_date: toDateStr(s), end_date: toDateStr(today) };
        } else if (filter === 'custom') {
            params = { filter: 'custom', start_date: start, end_date: end };
        }
        axios.get(route('keuangan.api.analitik'), { params })
            .then(res => {
                setKasChartData({
                    labels: res.data.labels,
                    pemasukan: res.data.pemasukan,
                    pengeluaran: res.data.pengeluaran,
                });
            })
            .finally(() => setKasLoading(false));
    };

    useEffect(() => {
        if (activeTab === 'analitik') {
            fetchAnalitik();
        }
    }, [activeTab, analitikFilter]);

    useEffect(() => {
        if (kasFilter !== 'custom') {
            fetchKasData(kasFilter);
        }
    }, [kasFilter]);

    const fetchAnalitik = () => {
        if (analitikFilter === 'custom' && (!customStart || !customEnd)) return;
        setLoadingChart(true);
        axios.get(route('keuangan.api.analitik'), {
            params: { filter: analitikFilter, start_date: customStart, end_date: customEnd }
        }).then(res => {
            setChartData(res.data);
        }).finally(() => {
            setLoadingChart(false);
        });
    };


    // Short formatter e.g., 32,7jt, 900rb
    const formatShort = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + 'jt';
        }
        if (num >= 1000) {
            return (num / 1000).toLocaleString('id-ID', { maximumFractionDigits: 0 }) + 'rb';
        }
        return num.toLocaleString('id-ID');
    };

    const fmtRupiah = (num) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };



    return (
        <AppLayout title="Dashboard Keuangan">
            <div className="max-w-7xl mx-auto">
                <div className="border-b border-line mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button 
                            onClick={() => setActiveTab('ringkasan')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-[14px] ${activeTab === 'ringkasan' ? 'border-accent text-accent' : 'border-transparent text-ink-soft hover:text-ink hover:border-line'}`}>
                            Ringkasan
                        </button>
                        <button 
                            onClick={() => setActiveTab('analitik')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-[14px] ${activeTab === 'analitik' ? 'border-accent text-accent' : 'border-transparent text-ink-soft hover:text-ink hover:border-line'}`}>
                            Analitik
                        </button>
                    </nav>
                </div>

                {activeTab === 'ringkasan' && (
                    <div className="space-y-6">
                        {/* 4 Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <StatsCard 
                                title="Omzet bulan ini" 
                                value={"Rp " + formatShort(omzet)}
                                caption="↑ Berjalan"
                                status="accent"
                            />
                            <StatsCard 
                                title="Kas keluar bulan ini" 
                                value={"Rp " + formatShort(kasKeluar)}
                                caption="Belum ada pengeluaran tercatat"
                                status="danger"
                            />
                            <StatsCard 
                                title="Total piutang" 
                                value={"Rp " + formatShort(piutang)}
                                caption={`${piutangMenunggak.length} order menunggak > 7 hari`}
                                status="gold"
                                actionLink={route('keuangan.piutang.index')}
                                actionLabel="Lihat detail piutang"
                            />
                            <StatsCard 
                                title="Laba bersih (estimasi)" 
                                value={"Rp " + formatShort(labaBersih)}
                                caption="Belum dikurangi pengeluaran ops"
                                status="neutral"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <PrimaryButton asChild>
                                <Link href={route('keuangan.pembayaran.index')}>+ Catat pembayaran</Link>
                            </PrimaryButton>
                            <SecondaryButton asChild>
                                <Link href={route('keuangan.pengeluaran.index')}>+ Catat pengeluaran</Link>
                            </SecondaryButton>
                            <SecondaryButton asChild>
                                <Link href={route('keuangan.laporan')}>Lihat laporan laba rugi</Link>
                            </SecondaryButton>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* Left Column (Chart + Pembayaran Terakhir + Pengeluaran) */}
                            <div className="lg:col-span-2 space-y-6">
                                
                                {/* Arus Kas Chart */}
                                <Card className="!p-0 overflow-hidden">
                                    {/* Header row */}
                                    <div className="flex flex-wrap justify-between items-start gap-3 px-5 pt-5 pb-3 border-b border-line">
                                        <div>
                                            <h3 className="text-[18px] font-oswald font-bold text-ink">Arus Kas</h3>
                                            <p className="text-[11.5px] text-ink-soft mt-0.5">Perkembangan harian pemasukan vs pengeluaran</p>
                                        </div>
                                        {/* Filter preset buttons */}
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {[
                                                { key: '7_hari',  label: '7H' },
                                                { key: '14_hari', label: '14H' },
                                                { key: '30_hari', label: '30H' },
                                                { key: 'custom',  label: 'Custom' },
                                            ].map(opt => (
                                                <button
                                                    key={opt.key}
                                                    onClick={() => setKasFilter(opt.key)}
                                                    className={`text-[11px] font-medium px-3 py-1 rounded-full border transition-colors ${
                                                        kasFilter === opt.key
                                                            ? 'bg-navy text-white border-navy'
                                                            : 'bg-bg text-ink-soft border-line hover:border-navy hover:text-ink'
                                                    }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Custom date picker row */}
                                    {kasFilter === 'custom' && (
                                        <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-line bg-bg/50">
                                            <span className="text-[11.5px] text-ink-soft font-medium">Periode:</span>
                                            <input
                                                type="date"
                                                value={kasStart}
                                                onChange={e => setKasStart(e.target.value)}
                                                className="text-[12px] font-mono border border-line rounded px-2 py-1 bg-panel text-ink focus:outline-none focus:border-accent"
                                            />
                                            <span className="text-ink-soft text-[11px]">s/d</span>
                                            <input
                                                type="date"
                                                value={kasEnd}
                                                onChange={e => setKasEnd(e.target.value)}
                                                className="text-[12px] font-mono border border-line rounded px-2 py-1 bg-panel text-ink focus:outline-none focus:border-accent"
                                            />
                                            <button
                                                onClick={() => fetchKasData('custom', kasStart, kasEnd)}
                                                disabled={!kasStart || !kasEnd || kasLoading}
                                                className="text-[11.5px] font-medium px-3 py-1 rounded border bg-accent text-white border-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Terapkan
                                            </button>
                                        </div>
                                    )}

                                    {/* Chart area */}
                                    {kasLoading ? (
                                        <div className="h-[220px] flex items-center justify-center text-ink-soft text-[13px]">
                                            <svg className="animate-spin w-5 h-5 mr-2 text-accent" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                            </svg>
                                            Memuat data...
                                        </div>
                                    ) : (
                                        <Chart
                                            options={{
                                                chart: {
                                                    type: 'area',
                                                    toolbar: { show: false },
                                                    fontFamily: '"IBM Plex Sans", sans-serif',
                                                    animations: { enabled: true, easing: 'easeinout', speed: 600 },
                                                    background: 'transparent',
                                                },
                                                colors: ['#2F6F62', '#A8402F'],
                                                fill: {
                                                    type: 'gradient',
                                                    gradient: {
                                                        shadeIntensity: 1,
                                                        opacityFrom: 0.28,
                                                        opacityTo: 0.02,
                                                        stops: [0, 100],
                                                    }
                                                },
                                                stroke: { curve: 'smooth', width: 2 },
                                                dataLabels: { enabled: false },
                                                markers: { size: 0, hover: { size: 5 } },
                                                xaxis: {
                                                    categories: kasChartData.labels,
                                                    tickAmount: Math.min(kasChartData.labels.length, 14),
                                                    labels: {
                                                        rotate: -30,
                                                        hideOverlappingLabels: true,
                                                        style: {
                                                            colors: '#6B655C',
                                                            fontSize: '10px',
                                                            fontFamily: '"IBM Plex Mono", monospace',
                                                        }
                                                    },
                                                    axisBorder: { show: false },
                                                    axisTicks: { show: false },
                                                },
                                                yaxis: {
                                                    min: 0,
                                                    forceNiceScale: true,
                                                    labels: {
                                                        formatter: (val) => 'Rp ' + formatShort(val),
                                                        style: {
                                                            colors: '#6B655C',
                                                            fontSize: '10px',
                                                            fontFamily: '"IBM Plex Sans", sans-serif',
                                                        }
                                                    }
                                                },
                                                grid: {
                                                    borderColor: '#DCD3BF',
                                                    strokeDashArray: 4,
                                                    padding: { top: -10, right: 10, bottom: 0, left: 10 }
                                                },
                                                tooltip: {
                                                    theme: 'light',
                                                    y: { formatter: (val) => 'Rp ' + fmtRupiah(val) }
                                                },
                                                legend: {
                                                    position: 'top',
                                                    horizontalAlign: 'right',
                                                    markers: { radius: 2, width: 10, height: 10 },
                                                    labels: { colors: '#6B655C' },
                                                    fontFamily: '"IBM Plex Sans", sans-serif',
                                                    fontSize: '11px',
                                                    itemMargin: { horizontal: 10 },
                                                }
                                            }}
                                            series={[
                                                { name: 'Pemasukan', data: kasChartData.pemasukan },
                                                { name: 'Pengeluaran', data: kasChartData.pengeluaran }
                                            ]}
                                            type="area"
                                            height={220}
                                        />
                                    )}
                                </Card>



                                {/* Pembayaran Terakhir */}
                                <Card className="!p-0 overflow-hidden">
                                    <div className="flex justify-between items-end p-5 border-b border-line">
                                        <h3 className="text-[18px] font-oswald font-bold text-ink">Pembayaran terakhir</h3>
                                        <span className="text-[11px] text-ink-soft">5 transaksi terbaru</span>
                                    </div>
                                    <div className="divide-y divide-line">
                                        {recentPembayarans.map(p => {
                                            const dateObj = new Date(p.tanggal);
                                            const formattedDate = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
                                            const isDP = p.tipe.toLowerCase() === 'dp';
                                            
                                            return (
                                                <div key={p.id} className="p-4 flex justify-between items-center hover:bg-line/20 transition-colors">
                                                    <div>
                                                        <p className="font-bold text-[13px] text-ink">Order #{p.order_id} &middot; {p.order?.customer?.nama}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${isDP ? 'bg-gold/10 text-gold border-gold/20' : 'bg-accent/10 text-accent border-accent/20'}`}>
                                                                {isDP ? 'DP' : 'Pelunasan'}
                                                            </span>
                                                            <span className="text-[11px] text-ink-soft font-mono">{formattedDate} &middot; <span className="capitalize">{p.metode}</span></span>
                                                        </div>
                                                    </div>
                                                    <div className="font-bold text-accent font-mono text-[14px]">
                                                        +Rp {fmtRupiah(p.jumlah)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Card>

                                {/* Rincian Pengeluaran */}
                                <Card className="!p-0 overflow-hidden">
                                    <div className="flex justify-between items-end p-5 border-b border-line">
                                        <h3 className="text-[18px] font-oswald font-bold text-ink">Rincian pengeluaran</h3>
                                        <span className="text-[11px] text-ink-soft">Bulan berjalan</span>
                                    </div>
                                    
                                    {recentPengeluarans.length > 0 ? (
                                        <div className="divide-y divide-line">
                                            {recentPengeluarans.map(p => (
                                                <div key={p.id} className="p-4 flex justify-between items-center hover:bg-line/20 transition-colors">
                                                    <div>
                                                        <p className="font-bold text-[13px] text-ink">{p.kategori}</p>
                                                        <p className="text-[11.5px] text-ink-soft">{p.tanggal ? new Date(p.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'} &middot; {p.deskripsi}</p>
                                                    </div>
                                                    <div className="font-bold text-danger font-mono text-[14px]">
                                                        -Rp {fmtRupiah(p.jumlah)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6">
                                            <EmptyState 
                                                title="Belum ada pengeluaran"
                                                description="Catat pembelian bahan baku atau biaya operasional untuk melihat rinciannya."
                                                icon={DocumentChartBarIcon}
                                            />
                                        </div>
                                    )}
                                </Card>
                            </div>

                            {/* Right Column (Piutang Menunggak + Top Omzet) */}
                            <div className="space-y-6">
                                
                                {/* Piutang Menunggak */}
                                <Card className="!p-0 overflow-hidden">
                                    <div className="p-5 border-b border-line">
                                        <h3 className="text-[18px] font-oswald font-bold text-ink">Piutang menunggak</h3>
                                    </div>
                                    <div className="divide-y divide-line">
                                        {piutangMenunggak.map(p => (
                                            <div key={p.id} className="p-4 flex justify-between items-center hover:bg-line/20 transition-colors">
                                                <div>
                                                    <p className="font-bold text-[13px] text-ink">{p.customer}</p>
                                                    <p className="text-[11px] text-ink-soft font-mono mt-0.5">Order #{p.id}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-[13px] text-ink">Rp {formatShort(p.sisa_bayar)}</p>
                                                    <p className="text-[11px] text-danger font-medium mt-0.5">{p.hari} hari</p>
                                                </div>
                                            </div>
                                        ))}
                                        {piutangMenunggak.length === 0 && (
                                            <div className="p-4 text-center text-[12px] text-ink-soft">Tidak ada piutang menunggak.</div>
                                        )}
                                    </div>
                                </Card>

                                {/* Kontribusi Omzet */}
                                <Card className="!p-0 overflow-hidden">
                                    <div className="p-5 border-b border-line">
                                        <h3 className="text-[18px] font-oswald font-bold text-ink">Kontribusi omzet tertinggi</h3>
                                    </div>
                                    <div className="divide-y divide-line">
                                        {topOmzet.map((t, idx) => (
                                            <div key={t.id} className="p-4 flex justify-between items-center hover:bg-line/20 transition-colors">
                                                <div className="flex gap-3 items-center">
                                                    <span className="text-[11px] text-ink-soft font-mono">0{idx + 1}</span>
                                                    <p className="font-bold text-[12.5px] text-ink font-mono">Order #{t.id} &middot; <span className="font-sans font-medium text-ink-soft">{t.customer}</span></p>
                                                </div>
                                                <div className="font-bold text-[12.5px] text-ink">
                                                    Rp {formatShort(t.total_harga)}
                                                </div>
                                            </div>
                                        ))}
                                        {topOmzet.length === 0 && (
                                            <div className="p-4 text-center text-[12px] text-ink-soft">Belum ada order.</div>
                                        )}
                                    </div>
                                </Card>
                                
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'analitik' && (
                    <div className="space-y-6">
                        <Card>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div>
                                    <h3 className="text-[18px] font-oswald font-bold text-ink">Grafik Analitik Keuangan</h3>
                                    <p className="text-[12px] text-ink-soft mt-1">Pemasukan vs Pengeluaran</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <select 
                                        value={analitikFilter} 
                                        onChange={e => setAnalitikFilter(e.target.value)}
                                        className="text-[13px] border-line rounded focus:ring-accent focus:border-accent p-2 outline-none"
                                    >
                                        <option value="hari_ini">Hari Ini</option>
                                        <option value="bulan_ini">Bulan Ini</option>
                                        <option value="perbandingan_bulan">Perbandingan Bulan 1 - Berjalan</option>
                                        <option value="custom">Custom Range</option>
                                    </select>

                                    {analitikFilter === 'custom' && (
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="date" 
                                                value={customStart} 
                                                onChange={e => setCustomStart(e.target.value)}
                                                className="text-[13px] border-line rounded focus:ring-accent focus:border-accent p-2 outline-none"
                                            />
                                            <span className="text-ink-soft">-</span>
                                            <input 
                                                type="date" 
                                                value={customEnd} 
                                                onChange={e => setCustomEnd(e.target.value)}
                                                className="text-[13px] border-line rounded focus:ring-accent focus:border-accent p-2 outline-none"
                                            />
                                            <SecondaryButton onClick={fetchAnalitik} disabled={!customStart || !customEnd || loadingChart}>Terapkan</SecondaryButton>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {loadingChart ? (
                                <div className="h-[320px] flex items-center justify-center text-ink-soft text-sm">Memuat grafik...</div>
                            ) : (
                                <div className="h-[320px]">
                                    <Chart
                                        options={{
                                            chart: {
                                                type: 'bar',
                                                toolbar: { show: false },
                                                fontFamily: '"IBM Plex Sans", sans-serif'
                                            },
                                            colors: ['#29394A', '#A8402F'], // navy and danger
                                            plotOptions: {
                                                bar: {
                                                    horizontal: false,
                                                    columnWidth: '55%',
                                                    borderRadius: 2
                                                },
                                            },
                                            dataLabels: { enabled: false },
                                            stroke: { show: true, width: 2, colors: ['transparent'] },
                                            xaxis: { 
                                                categories: chartData.labels,
                                                tickAmount: 15,
                                                labels: {
                                                    rotate: -45,
                                                    rotateAlways: false,
                                                    hideOverlappingLabels: true,
                                                    style: { colors: '#6B655C', fontSize: '11px' }
                                                },
                                                axisBorder: { show: false },
                                                axisTicks: { show: false }
                                            },
                                            yaxis: {
                                                min: 0,
                                                forceNiceScale: true,
                                                decimalsInFloat: 0,
                                                labels: {
                                                    formatter: (value) => 'Rp ' + formatShort(value),
                                                    style: { colors: '#6B655C', fontSize: '11px' }
                                                }
                                            },
                                            grid: {
                                                borderColor: '#DCD3BF',
                                                strokeDashArray: 4,
                                                padding: { top: 0, right: 0, bottom: 0, left: 10 }
                                            },
                                            fill: { opacity: 1 },
                                            tooltip: {
                                                y: {
                                                    formatter: (val) => 'Rp ' + fmtRupiah(val)
                                                }
                                            },
                                            legend: {
                                                position: 'top',
                                                horizontalAlign: 'right',
                                                markers: { radius: 2 },
                                                itemMargin: { horizontal: 10, vertical: 0 }
                                            }
                                        }}
                                        series={[
                                            { name: 'Pemasukan', data: chartData.pemasukan },
                                            { name: 'Pengeluaran', data: chartData.pengeluaran }
                                        ]}
                                        type="bar"
                                        height={320}
                                    />
                                </div>
                            )}
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
