import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import StatusTimeline from '@/Components/StatusTimeline';
import EmptyState from '@/Components/EmptyState';
import { formatRupiah } from '@/utils';
import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { DocumentTextIcon, ChartBarSquareIcon, ClockIcon } from '@heroicons/react/24/outline';

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
    // Fallback if data is empty (for testing)
    const o = order.id ? order : {
        no_order: 'ORD-XXXX', status: 'draft', customer: { name: '-' },
        jenis_produk: '-', jumlah: 0, deadline: '-', total_harga: 0, dp: 0,
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

    return (
        <AppLayout title={`Detail Order`}>
            <div className="flex flex-col gap-6">
                
                {/* Header Card */}
                <Card>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h2 className="text-[22px] font-bold font-mono text-ink tracking-tight">{o.no_order}</h2>
                            <p className="text-[12px] text-ink-soft mt-1">Dibuat pada: {o.created_at ? new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge status={STATUS_SEMANTICS[o.status] || 'neutral'} className="text-[12px] px-3 py-1 mr-2">
                                {STATUS_LABELS[o.status] || o.status}
                            </Badge>
                            <a
                                href={route('orders.spk', o.id)}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded bg-navy px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:bg-navy/90 transition-colors"
                            >
                                Cetak SPK
                            </a>
                            <a
                                href={route('orders.invoice', o.id)}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded bg-accent px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:bg-accent/90 transition-colors"
                            >
                                Cetak Invoice
                            </a>
                            <button
                                onClick={() => setIsStatusModalOpen(true)}
                                className="rounded bg-white border border-line px-3 py-1.5 text-[12px] font-semibold text-ink shadow-sm hover:bg-line/20 transition-colors"
                            >
                                Ubah Status
                            </button>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column (Info) */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card title="Informasi Pesanan">
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                                <div>
                                    <dt className="text-[12px] font-medium text-ink-soft uppercase tracking-wider font-sans">Customer</dt>
                                    <dd className="mt-1.5 text-[14px] font-medium text-ink">{o.customer?.nama || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-[12px] font-medium text-ink-soft uppercase tracking-wider font-sans">Jenis Produk</dt>
                                    <dd className="mt-1.5 text-[14px] font-medium text-ink">{o.jenis_produk}</dd>
                                </div>
                                <div>
                                    <dt className="text-[12px] font-medium text-ink-soft uppercase tracking-wider font-sans">Jumlah / Deadline</dt>
                                    <dd className="mt-1.5 text-[14px] font-medium text-ink">{o.jumlah} pcs / {o.deadline ? new Date(o.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-[12px] font-medium text-ink-soft uppercase tracking-wider font-sans">Keuangan</dt>
                                    <dd className="mt-1.5 text-[14px] font-medium text-ink leading-relaxed">
                                        Total: {formatRupiah(o.total_harga)}<br/>
                                        DP: {formatRupiah(o.dp)}<br/>
                                        Sisa: {formatRupiah(o.total_harga - o.dp)}
                                    </dd>
                                </div>
                            </dl>
                        </Card>

                        <Card title="Detail Ukuran">
                            <div className="flex gap-3 flex-wrap mt-2">
                                {o.items && o.items.length > 0 ? o.items.map((item, idx) => (
                                    <div key={idx} className="border border-line rounded px-4 py-2 text-center min-w-[4rem] bg-panel">
                                        <div className="font-bold text-ink text-[14px]">{item.ukuran || 'Total'}</div>
                                        <div className="text-[12px] text-ink-soft mt-0.5">{item.jumlah_pcs} pcs</div>
                                    </div>
                                )) : (
                                    <div className="w-full">
                                        <EmptyState 
                                            title="Belum ada ukuran" 
                                            description="Tidak ada rincian ukuran untuk order ini." 
                                            icon={ChartBarSquareIcon} 
                                        />
                                    </div>
                                )}
                            </div>
                        </Card>
                        
                        <Card title="Progres Divisi">
                            <EmptyState 
                                title="Belum ada progres" 
                                description="Menunggu implementasi data progress lintas divisi." 
                                icon={ChartBarSquareIcon} 
                            />
                        </Card>
                    </div>

                    {/* Right Column (Timeline & Files) */}
                    <div className="space-y-6">
                        <Card title="Riwayat Status">
                            {o.orderLogs && o.orderLogs.length > 0 ? (
                                <StatusTimeline logs={o.orderLogs} />
                            ) : (
                                <EmptyState 
                                    title="Kosong" 
                                    description="Belum ada riwayat pergerakan status." 
                                    icon={ClockIcon} 
                                />
                            )}
                        </Card>

                        <Card title="File & Lampiran">
                            <EmptyState 
                                title="Belum ada file" 
                                description="Desain atau file pelengkap belum diunggah." 
                                icon={DocumentTextIcon} 
                            />
                        </Card>
                    </div>
                </div>
            </div>

            <Modal show={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)}>
                <form onSubmit={submitStatus} className="p-6">
                    <h2 className="text-lg font-medium font-oswald text-ink mb-4">Ubah Status Order</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium leading-6 text-ink">Status Baru</label>
                            <select
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 text-ink ring-1 ring-inset ring-line focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                            >
                                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium leading-6 text-ink">Catatan (Opsional)</label>
                            <textarea
                                value={data.catatan}
                                onChange={e => setData('catatan', e.target.value)}
                                rows={3}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 text-ink ring-1 ring-inset ring-line focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
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
