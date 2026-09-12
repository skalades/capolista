import AppLayout from '@/Layouts/AppLayout';
import Badge from '@/Components/Badge';
import { formatRupiah } from '@/utils';
import { useState } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { 
    ArrowLeftIcon, 
    PrinterIcon, 
    DocumentTextIcon, 
    PencilSquareIcon,
    ChatBubbleLeftEllipsisIcon,
    CheckCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const STATUS_SEMANTICS = {
    draft: 'neutral', desain: 'neutral', procurement: 'gold',
    cutting: 'gold', jahit: 'gold', produksi: 'gold', printing: 'gold', pemasangan: 'gold',
    packing: 'gold', dikirim: 'accent', selesai: 'accent'
};

const STATUS_LABELS = {
    draft: 'Draft', desain: 'Desain', procurement: 'Procurement',
    cutting: 'Cutting', jahit: 'Jahit', produksi: 'Produksi', printing: 'Printing', pemasangan: 'Pemasangan',
    packing: 'Packing', dikirim: 'Dikirim', selesai: 'Selesai'
};

export default function OrderShow({ order = {} }) {
    const o = order.id ? order : {
        no_order: 'ORD-XXXX', status: 'draft', customer: { nama: '-', kontak: '-', alamat: '-' },
        jenis_produk: '-', jumlah: 0, deadline: '-', total_harga: 0, dp: 0, sisa_bayar: 0,
        items: [], orderLogs: []
    };

    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        status: o.status,
        catatan: '',
    });

    const submitStatus = (e) => {
        e.preventDefault();
        post(route('orders.update-status', o.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsStatusModalOpen(false);
                reset('catatan');
            },
        });
    };

    const sisa = o.total_harga - o.dp;

    return (
        <AppLayout title={`Detail Order ${o.no_order}`}>
            <div className="max-w-6xl mx-auto pb-20">
                {/* TOP BAR */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Link 
                            href={route('orders.index')} 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-bg border border-line rounded-full text-[13px] font-bold text-ink hover:bg-line/30 transition-colors"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Kembali
                        </Link>
                        <h2 className="text-[24px] font-bold font-oswald text-ink tracking-tight uppercase">
                            {o.no_order}
                        </h2>
                        <Badge status={STATUS_SEMANTICS[o.status] || 'neutral'} className="text-[11px] px-2.5 py-1 uppercase tracking-wider font-bold">
                            <span className="mr-1.5 opacity-70">•</span>
                            {STATUS_LABELS[o.status] || o.status}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={route('orders.spk', o.id)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-line rounded-full text-[13px] font-semibold text-ink shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            <DocumentTextIcon className="w-4 h-4" />
                            SPK
                        </a>
                        <a
                            href={route('orders.invoice', o.id)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-line rounded-full text-[13px] font-semibold text-ink shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            <PrinterIcon className="w-4 h-4" />
                            Invoice
                        </a>
                        <button
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-line rounded-full text-[13px] font-semibold text-ink shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            <DocumentTextIcon className="w-4 h-4" />
                            Kwitansi
                        </button>
                        <Link
                            href={route('orders.edit', o.id)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-line rounded-full text-[13px] font-semibold text-ink shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            <PencilSquareIcon className="w-4 h-4" />
                            Edit
                        </Link>
                        <button
                            onClick={() => setIsStatusModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-navy border border-transparent rounded-full text-[13px] font-bold text-white shadow-sm hover:bg-navy/90 transition-colors"
                        >
                            Ubah Status
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* RINGKASAN ORDER */}
                        <div className="bg-panel rounded-md border border-line shadow-sm overflow-hidden">
                            <div className="bg-line/20 px-6 py-4 border-b border-line">
                                <h2 className="font-oswald text-[18px] font-bold text-ink uppercase tracking-wide">
                                    Ringkasan Order
                                </h2>
                            </div>
                            
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                    <div>
                                        <h3 className="text-[11px] font-bold text-ink-soft uppercase tracking-wider mb-3">Informasi Kustomer</h3>
                                        <div className="grid grid-cols-[80px_1fr] gap-y-2 text-[13px]">
                                            <div className="text-ink-soft">Nama</div>
                                            <div className="font-medium text-ink">{o.customer?.nama || '-'}</div>
                                            
                                            <div className="text-ink-soft">Kontak</div>
                                            <div className="font-medium text-ink">{o.customer?.kontak || '-'}</div>
                                            
                                            <div className="text-ink-soft">Alamat</div>
                                            <div className="font-medium text-ink">{o.customer?.alamat || '-'}</div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-[11px] font-bold text-ink-soft uppercase tracking-wider mb-3">Detail Spesifikasi</h3>
                                        <div className="grid grid-cols-[80px_1fr] gap-y-2 text-[13px]">
                                            <div className="text-ink-soft">Tgl Order</div>
                                            <div className="font-medium text-ink">{o.tanggal_order ? new Date(o.tanggal_order).toLocaleDateString('id-ID') : '-'}</div>

                                            <div className="text-ink-soft">Deadline</div>
                                            <div className="font-medium text-danger">{o.deadline ? new Date(o.deadline).toLocaleDateString('id-ID') : '-'}</div>
                                            
                                            <div className="text-ink-soft">Total Item</div>
                                            <div className="font-medium text-ink">{o.items?.length || 1} varian</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="border-t border-line pt-5">
                                    <h3 className="text-[11px] font-bold text-ink-soft uppercase tracking-wider mb-3">Breakdown Ukuran</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {o.items && o.items.length > 0 ? o.items.map((item, idx) => (
                                            <div key={idx} className="border border-line rounded px-3 py-1.5 bg-white text-[13px] font-mono font-medium text-ink shadow-sm">
                                                {item.jenis_produk || o.jenis_produk} - {item.ukuran || 'All'}: {item.jumlah_pcs}
                                            </div>
                                        )) : (
                                            <div className="border border-line rounded px-3 py-1.5 bg-white text-[13px] font-mono font-medium text-ink shadow-sm">
                                                {o.jenis_produk} - All: {o.jumlah}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FINANSIAL */}
                        <div className="bg-panel rounded-md border border-line shadow-sm overflow-hidden">
                            <div className="bg-line/20 px-6 py-4 border-b border-line">
                                <h2 className="font-oswald text-[18px] font-bold text-ink uppercase tracking-wide">
                                    Finansial
                                </h2>
                            </div>
                            
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-line rounded-md p-5 shadow-sm">
                                    <div>
                                        <div className="text-[11px] text-ink-soft mb-1">Total Harga</div>
                                        <div className="font-mono text-[16px] font-bold text-ink">{formatRupiah(o.total_harga)}</div>
                                    </div>
                                    <div className="border-l border-line pl-6">
                                        <div className="text-[11px] text-ink-soft mb-1">Terbayar (DP)</div>
                                        <div className="font-mono text-[16px] font-bold text-ink">{formatRupiah(o.dp)}</div>
                                    </div>
                                    <div className="border-l border-line pl-6">
                                        <div className="text-[11px] text-ink-soft mb-1">Sisa Pembayaran</div>
                                        <div className={`font-mono text-[16px] font-bold ${sisa > 0 ? 'text-danger' : 'text-danger'}`}>{formatRupiah(sisa)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1 flex flex-col h-full">
                        <div className="bg-panel rounded-md border border-line shadow-sm flex flex-col h-[600px]">
                            <div className="bg-line/20 px-5 py-4 border-b border-line flex items-center gap-2">
                                <ClockIcon className="w-5 h-5 text-ink-soft" />
                                <h2 className="font-oswald text-[16px] font-bold text-ink uppercase tracking-wide">
                                    Riwayat Produksi
                                </h2>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-5">
                                <div className="space-y-6">
                                    {o.orderLogs && o.orderLogs.length > 0 ? o.orderLogs.map((log, idx) => {
                                        const isStatusChange = log.status_lama !== log.status_baru;
                                        return (
                                            <div key={idx} className="relative pl-6 border-l border-line pb-2 last:border-0 last:pb-0">
                                                <div className="absolute -left-[10px] top-0 w-5 h-5 bg-panel rounded-full flex items-center justify-center">
                                                    {isStatusChange ? (
                                                        <CheckCircleIcon className="w-5 h-5 text-accent bg-white rounded-full" />
                                                    ) : (
                                                        <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-gold bg-white rounded-full" />
                                                    )}
                                                </div>
                                                
                                                <div className="flex justify-between items-start mb-1.5">
                                                    <div className="text-[12px] font-bold text-ink">
                                                        {isStatusChange ? `Status diubah ke ${STATUS_LABELS[log.status_baru]?.toUpperCase() || log.status_baru.toUpperCase()}` : 'Komentar Baru'}
                                                    </div>
                                                    <div className="text-[10px] text-ink-soft">
                                                        {new Date(log.created_at).toLocaleString('id-ID', { day:'numeric', month:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit' }).replace(/\./g, ':')}
                                                    </div>
                                                </div>
                                                
                                                <div className={`p-3 rounded border text-[13px] ${isStatusChange ? 'bg-bg border-line/50' : 'bg-bg border-gold/30'}`}>
                                                    <div className="font-bold mb-1">{log.user?.name || 'Sistem'}</div>
                                                    <div className="text-ink-soft">{log.catatan || 'Status order diperbarui.'}</div>
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <div className="text-center text-[13px] text-ink-soft py-10">
                                            Belum ada riwayat.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 border-t border-line bg-white mt-auto">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Tulis catatan riwayat..."
                                        className="flex-1 border-line rounded-md text-[13px] focus:ring-navy focus:border-navy"
                                    />
                                    <button className="bg-navy text-white font-bold text-[13px] px-4 py-2 rounded-md hover:bg-navy/90 transition-colors">
                                        Kirim
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)}>
                <form onSubmit={submitStatus} className="p-6">
                    <h2 className="text-lg font-medium font-oswald text-ink mb-4">Ubah Status Order</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-medium uppercase tracking-wider text-ink-soft mb-1.5">Status Baru</label>
                            <select
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                className="mt-2 block w-full rounded-md border-line py-2 text-[13px] text-ink focus:ring-navy focus:border-navy"
                            >
                                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-[11px] font-medium uppercase tracking-wider text-ink-soft mb-1.5">Catatan (Opsional)</label>
                            <textarea
                                value={data.catatan}
                                onChange={e => setData('catatan', e.target.value)}
                                rows={3}
                                className="mt-2 block w-full rounded-md border-line py-2 text-[13px] text-ink focus:ring-navy focus:border-navy"
                                placeholder="Tambahkan catatan mengapa status diubah..."
                            />
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsStatusModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>Simpan Status</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
