import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import Badge from '@/Components/Badge';
import CurrencyInput from '@/Components/CurrencyInput';

export default function Pembayaran({ pembayarans, orders }) {
    const fmtRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        order_id: '',
        jumlah: '',
        tanggal: new Date().toISOString().split('T')[0],
        metode: 'transfer',
        tipe: 'dp',
        catatan: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('keuangan.pembayaran.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    return (
        <AppLayout title="Pembayaran Masuk">
            <Head title="Pembayaran" />

            <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold">Daftar Pembayaran</h2>
                <button onClick={() => setShowModal(true)} className="bg-brand-600 text-white px-4 py-2 rounded">
                    + Catat Pembayaran
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-4">Tanggal</th>
                            <th className="p-4">Order</th>
                            <th className="p-4">Tipe & Metode</th>
                            <th className="p-4">Jumlah</th>
                            <th className="p-4">Pencatat</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pembayarans.data.map(p => (
                            <tr key={p.id} className="border-b">
                                <td className="p-4">{p.tanggal}</td>
                                <td className="p-4">#{p.order_id} - {p.order?.customer?.nama}</td>
                                <td className="p-4 uppercase">{p.tipe} - {p.metode}</td>
                                <td className="p-4 font-medium text-green-600">{fmtRupiah(p.jumlah)}</td>
                                <td className="p-4">{p.pencatat?.name}</td>
                                <td className="p-4 text-center">
                                    <a href={route('keuangan.pembayaran.kwitansi', p.id)} target="_blank" className="text-blue-600 hover:underline">
                                        Cetak Kwitansi
                                    </a>
                                </td>
                            </tr>
                        ))}
                        {pembayarans.data.length === 0 && (
                            <tr><td colSpan="6" className="p-4 text-center">Belum ada data pembayaran.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="lg">
                <div className="p-6">
                    <h3 className="text-lg font-bold mb-4">Catat Pembayaran</h3>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium">Pilih Order (Ada Piutang)</label>
                            <select 
                                className="w-full border-gray-300 rounded" 
                                value={data.order_id} 
                                onChange={e => setData('order_id', e.target.value)}
                                required
                            >
                                <option value="">-- Pilih Order --</option>
                                {orders.map(o => (
                                    <option key={o.id} value={o.id}>
                                        Order #{o.id} - {o.customer?.nama} (Sisa: {fmtRupiah(o.sisa_bayar)})
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block mb-1 text-sm font-medium">Jumlah (Rp)</label>
                            <CurrencyInput 
                                className="w-full border-gray-300 rounded" 
                                value={data.jumlah} 
                                onChange={e => setData('jumlah', e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium">Metode</label>
                                <select className="w-full border-gray-300 rounded" value={data.metode} onChange={e => setData('metode', e.target.value)}>
                                    <option value="transfer">Transfer</option>
                                    <option value="tunai">Tunai</option>
                                    <option value="lainnya">Lainnya</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium">Tipe</label>
                                <select className="w-full border-gray-300 rounded" value={data.tipe} onChange={e => setData('tipe', e.target.value)}>
                                    <option value="dp">DP</option>
                                    <option value="pelunasan">Pelunasan</option>
                                    <option value="lainnya">Lainnya</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Tanggal</label>
                            <input type="date" className="w-full border-gray-300 rounded" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)} required />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Catatan (Opsional)</label>
                            <textarea 
                                className="w-full border-gray-300 rounded" 
                                rows="2" 
                                value={data.catatan} 
                                onChange={e => setData('catatan', e.target.value)}
                                placeholder="Contoh: Pembayaran cicilan ke-2"
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded">Batal</button>
                            <button type="submit" disabled={processing} className="px-4 py-2 text-white bg-brand-600 rounded">Simpan</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AppLayout>
    );
}
