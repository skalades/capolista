import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Pengeluaran({ pengeluarans }) {
    const fmtRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        tanggal: new Date().toISOString().split('T')[0],
        kategori: 'operasional',
        deskripsi: '',
        jumlah: '',
        order_id: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('keuangan.pengeluaran.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    return (
        <AppLayout title="Pengeluaran">
            <Head title="Pengeluaran" />

            <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold">Daftar Pengeluaran</h2>
                <button onClick={() => setShowModal(true)} className="bg-red-600 text-white px-4 py-2 rounded">
                    + Catat Pengeluaran
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-4">Tanggal</th>
                            <th className="p-4">Kategori</th>
                            <th className="p-4">Deskripsi</th>
                            <th className="p-4">Jumlah</th>
                            <th className="p-4">Pencatat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pengeluarans.data.map(p => (
                            <tr key={p.id} className="border-b">
                                <td className="p-4">{p.tanggal}</td>
                                <td className="p-4 uppercase">{p.kategori.replace('_', ' ')}</td>
                                <td className="p-4">{p.deskripsi} {p.order_id ? `(Order #${p.order_id})` : ''}</td>
                                <td className="p-4 font-medium text-red-600">{fmtRupiah(p.jumlah)}</td>
                                <td className="p-4">{p.pencatat?.name}</td>
                            </tr>
                        ))}
                        {pengeluarans.data.length === 0 && (
                            <tr><td colSpan="5" className="p-4 text-center">Belum ada data pengeluaran.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <h3 className="text-lg font-bold mb-4">Catat Pengeluaran</h3>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium">Kategori</label>
                                <select className="w-full border-gray-300 rounded" value={data.kategori} onChange={e => setData('kategori', e.target.value)}>
                                    <option value="operasional">Operasional</option>
                                    <option value="bahan_baku">Bahan Baku</option>
                                    <option value="lainnya">Lainnya</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block mb-1 text-sm font-medium">Deskripsi</label>
                                <input type="text" className="w-full border-gray-300 rounded" value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} required />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Jumlah (Rp)</label>
                                <input type="number" className="w-full border-gray-300 rounded" value={data.jumlah} onChange={e => setData('jumlah', e.target.value)} required />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Order Terkait (Opsional)</label>
                                <input type="number" className="w-full border-gray-300 rounded" placeholder="ID Order" value={data.order_id} onChange={e => setData('order_id', e.target.value)} />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Tanggal</label>
                                <input type="date" className="w-full border-gray-300 rounded" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)} required />
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded">Batal</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 text-white bg-red-600 rounded">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
