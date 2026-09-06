import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import Card from '@/Components/Card';

export default function Show({ order }) {
    const defaultSizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];
    
    // Parse order items to expected sizes, fallback to default sizes
    let expectedSizes = {};
    if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
            if (item.ukuran) expectedSizes[item.ukuran] = item.jumlah_pcs;
        });
    } else {
        expectedSizes = order.ukuran_detail || {};
    }
    const sizeKeys = Object.keys(expectedSizes).length > 0 ? Object.keys(expectedSizes) : defaultSizes;

    // Initialize form with existing data or defaults
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

    // calculate totals
    const expectedTotal = order.jumlah;
    const currentTotal = Object.values(data.pcs_per_ukuran).reduce((a, b) => a + (parseInt(b) || 0), 0);

    return (
        <AppLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Cutting: {order.no_order}</h2>}>
            <Head title={`Cutting - ${order.no_order}`} />

            <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Order Info */}
                    <div className="md:col-span-1 space-y-6">
                        <Card title="Informasi Pesanan">
                            <dl className="space-y-3 text-sm">
                                <div>
                                    <dt className="text-gray-500 font-medium">Customer</dt>
                                    <dd className="font-semibold">{order.customer?.nama}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 font-medium">Produk & Jumlah</dt>
                                    <dd>{order.jenis_produk} ({order.jumlah} pcs)</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 font-medium">Deadline</dt>
                                    <dd className="text-red-600 font-bold">{order.deadline ? new Date(order.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</dd>
                                </div>
                                {order.catatan_produksi && (
                                    <div>
                                        <dt className="text-gray-500 font-medium">Catatan Produksi</dt>
                                        <dd className="bg-yellow-50 p-2 rounded text-yellow-800 text-xs mt-1">
                                            {order.catatan_produksi}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </Card>

                        {/* Breakdown Req */}
                        <Card title="Target Ukuran (SPK)">
                            <ul className="divide-y divide-gray-200 text-sm">
                                {Object.entries(expectedSizes).map(([size, qty]) => (
                                    <li key={size} className="py-2 flex justify-between">
                                        <span className="font-bold">{size}</span>
                                        <span>{qty} pcs</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>

                    {/* Update Form */}
                    <div className="md:col-span-2">
                        <Card title="Input Hasil Potong & QC">
                            <form onSubmit={handleUpdate} className="space-y-6 mt-4">
                                
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-3 border-b pb-2">Output Potongan per Ukuran</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        {sizeKeys.map(size => (
                                            <div key={size}>
                                                <label className="block text-xs text-gray-500 font-bold mb-1">{size}</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={data.pcs_per_ukuran[size] || ''}
                                                    onChange={e => handlePcsChange(size, e.target.value)}
                                                    className="w-full border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 p-3 bg-gray-50 rounded-md flex justify-between items-center">
                                        <span className="font-bold text-gray-700">Total Potongan:</span>
                                        <span className={`font-bold text-lg ${currentTotal < expectedTotal ? 'text-red-600' : 'text-green-600'}`}>
                                            {currentTotal} / {expectedTotal} pcs
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-700 mb-3 border-b pb-2">Checklist QC</h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center">
                                            <input type="checkbox" checked={data.qc_akurasi_ukuran} onChange={e => setData('qc_akurasi_ukuran', e.target.checked)} className="rounded border-gray-300 text-brand-600 shadow-sm focus:ring-brand-500" />
                                            <span className="ml-2 text-sm text-gray-600">Akurasi pola/ukuran sesuai SPK</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" checked={data.qc_arah_kain} onChange={e => setData('qc_arah_kain', e.target.checked)} className="rounded border-gray-300 text-brand-600 shadow-sm focus:ring-brand-500" />
                                            <span className="ml-2 text-sm text-gray-600">Arah serat kain / motif benar</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" checked={data.qc_tidak_cacat} onChange={e => setData('qc_tidak_cacat', e.target.checked)} className="rounded border-gray-300 text-brand-600 shadow-sm focus:ring-brand-500" />
                                            <span className="ml-2 text-sm text-gray-600">Tidak ada cacat kain (bolong, noda)</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Catatan QC</label>
                                    <textarea
                                        value={data.catatan_qc}
                                        onChange={e => setData('catatan_qc', e.target.value)}
                                        rows={2}
                                        className="mt-1 block w-full border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm"
                                    />
                                </div>

                                <div className="flex justify-end pt-4 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                                    >
                                        Simpan Progress
                                    </button>
                                </div>
                            </form>
                        </Card>

                        <div className="mt-6 flex justify-between bg-white p-6 rounded-lg border border-gray-200 shadow-sm items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Selesai Cutting</h3>
                                <p className="text-sm text-gray-500">Tandai selesai dan oper ke divisi Jahit.</p>
                            </div>
                            <button
                                onClick={handleComplete}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                            >
                                Selesai & Lanjut Jahit
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
