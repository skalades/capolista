import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import { useForm, Link } from '@inertiajs/react';
import { PlusIcon } from '@heroicons/react/20/solid';

export default function OrderEdit({ order, customers = [] }) {
    const defaultUkuran = { S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0 };
    const itemsMap = order?.items?.reduce((acc, item) => {
        if (item.ukuran) acc[item.ukuran] = item.jumlah_pcs;
        return acc;
    }, {}) || {};

    const { data, setData, put, processing, errors } = useForm({
        customer_id: order?.customer_id || '',
        jenis_produk: order?.jenis_produk || '',
        jumlah: order?.jumlah || '',
        ukuran_detail: { ...defaultUkuran, ...itemsMap },
        tanggal_order: order?.tanggal_order || '',
        deadline: order?.deadline || '',
        total_harga: order?.total_harga ? parseInt(order.total_harga, 10) : '',
        dp: order?.dp !== undefined && order?.dp !== null ? parseInt(order.dp, 10) : '',
        catatan_desain: order?.catatan_desain || '',
        catatan: order?.catatan || '',
    });

    const handleUkuranChange = (size, value) => {
        setData('ukuran_detail', {
            ...data.ukuran_detail,
            [size]: parseInt(value) || 0
        });
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
                                <label className="block text-sm font-medium leading-6 text-gray-900">Jenis Produk</label>
                                <input
                                    type="text"
                                    value={data.jenis_produk}
                                    onChange={e => setData('jenis_produk', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Total Jumlah</label>
                                <input
                                    type="number"
                                    value={data.jumlah}
                                    onChange={e => setData('jumlah', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Detail Ukuran</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {Object.keys(data.ukuran_detail).map(size => (
                                        <div key={size} className="flex items-center gap-2">
                                            <span className="w-10 text-sm font-medium text-gray-700">{size}</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={data.ukuran_detail[size] || ''}
                                                onChange={e => handleUkuranChange(size, e.target.value)}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    ))}
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
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
                                    />
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
