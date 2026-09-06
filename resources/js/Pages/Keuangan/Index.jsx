import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import StatsCard from '@/Components/StatsCard';
import Card from '@/Components/Card';
import EmptyState from '@/Components/EmptyState';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { ChartBarSquareIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';

export default function Index({ omzet, kasKeluar, piutang, labaBersih, recentPembayarans, recentPengeluarans, piutangMenunggak, topOmzet, arusKas }) {
    
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

    // Calculate max value for Arus Kas chart height
    let maxKas = 0;
    arusKas.forEach(d => {
        if (d.pemasukan > maxKas) maxKas = d.pemasukan;
        if (d.pengeluaran > maxKas) maxKas = d.pengeluaran;
    });
    if (maxKas === 0) maxKas = 1; // Prevent divide by zero

    return (
        <AppLayout title="Dashboard Keuangan">
            <div className="max-w-7xl mx-auto space-y-6">
                
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
                        actionLink={route('keuangan.pembayaran.index')}
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
                        <Card>
                            <div className="flex justify-between items-end mb-6">
                                <h3 className="text-[18px] font-oswald font-bold text-ink">Arus kas 7 hari terakhir</h3>
                                <span className="text-[11px] text-ink-soft">Pemasukan vs pengeluaran</span>
                            </div>
                            
                            <div className="flex justify-around items-end h-32 mb-4">
                                {arusKas.map((data, i) => {
                                    const pemPct = (data.pemasukan / maxKas) * 100;
                                    const pengPct = (data.pengeluaran / maxKas) * 100;
                                    
                                    return (
                                        <div key={i} className="flex flex-col items-center flex-1">
                                            <div className="flex items-end gap-1 w-full justify-center h-24 mb-2">
                                                <div 
                                                    style={{ height: `${pemPct}%`, minHeight: data.pemasukan > 0 ? '4px' : '0' }} 
                                                    className="w-3 bg-navy rounded-t-sm"
                                                    title={`Pemasukan: Rp ${fmtRupiah(data.pemasukan)}`}
                                                ></div>
                                                <div 
                                                    style={{ height: `${pengPct}%`, minHeight: data.pengeluaran > 0 ? '4px' : '0' }} 
                                                    className="w-3 bg-danger rounded-t-sm"
                                                    title={`Pengeluaran: Rp ${fmtRupiah(data.pengeluaran)}`}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] text-ink-soft font-mono">{data.date}</span>
                                        </div>
                                    )
                                })}
                            </div>
                            
                            <div className="flex gap-4 text-[11px] font-medium text-ink-soft border-t border-line pt-4 justify-center">
                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-navy"></div> Pemasukan</div>
                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-danger"></div> Pengeluaran</div>
                            </div>
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
                                                <p className="text-[11.5px] text-ink-soft">{p.tanggal} &middot; {p.deskripsi}</p>
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
        </AppLayout>
    );
}
