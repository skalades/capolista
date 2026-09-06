import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Badge from '@/Components/Badge';

export default function Show({ order }) {
    const defaultSizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];
    
    let expectedSizes = {};
    if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
            if (item.ukuran) expectedSizes[item.ukuran] = item.jumlah_pcs;
        });
    } else {
        expectedSizes = order.ukuran_detail || {};
    }
    const sizeKeys = Object.keys(expectedSizes).length > 0 ? Object.keys(expectedSizes) : defaultSizes;

    const initialPcs = {};
    sizeKeys.forEach(size => {
        initialPcs[size] = order.cutting?.pcs_per_ukuran?.[size] || 0;
    });

    const { data, setData, patch, post, processing, errors } = useForm({
        pcs_per_ukuran: initialPcs,
        qc_akurasi_ukuran: order.cutting?.qc_akurasi_ukuran || false,
        qc_arah_kain: order.cutting?.qc_arah_kain || false,
        qc_tidak_cacat: order.cutting?.qc_tidak_cacat || false,
        catatan_qc: order.cutting?.catatan_qc || '',
        catatan: order.cutting?.catatan || '',
    });

    const handlePcsChange = (size, value) => {
        setData('pcs_per_ukuran', {
            ...data.pcs_per_ukuran,
            [size]: parseInt(value) || 0
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        patch(route('cutting.update', order.id), {
            preserveScroll: true
        });
    };

    const [completeForm, setCompleteForm] = useState({ catatan: '' });
    
    const handleComplete = (e) => {
        e.preventDefault();
        if (confirm('Selesaikan proses cutting dan lanjut ke Jahit?')) {
            router.post(route('cutting.complete', order.id), completeForm);
        }
    };

    const expectedTotal = order.jumlah;
    const currentTotal = Object.values(data.pcs_per_ukuran).reduce((a, b) => a + (parseInt(b) || 0), 0);

    return (
        <AppLayout title={`Detail Cutting: ${order.no_order}`}>
            <div className="max-w-7xl mx-auto space-y-6">
                
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <Link href={route('cutting.index')} className="text-ink-soft hover:text-navy text-[12px] mb-2 inline-block">
                            &larr; Kembali ke Antrean
                        </Link>
                        <h2 className="text-[24px] font-oswald font-bold text-ink flex items-center gap-3">
                            {order.no_order}
                            <Badge status="accent">Cutting</Badge>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Col: Order Info */}
                    <div className="md:col-span-1 space-y-6">
                        <Card title="Informasi Pesanan">
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-[11px] font-bold text-ink-soft uppercase tracking-wider mb-1">Customer</dt>
                                    <dd className="text-[14px] font-bold text-ink">{order.customer?.nama}</dd>
                                </div>
                                <div>
                                    <dt className="text-[11px] font-bold text-ink-soft uppercase tracking-wider mb-1">Produk & Jumlah</dt>
                                    <dd className="text-[13px] text-ink">{order.jenis_produk} <span className="font-bold">({order.jumlah} pcs)</span></dd>
                                </div>
                                <div>
                                    <dt className="text-[11px] font-bold text-ink-soft uppercase tracking-wider mb-1">Deadline</dt>
                                    <dd className="text-[13px] text-danger font-bold">
                                        {order.deadline ? new Date(order.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                    </dd>
                                </div>
                                {order.catatan_produksi && (
                                    <div>
                                        <dt className="text-[11px] font-bold text-ink-soft uppercase tracking-wider mb-1">Catatan Produksi</dt>
                                        <dd className="bg-gold/10 p-3 border border-gold/30 rounded text-[12px] text-gold mt-1 leading-relaxed">
                                            {order.catatan_produksi}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </Card>

                        <Card title="Target Ukuran (SPK)">
                            <ul className="divide-y divide-line text-[13px]">
                                {Object.entries(expectedSizes).map(([size, qty]) => (
                                    <li key={size} className="py-2.5 flex justify-between">
                                        <span className="font-bold text-ink">{size}</span>
                                        <span className="text-ink-soft">{qty} pcs</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>

                    {/* Right Col: Input & QC */}
                    <div className="md:col-span-2 space-y-6">
                        <Card title="Input Hasil Potong & QC">
                            <form onSubmit={handleUpdate} className="mt-2 space-y-8">
                                
                                <div>
                                    <h4 className="text-[12px] font-bold text-ink-soft uppercase tracking-wider mb-4 border-b border-line pb-2">Output Potongan per Ukuran</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        {sizeKeys.map(size => (
                                            <div key={size}>
                                                <label className="block text-[13px] font-bold text-ink mb-1">{size}</label>
                                                <TextInput
                                                    type="number"
                                                    min="0"
                                                    value={data.pcs_per_ukuran[size] || ''}
                                                    onChange={e => handlePcsChange(size, e.target.value)}
                                                    className="w-full text-center"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 p-4 bg-line/20 rounded-lg flex justify-between items-center border border-line">
                                        <span className="font-bold text-[13px] text-ink">Total Potongan:</span>
                                        <span className={`font-mono font-bold text-[18px] ${currentTotal < expectedTotal ? 'text-danger' : 'text-accent'}`}>
                                            {currentTotal} / {expectedTotal} pcs
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[12px] font-bold text-ink-soft uppercase tracking-wider mb-4 border-b border-line pb-2">Checklist QC</h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center cursor-pointer">
                                            <input type="checkbox" checked={data.qc_akurasi_ukuran} onChange={e => setData('qc_akurasi_ukuran', e.target.checked)} className="rounded border-line text-navy focus:ring-navy form-checkbox" />
                                            <span className="ml-3 text-[13px] text-ink">Akurasi pola/ukuran sesuai SPK</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input type="checkbox" checked={data.qc_arah_kain} onChange={e => setData('qc_arah_kain', e.target.checked)} className="rounded border-line text-navy focus:ring-navy form-checkbox" />
                                            <span className="ml-3 text-[13px] text-ink">Arah serat kain / motif benar</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input type="checkbox" checked={data.qc_tidak_cacat} onChange={e => setData('qc_tidak_cacat', e.target.checked)} className="rounded border-line text-navy focus:ring-navy form-checkbox" />
                                            <span className="ml-3 text-[13px] text-ink">Tidak ada cacat kain (bolong, noda)</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[12px] font-bold text-ink-soft uppercase tracking-wider mb-2">Catatan QC (Opsional)</label>
                                    <textarea
                                        value={data.catatan_qc}
                                        onChange={e => setData('catatan_qc', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full bg-panel border-line focus:border-navy focus:ring-navy rounded text-[13px]"
                                    />
                                </div>

                                <div className="flex justify-end pt-4 border-t border-line">
                                    <PrimaryButton type="submit" disabled={processing}>
                                        Simpan Progress
                                    </PrimaryButton>
                                </div>
                            </form>
                        </Card>

                        <div className="flex justify-between bg-panel p-6 rounded border border-line items-center">
                            <div>
                                <h3 className="text-[18px] font-oswald font-bold text-ink">Selesai Cutting</h3>
                                <p className="text-[13px] text-ink-soft">Tandai selesai dan oper ke divisi Jahit.</p>
                            </div>
                            <PrimaryButton
                                onClick={handleComplete}
                                className="bg-accent hover:bg-accent/90 border-transparent text-white"
                            >
                                Selesai & Lanjut Jahit
                            </PrimaryButton>
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
