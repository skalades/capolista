import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import CurrencyInput from '@/Components/CurrencyInput';
import Card from '@/Components/Card';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function PoCreate({ auth, suppliers, stokBahans }) {
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        tanggal_po: new Date().toISOString().split('T')[0],
        catatan: '',
        items: [
            { bahan_id: '', nama_bahan: '', jumlah: 1, satuan: 'pcs', harga_satuan: 0 }
        ]
    });

    const addItem = () => {
        setData('items', [
            ...data.items, 
            { bahan_id: '', nama_bahan: '', jumlah: 1, satuan: 'pcs', harga_satuan: 0 }
        ]);
    };

    const removeItem = (index) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        
        // If selecting a known material, auto fill name
        if (field === 'bahan_id' && value) {
            const bahan = stokBahans.find(b => b.id.toString() === value.toString());
            if (bahan) {
                newItems[index]['nama_bahan'] = bahan.nama_bahan || bahan.nama || '';
            }
        }
        
        setData('items', newItems);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('procurement.po.store'));
    };

    const totalHarga = data.items.reduce((acc, item) => acc + (parseFloat(item.jumlah || 0) * parseFloat(item.harga_satuan || 0)), 0);

    return (
        <AppLayout title="Buat Purchase Order Baru">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="mb-6">
                    <h2 className="text-[24px] font-oswald font-bold text-ink">Buat Purchase Order Baru</h2>
                </div>

                <Card>
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="supplier_id" value="Supplier"  />
                                <select 
                                    id="supplier_id" 
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-ink ring-1 ring-inset ring-line focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                    value={data.supplier_id}
                                    onChange={e => setData('supplier_id', e.target.value)}
                                    required
                                >
                                    <option value="">-- Pilih Supplier --</option>
                                    {suppliers.map(sup => (
                                        <option key={sup.id} value={sup.id}>{sup.nama}</option>
                                    ))}
                                </select>
                                {errors.supplier_id && <InputError message={errors.supplier_id} className="mt-1" />}
                            </div>
                            <div>
                                <InputLabel htmlFor="tanggal_po" value="Tanggal PO"  />
                                <TextInput
                                    type="date"
                                    id="tanggal_po"
                                    className="block w-full mt-1"
                                    value={data.tanggal_po}
                                    onChange={e => setData('tanggal_po', e.target.value)}
                                    required
                                />
                                {errors.tanggal_po && <InputError message={errors.tanggal_po} className="mt-1" />}
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="catatan" value="Catatan / Keterangan"  />
                            <textarea
                                id="catatan"
                                rows={3}
                                className="mt-1 block w-full rounded-md border-0 py-1.5 text-ink ring-1 ring-inset ring-line focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                value={data.catatan}
                                onChange={e => setData('catatan', e.target.value)}
                            />
                        </div>

                        <div className="border-t border-line/30 pt-4 mt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-oswald text-[18px] font-bold text-ink">Item Barang</h3>
                                <button type="button" onClick={addItem} className="inline-flex items-center text-[12px] font-medium text-navy hover:text-navy/70">
                                    <PlusIcon className="w-4 h-4 mr-1" /> Tambah Item
                                </button>
                            </div>

                            {data.items.map((item, index) => (
                                <div key={index} className="flex flex-wrap md:flex-nowrap gap-4 items-end mb-4 border border-line p-4 rounded bg-line/10">
                                    <div className="w-full md:w-1/4">
                                        <InputLabel value="Pilih Bahan (Opsional)"  />
                                        <select 
                                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-ink ring-1 ring-inset ring-line focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                            value={item.bahan_id}
                                            onChange={e => handleItemChange(index, 'bahan_id', e.target.value)}
                                        >
                                            <option value="">-- Manual --</option>
                                            {stokBahans.map(b => (
                                                <option key={b.id} value={b.id}>{b.nama_bahan || b.nama}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-full md:w-1/4">
                                        <InputLabel value="Nama Bahan"  />
                                        <TextInput 
                                            className="block w-full mt-1"
                                            value={item.nama_bahan} 
                                            onChange={e => handleItemChange(index, 'nama_bahan', e.target.value)} 
                                            required 
                                        />
                                    </div>

                                    <div className="w-full md:w-1/6">
                                        <InputLabel value="Jumlah"  />
                                        <TextInput 
                                            type="number" 
                                            step="0.01" 
                                            min="0.01"
                                            className="block w-full mt-1"
                                            value={item.jumlah} 
                                            onChange={e => handleItemChange(index, 'jumlah', e.target.value)} 
                                            required 
                                        />
                                    </div>

                                    <div className="w-full md:w-1/6">
                                        <InputLabel value="Satuan"  />
                                        <TextInput 
                                            className="block w-full mt-1"
                                            value={item.satuan} 
                                            onChange={e => handleItemChange(index, 'satuan', e.target.value)} 
                                            required 
                                        />
                                    </div>

                                    <div className="w-full md:w-1/4">
                                        <InputLabel value="Harga Satuan"  />
                                        <CurrencyInput 
                                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-ink ring-1 ring-inset ring-line focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                            min="0"
                                            value={item.harga_satuan} 
                                            onChange={e => handleItemChange(index, 'harga_satuan', e.target.value)} 
                                            required 
                                        />
                                    </div>
                                    
                                    <div>
                                        <button type="button" onClick={() => removeItem(index)} disabled={data.items.length === 1} className="p-2 text-danger hover:bg-danger/10 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {errors.items && <InputError message="Pastikan semua item terisi dengan benar." className="mt-1" />}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-line/30 pt-6 mt-6">
                            <div className="text-[18px] font-bold font-oswald text-ink mb-4 sm:mb-0">
                                Total Harga: Rp {totalHarga.toLocaleString('id-ID')}
                            </div>
                            <PrimaryButton type="submit" disabled={processing}>
                                Simpan Purchase Order
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
