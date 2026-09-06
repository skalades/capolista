import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import CurrencyInput from '@/Components/CurrencyInput';
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
                // Optional: set 'satuan' if you know it
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
        <AppLayout
            title="Buat Purchase Order Baru"
        >
            

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <TextInputLabel htmlFor="supplier_id" value="Supplier"  />
                                    <select 
                                        id="supplier_id" 
                                        className="w-full border-gray-300 rounded-md shadow-sm"
                                        value={data.supplier_id}
                                        onChange={e => setData('supplier_id', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Pilih Supplier --</option>
                                        {suppliers.map(sup => (
                                            <option key={sup.id} value={sup.id}>{sup.nama}</option>
                                        ))}
                                    </select>
                                    {errors.supplier_id && <p className="text-red-500 text-sm">{errors.supplier_id}</p>}
                                </div>
                                <div>
                                    <TextInputLabel htmlFor="tanggal_po" value="Tanggal PO"  />
                                    <Input
                                        type="date"
                                        id="tanggal_po"
                                        value={data.tanggal_po}
                                        onChange={e => setData('tanggal_po', e.target.value)}
                                        required
                                    />
                                    {errors.tanggal_po && <p className="text-red-500 text-sm">{errors.tanggal_po}</p>}
                                </div>
                            </div>

                            <div>
                                <TextInputLabel htmlFor="catatan" value="Catatan / Keterangan"  />
                                <Textarea
                                    id="catatan"
                                    value={data.catatan}
                                    onChange={e => setData('catatan', e.target.value)}
                                />
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg">Item Barang</h3>
                                    <SecondaryButton type="button" size="sm" onClick={addItem}>
                                        <PlusIcon className="w-4 h-4 mr-2" /> Tambah Item
                                    </SecondaryButton>
                                </div>

                                {data.items.map((item, index) => (
                                    <div key={index} className="flex flex-wrap md:flex-nowrap gap-4 items-end mb-4 border p-4 rounded bg-gray-50">
                                        
                                        <div className="w-full md:w-1/4">
                                            <TextInputLabel value="Pilih Bahan (Opsional)"  />
                                            <select 
                                                className="w-full border-gray-300 rounded-md shadow-sm text-sm"
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
                                            <TextInputLabel value="Nama Bahan"  />
                                            <Input 
                                                value={item.nama_bahan} 
                                                onChange={e => handleItemChange(index, 'nama_bahan', e.target.value)} 
                                                required 
                                            />
                                        </div>

                                        <div className="w-full md:w-1/6">
                                            <TextInputLabel value="Jumlah"  />
                                            <Input 
                                                type="number" 
                                                step="0.01" 
                                                min="0.01"
                                                value={item.jumlah} 
                                                onChange={e => handleItemChange(index, 'jumlah', e.target.value)} 
                                                required 
                                            />
                                        </div>

                                        <div className="w-full md:w-1/6">
                                            <TextInputLabel value="Satuan"  />
                                            <Input 
                                                value={item.satuan} 
                                                onChange={e => handleItemChange(index, 'satuan', e.target.value)} 
                                                required 
                                            />
                                        </div>

                                        <div className="w-full md:w-1/4">
                                            <TextInputLabel value="Harga Satuan"  />
                                            <CurrencyInput 
                                                className="border rounded px-3 py-2 w-full"
                                                min="0"
                                                value={item.harga_satuan} 
                                                onChange={e => handleItemChange(index, 'harga_satuan', e.target.value)} 
                                                required 
                                            />
                                        </div>
                                        
                                        <div>
                                            <DangerButton type="button" size="icon" onClick={() => removeItem(index)} disabled={data.items.length === 1}>
                                                <TrashIcon className="w-4 h-4" />
                                            </DangerButton>
                                        </div>
                                    </div>
                                ))}
                                {errors.items && <p className="text-red-500 text-sm">Pastikan semua item terisi dengan benar.</p>}
                            </div>

                            <div className="flex justify-between items-center border-t pt-4">
                                <div className="text-xl font-bold">
                                    Total Harga: Rp {totalHarga.toLocaleString()}
                                </div>
                                <PrimaryButton type="submit" disabled={processing} className="bg-brand-600 hover:bg-brand-700">
                                    Simpan Purchase Order
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
