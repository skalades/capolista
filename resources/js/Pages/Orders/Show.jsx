import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import StatusTimeline from '@/Components/StatusTimeline';
import { formatRupiah } from '@/utils';
import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const STATUS_COLORS = {
    draft: 'gray', desain: 'blue', procurement: 'yellow',
    cutting: 'lime', jahit: 'cyan', produksi: 'orange', printing: 'purple', pemasangan: 'pink',
    packing: 'teal', dikirim: 'indigo', selesai: 'green'
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
        <AppLayout title={`Detail Order: ${o.no_order}`}>
            <div className="flex flex-col gap-6">
                
                {/* Header Card */}
                <Card>
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{o.no_order}</h2>
                            <p className="text-sm text-gray-500 mt-1">Dibuat pada: {o.created_at ? new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge color={STATUS_COLORS[o.status] || 'gray'} className="text-sm px-3 py-1">
                                {STATUS_LABELS[o.status] || o.status}
                            </Badge>
                            <a
                                href={route('orders.spk', o.id)}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded bg-white px-2 py-1 text-xs font-semibold text-brand-600 shadow-sm ring-1 ring-inset ring-brand-300 hover:bg-brand-50"
                            >
                                Cetak SPK
                            </a>
                            <a
                                href={route('orders.invoice', o.id)}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded bg-white px-2 py-1 text-xs font-semibold text-green-600 shadow-sm ring-1 ring-inset ring-green-300 hover:bg-green-50"
                            >
                                Cetak Invoice
                            </a>
                            <button
                                onClick={() => setIsStatusModalOpen(true)}
                                className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
                                    <dt className="text-sm font-medium text-gray-500">Customer</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{o.customer?.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Jenis Produk</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{o.jenis_produk}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Jumlah / Deadline</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{o.jumlah} pcs / {o.deadline ? new Date(o.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Keuangan</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        Total: {formatRupiah(o.total_harga)}<br/>
                                        DP: {formatRupiah(o.dp)}<br/>
                                        Sisa: {formatRupiah(o.total_harga - o.dp)}
                                    </dd>
                                </div>
                            </dl>
                        </Card>

                        <Card title="Detail Ukuran">
                            <div className="flex gap-4 flex-wrap">
                                {o.items && o.items.map((item, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded px-4 py-2 text-center min-w-[4rem]">
                                        <div className="font-bold text-gray-900">{item.ukuran || 'Total'}</div>
                                        <div className="text-sm text-gray-500">{item.jumlah_pcs}</div>
                                    </div>
                                ))}
                                {(!o.items || o.items.length === 0) && (
                                    <div className="text-sm text-gray-500">Tidak ada detail ukuran.</div>
                                )}
                            </div>
                        </Card>
                        
                        <Card title="Progres Divisi">
                            <div className="text-sm text-gray-500 py-4 text-center">
                                Menunggu implementasi data progress divisi.
                            </div>
                        </Card>
                    </div>

                    {/* Right Column (Timeline & Files) */}
                    <div className="space-y-6">
                        <Card title="Riwayat Status">
                            <StatusTimeline logs={o.orderLogs} />
                        </Card>

                        <Card title="File & Lampiran">
                            <div className="text-sm text-gray-500 py-4 text-center">
                                Belum ada file yang diunggah.
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <Modal show={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)}>
                <form onSubmit={submitStatus} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Ubah Status Order</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Status Baru</label>
                            <select
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
                            >
                                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Catatan (Opsional)</label>
                            <textarea
                                value={data.catatan}
                                onChange={e => setData('catatan', e.target.value)}
                                rows={3}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
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
