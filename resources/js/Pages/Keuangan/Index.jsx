import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

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
            <Head title="Keuangan" />
            
            {/* Custom styles for dotted top borders */}
            <style dangerouslySetInnerHTML={{__html: `
                .border-top-dotted-teal { border-top: 4px dotted #245953; }
                .border-top-dotted-red { border-top: 4px dotted #c84b31; }
                .border-top-dotted-yellow { border-top: 4px dotted #e3b04b; }
                .border-top-dotted-purple { border-top: 4px dotted #5e548e; }
            `}} />

            <div className="bg-[#f4ebd0] min-h-screen p-6 -m-6"> {/* Match the cream background */}
                
                {/* 4 Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4 border-top-dotted-teal">
                        <p className="text-xs text-gray-500 font-medium mb-1">Omzet bulan ini</p>
                        <h3 className="text-2xl font-bold">Rp {formatShort(omzet)}</h3>
                        <p className="text-[10px] text-teal-700 mt-1">&uarr; Berjalan</p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-4 border-top-dotted-red">
                        <p className="text-xs text-gray-500 font-medium mb-1">Kas keluar bulan ini</p>
                        <h3 className="text-2xl font-bold">Rp {formatShort(kasKeluar)}</h3>
                        <p className="text-[10px] text-gray-400 mt-1">Belum ada pengeluaran tercatat</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 border-top-dotted-yellow">
                        <p className="text-xs text-gray-500 font-medium mb-1">Total piutang</p>
                        <h3 className="text-2xl font-bold">Rp {formatShort(piutang)}</h3>
                        <p className="text-[10px] text-red-500 mt-1">{piutangMenunggak.length} order menunggak > 7 hari</p>
                        <Link href={route('keuangan.pembayaran.index')} className="text-[10px] text-teal-700 hover:underline mt-1 block">Lihat detail piutang &rarr;</Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 border-top-dotted-purple">
                        <p className="text-xs text-gray-500 font-medium mb-1">Laba bersih (estimasi)</p>
                        <h3 className="text-2xl font-bold">Rp {formatShort(labaBersih)}</h3>
                        <p className="text-[10px] text-gray-400 mt-1">Belum dikurangi pengeluaran ops</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mb-6">
                    <Link href={route('keuangan.pembayaran.index')} className="bg-[#245953] text-white text-sm font-medium px-4 py-2 rounded shadow-sm hover:bg-[#1a403c]">
                        + Catat pembayaran
                    </Link>
                    <Link href={route('keuangan.pengeluaran.index')} className="bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded shadow-sm hover:bg-gray-50">
                        + Catat pengeluaran
                    </Link>
                    <Link href={route('keuangan.laporan')} className="bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded shadow-sm hover:bg-gray-50">
                        Lihat laporan laba rugi
                    </Link>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column (Chart + Pembayaran Terakhir + Pengeluaran) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Arus Kas Chart */}
                        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-bold text-gray-800">Arus kas 7 hari terakhir</h3>
                                <span className="text-[10px] text-gray-500">Pemasukan vs pengeluaran</span>
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
                                                    className="w-2 bg-[#245953] rounded-t-sm"
                                                    title={`Pemasukan: Rp ${fmtRupiah(data.pemasukan)}`}
                                                ></div>
                                                <div 
                                                    style={{ height: `${pengPct}%`, minHeight: data.pengeluaran > 0 ? '4px' : '0' }} 
                                                    className="w-2 bg-[#c84b31] rounded-t-sm"
                                                    title={`Pengeluaran: Rp ${fmtRupiah(data.pengeluaran)}`}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] text-gray-500">{data.date}</span>
                                        </div>
                                    )
                                })}
                            </div>
                            
                            <div className="flex gap-4 text-[10px] text-gray-500 border-t pt-3">
                                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#245953]"></div> Pemasukan</div>
                                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#c84b31]"></div> Pengeluaran</div>
                            </div>
                        </div>

                        {/* Pembayaran Terakhir */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center p-5 border-b">
                                <h3 className="text-sm font-bold text-gray-800">Pembayaran terakhir</h3>
                                <span className="text-[10px] text-gray-500">5 transaksi terbaru</span>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {recentPembayarans.map(p => {
                                    const dateObj = new Date(p.tanggal);
                                    const formattedDate = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
                                    const isDP = p.tipe.toLowerCase() === 'dp';
                                    
                                    return (
                                        <div key={p.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                            <div>
                                                <p className="font-bold text-sm text-gray-800">Order #{p.order_id} &middot; {p.order?.customer?.nama}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDP ? 'bg-[#f4ebd0] text-[#e3b04b]' : 'bg-[#e6f4f1] text-[#245953]'}`}>
                                                        {isDP ? 'DP' : 'Pelunasan'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{formattedDate} &middot; <span className="capitalize">{p.metode}</span></span>
                                                </div>
                                            </div>
                                            <div className="font-bold text-[#245953] font-mono text-sm">
                                                +Rp {fmtRupiah(p.jumlah)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Rincian Pengeluaran */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center p-5 border-b">
                                <h3 className="text-sm font-bold text-gray-800">Rincian pengeluaran</h3>
                                <span className="text-[10px] text-gray-500">Bulan berjalan</span>
                            </div>
                            
                            {recentPengeluarans.length > 0 ? (
                                <div className="divide-y divide-gray-100">
                                    {recentPengeluarans.map(p => (
                                        <div key={p.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                            <div>
                                                <p className="font-bold text-sm text-gray-800">{p.kategori}</p>
                                                <p className="text-xs text-gray-500">{p.tanggal} &middot; {p.deskripsi}</p>
                                            </div>
                                            <div className="font-bold text-[#c84b31] font-mono text-sm">
                                                -Rp {fmtRupiah(p.jumlah)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 text-center flex flex-col items-center justify-center">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full mb-3"></div>
                                    <p className="font-bold text-sm text-gray-800">Belum ada pengeluaran tercatat</p>
                                    <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">Catat pembelian bahan baku atau biaya operasional untuk melihat rinciannya di sini.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column (Piutang Menunggak + Top Omzet) */}
                    <div className="space-y-6">
                        
                        {/* Piutang Menunggak */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="p-5 border-b">
                                <h3 className="text-sm font-bold text-gray-800">Piutang menunggak</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {piutangMenunggak.map(p => (
                                    <div key={p.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                        <div>
                                            <p className="font-bold text-sm text-gray-800">{p.customer}</p>
                                            <p className="text-[10px] text-gray-500">Order #{p.id}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm text-gray-800">Rp {formatShort(p.sisa_bayar)}</p>
                                            <p className="text-[10px] text-red-500 font-medium">{p.hari} hari</p>
                                        </div>
                                    </div>
                                ))}
                                {piutangMenunggak.length === 0 && (
                                    <div className="p-4 text-center text-xs text-gray-500">Tidak ada piutang menunggak.</div>
                                )}
                            </div>
                        </div>

                        {/* Kontribusi Omzet */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="p-5 border-b">
                                <h3 className="text-sm font-bold text-gray-800">Kontribusi omzet tertinggi</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {topOmzet.map((t, idx) => (
                                    <div key={t.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                        <div className="flex gap-3 items-center">
                                            <span className="text-[10px] text-gray-400 font-mono">0{idx + 1}</span>
                                            <p className="font-bold text-xs text-gray-800">Order #{t.id} &middot; {t.customer}</p>
                                        </div>
                                        <div className="font-bold text-xs text-gray-800">
                                            Rp {formatShort(t.total_harga)}
                                        </div>
                                    </div>
                                ))}
                                {topOmzet.length === 0 && (
                                    <div className="p-4 text-center text-xs text-gray-500">Belum ada order.</div>
                                )}
                            </div>
                        </div>
                        
                    </div>
                </div>
                
            </div>
        </AppLayout>
    );
}
