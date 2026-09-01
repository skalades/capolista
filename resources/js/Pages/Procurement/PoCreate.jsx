import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Trash2, Plus } from 'lucide-react';

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
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Buat Purchase Order Baru</h2>}
        >
            <Head title="Buat PO" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="supplier_id">Supplier</Label>
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
                                    <Label htmlFor="tanggal_po">Tanggal PO</Label>
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
                                <Label htmlFor="catatan">Catatan / Keterangan</Label>
                                <Textarea
                                    id="catatan"
                                    value={data.catatan}
                                    onChange={e => setData('catatan', e.target.value)}
                                />
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg">Item Barang</h3>
                                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                        <Plus className="w-4 h-4 mr-2" /> Tambah Item
                                    </Button>
                                </div>

                                {data.items.map((item, index) => (
                                    <div key={index} className="flex flex-wrap md:flex-nowrap gap-4 items-end mb-4 border p-4 rounded bg-gray-50">
                                        
                                        <div className="w-full md:w-1/4">
                                            <Label>Pilih Bahan (Opsional)</Label>
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
                                            <Label>Nama Bahan</Label>
                                            <Input 
                                                value={item.nama_bahan} 
                                                onChange={e => handleItemChange(index, 'nama_bahan', e.target.value)} 
                                                required 
                                            />
                                        </div>

                                        <div className="w-full md:w-1/6">
                                            <Label>Jumlah</Label>
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
                                            <Label>Satuan</Label>
                                            <Input 
                                                value={item.satuan} 
                                                onChange={e => handleItemChange(index, 'satuan', e.target.value)} 
                                                required 
                                            />
                                        </div>

                                        <div className="w-full md:w-1/4">
                                            <Label>Harga Satuan</Label>
                                            <Input 
                                                type="number" 
                                                min="0"
                                                value={item.harga_satuan} 
                                                onChange={e => handleItemChange(index, 'harga_satuan', e.target.value)} 
                                                required 
                                            />
                                        </div>
                                        
                                        <div>
                                            <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)} disabled={data.items.length === 1}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {errors.items && <p className="text-red-500 text-sm">Pastikan semua item terisi dengan benar.</p>}
                            </div>

                            <div className="flex justify-between items-center border-t pt-4">
                                <div className="text-xl font-bold">
                                    Total Harga: Rp {totalHarga.toLocaleString()}
                                </div>
                                <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                    Simpan Purchase Order
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
