import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import { useForm, Link } from '@inertiajs/react';
import { PlusIcon } from '@heroicons/react/20/solid';

export default function OrderEdit({ order, customers = [] }) {
    const defaultUkuran = { S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0 };
    
    // Group order items by jenis_produk to build the initial repeater items
    const initialItems = [];
    if (order?.items && order.items.length > 0) {
        const grouped = order.items.reduce((acc, item) => {
            const key = item.jenis_produk + '_' + (item.harga_satuan || '0');
            if (!acc[key]) {
                acc[key] = {
                    jenis_produk: item.jenis_produk,
                    ukuran_detail: { ...defaultUkuran },
                    jumlah: 0,
                    harga_satuan: item.harga_satuan ? parseInt(item.harga_satuan, 10).toString() : ''
                };
            }
            if (item.ukuran) {
                acc[key].ukuran_detail[item.ukuran] = item.jumlah_pcs;
            }
            acc[key].jumlah += item.jumlah_pcs;
            return acc;
        }, {});
        initialItems.push(...Object.values(grouped));
    } else {
        initialItems.push({ jenis_produk: order?.jenis_produk || '', ukuran_detail: { ...defaultUkuran }, jumlah: order?.jumlah || 0, harga_satuan: '' });
    }

    const { data, setData, put, processing, errors } = useForm({
        customer_id: order?.customer_id || '',
        items: initialItems,
        jumlah: order?.jumlah || '',
        tanggal_order: order?.tanggal_order || '',
        deadline: order?.deadline || '',
        total_harga: order?.total_harga ? parseInt(order.total_harga, 10) : '',
        dp: order?.dp !== undefined && order?.dp !== null ? parseInt(order.dp, 10) : '',
        catatan_desain: order?.catatan_desain || '',
        catatan: order?.catatan || '',
    });

    const handleUkuranChange = (index, size, value) => {
        const parsed = parseInt(value);
        const newItems = [...data.items];
        newItems[index].ukuran_detail = {
            ...newItems[index].ukuran_detail,
            [size]: isNaN(parsed) ? '' : parsed
        };
        
        let itemTotal = 0;
        Object.values(newItems[index].ukuran_detail).forEach(val => {
            itemTotal += parseInt(val) || 0;
        });
        newItems[index].jumlah = itemTotal;
        
        let allTotal = 0;
        let totalHarga = 0;
        newItems.forEach(item => {
            allTotal += item.jumlah;
            const harga = parseInt((item.harga_satuan || '').toString().replace(/\D/g, '')) || 0;
            totalHarga += (item.jumlah * harga);
        });

        setData(d => ({ 
            ...d, 
            items: newItems, 
            jumlah: allTotal,
            total_harga: totalHarga > 0 ? totalHarga.toString() : d.total_harga
        }));
    };

    const handleJenisProdukChange = (index, value) => {
        const newItems = [...data.items];
        newItems[index].jenis_produk = value;
        setData('items', newItems);
    };

    const handleItemHargaChange = (index, value) => {
        const newItems = [...data.items];
        const numericValue = value.replace(/\D/g, '');
        newItems[index].harga_satuan = numericValue;
        
        let totalHarga = 0;
        newItems.forEach(item => {
            const harga = parseInt((item.harga_satuan || '').toString().replace(/\D/g, '')) || 0;
            totalHarga += (item.jumlah * harga);
        });
        
        setData(d => ({ 
            ...d, 
            items: newItems,
            total_harga: totalHarga > 0 ? totalHarga.toString() : d.total_harga
        }));
    };

    const addItem = () => {
        setData('items', [
            ...data.items, 
            { jenis_produk: '', ukuran_detail: { ...defaultUkuran }, jumlah: 0, harga_satuan: '' }
        ]);
    };

    const removeItem = (index) => {
        if (data.items.length > 1) {
            const newItems = data.items.filter((_, i) => i !== index);
            let allTotal = 0;
            let totalHarga = 0;
            newItems.forEach(item => {
                allTotal += item.jumlah;
                const harga = parseInt((item.harga_satuan || '').toString().replace(/\D/g, '')) || 0;
                totalHarga += (item.jumlah * harga);
            });
            setData(d => ({ 
                ...d, 
                items: newItems, 
                jumlah: allTotal,
                total_harga: totalHarga > 0 ? totalHarga.toString() : d.total_harga
            }));
        }
    };

    const formatRupiahInput = (value) => {
        if (!value) return '';
        const number = parseInt(value.toString().replace(/\D/g, ''), 10);
        return isNaN(number) ? '' : number.toLocaleString('id-ID');
    };

    const handleNumberChange = (field, value) => {
        const numericValue = value.replace(/\D/g, '');
        setData(field, numericValue);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('orders.update', order.id));
    };

    return (
        <AppLayout title={`Edit Order: ${order?.no_order}`}>
            <Card>
                <form onSubmit={submit} className="space-y-6">
                    {/* Reusing the same form structure as Create.jsx */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Customer</label>
                                <div className="mt-2 flex gap-2">
                                    <select
                                        value={data.customer_id}
                                        onChange={e => setData('customer_id', e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
                                    >
                                        <option value="">Pilih Customer</option>
                                        {customers.map(c => (
                                            <option key={c.id} value={c.id}>{c.nama}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.customer_id && <p className="mt-2 text-sm text-red-600">{errors.customer_id}</p>}
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium leading-6 text-gray-900">Produk & Ukuran</label>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="text-xs font-semibold text-brand-600 hover:text-brand-500"
                                    >
                                        + Tambah Produk
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {data.items.map((item, index) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-md relative">
                                            {data.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="absolute top-2 right-2 text-xs text-red-600 hover:text-red-800"
                                                >
                                                    Hapus
                                                </button>
                                            )}
                                            
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Jenis Produk #{index + 1}</label>
                                                    <input
                                                        type="text"
                                                        value={item.jenis_produk}
                                                        onChange={e => handleJenisProdukChange(index, e.target.value)}
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Harga Satuan</label>
                                                    <input
                                                        type="text"
                                                        value={formatRupiahInput(item.harga_satuan)}
                                                        onChange={e => handleItemHargaChange(index, e.target.value)}
                                                        placeholder="Contoh: 100.000"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-2">Detail Ukuran</label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {Object.keys(item.ukuran_detail).map(size => (
                                                        <div key={size} className="flex items-center gap-2">
                                                            <span className="w-8 text-xs font-medium text-gray-500">{size}</span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={item.ukuran_detail[size] || ''}
                                                                onChange={e => handleUkuranChange(index, size, e.target.value)}
                                                                className="block w-full rounded-md border-0 py-1 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-4 flex justify-between text-sm font-semibold text-gray-900">
                                    <span>Total Jumlah Pcs:</span>
                                    <span>{data.jumlah}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium leading-6 text-gray-900">Tanggal Order</label>
                                    <input
                                        type="date"
                                        value={data.tanggal_order}
                                        onChange={e => setData('tanggal_order', e.target.value)}
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium leading-6 text-gray-900">Deadline</label>
                                    <input
                                        type="date"
                                        value={data.deadline}
                                        onChange={e => setData('deadline', e.target.value)}
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium leading-6 text-gray-900">Total Harga (Rp)</label>
                                    <input
                                        type="text"
                                        value={formatRupiahInput(data.total_harga)}
                                        onChange={e => handleNumberChange('total_harga', e.target.value)}
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6 bg-gray-50"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Dihitung otomatis (bisa diubah manual)</p>
                                    {errors.total_harga && <p className="mt-2 text-sm text-red-600">{errors.total_harga}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium leading-6 text-gray-900">DP (Rp)</label>
                                    <input
                                        type="text"
                                        value={formatRupiahInput(data.dp)}
                                        onChange={e => handleNumberChange('dp', e.target.value)}
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
                                    />
                                    {errors.dp && <p className="mt-2 text-sm text-red-600">{errors.dp}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Catatan Desain</label>
                                <textarea
                                    rows={3}
                                    value={data.catatan_desain}
                                    onChange={e => setData('catatan_desain', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Catatan Umum</label>
                                <textarea
                                    rows={3}
                                    value={data.catatan}
                                    onChange={e => setData('catatan', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6 border-t border-gray-200 pt-6">
                        <Link href={route('orders.index')} className="text-sm font-semibold leading-6 text-gray-900">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </Card>
        </AppLayout>
    );
}
