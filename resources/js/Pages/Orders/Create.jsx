import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import { useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/20/solid';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
export default function OrderCreate({ customers = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        jenis_produk: '',
        jumlah: '',
        ukuran_detail: { S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0 },
        tanggal_order: new Date().toISOString().split('T')[0],
        deadline: '',
        total_harga: '',
        dp: '',
        catatan_desain: '',
        catatan: '',
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
        post(route('orders.store'));
    };

    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    
    const customerForm = useForm({
        nama: '',
        kontak: '',
        email: '',
        alamat: '',
        catatan: '',
    });

    const submitCustomer = (e) => {
        e.preventDefault();
        customerForm.post(route('customers.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCustomerModalOpen(false);
                customerForm.reset();
            },
        });
    };

    return (
        <AppLayout title="Buat Order Baru">
            <Card>
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Kolom Kiri */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Customer</label>
                                <div className="mt-2 flex gap-2">
                                    <select
                                        value={data.customer_id}
                                        onChange={e => setData('customer_id', e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                    >
                                        <option value="">Pilih Customer</option>
                                        {customers.map(c => (
                                            <option key={c.id} value={c.id}>{c.nama}</option>
                                        ))}
                                    </select>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsCustomerModalOpen(true)}
                                        className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-navy shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                        <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                                        Baru
                                    </button>
                                </div>
                                {errors.customer_id && <p className="mt-2 text-sm text-red-600">{errors.customer_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Jenis Produk</label>
                                <input
                                    type="text"
                                    value={data.jenis_produk}
                                    onChange={e => setData('jenis_produk', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                />
                                {errors.jenis_produk && <p className="mt-2 text-sm text-red-600">{errors.jenis_produk}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Total Jumlah</label>
                                <input
                                    type="number"
                                    value={data.jumlah}
                                    onChange={e => setData('jumlah', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                />
                                {errors.jumlah && <p className="mt-2 text-sm text-red-600">{errors.jumlah}</p>}
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
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium leading-6 text-gray-900">Tanggal Order</label>
                                    <input
                                        type="date"
                                        value={data.tanggal_order}
                                        onChange={e => setData('tanggal_order', e.target.value)}
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium leading-6 text-gray-900">Deadline</label>
                                    <input
                                        type="date"
                                        value={data.deadline}
                                        onChange={e => setData('deadline', e.target.value)}
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
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
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                    />
                                    {errors.total_harga && <p className="mt-2 text-sm text-red-600">{errors.total_harga}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium leading-6 text-gray-900">DP (Rp)</label>
                                    <input
                                        type="text"
                                        value={formatRupiahInput(data.dp)}
                                        onChange={e => handleNumberChange('dp', e.target.value)}
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
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
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Catatan Umum</label>
                                <textarea
                                    rows={3}
                                    value={data.catatan}
                                    onChange={e => setData('catatan', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
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
                            className="rounded-md bg-navy px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-navy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:opacity-50"
                        >
                            Simpan Order
                        </button>
                    </div>
                </form>
            </Card>

            <Modal show={isCustomerModalOpen} onClose={() => setIsCustomerModalOpen(false)}>
                <form onSubmit={submitCustomer} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Tambah Customer Baru</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="nama" value="Nama Customer" />
                            <TextInput
                                id="nama"
                                type="text"
                                className="mt-1 block w-full"
                                value={customerForm.data.nama}
                                onChange={e => customerForm.setData('nama', e.target.value)}
                            />
                            <InputError message={customerForm.errors.nama} className="mt-2" />
                        </div>
                        
                        <div>
                            <InputLabel htmlFor="kontak" value="Kontak (No HP/WA)" />
                            <TextInput
                                id="kontak"
                                type="text"
                                className="mt-1 block w-full"
                                value={customerForm.data.kontak}
                                onChange={e => customerForm.setData('kontak', e.target.value)}
                            />
                            <InputError message={customerForm.errors.kontak} className="mt-2" />
                        </div>
                        
                        <div>
                            <InputLabel htmlFor="email" value="Email (Opsional)" />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={customerForm.data.email}
                                onChange={e => customerForm.setData('email', e.target.value)}
                            />
                            <InputError message={customerForm.errors.email} className="mt-2" />
                        </div>
                        
                        <div>
                            <InputLabel htmlFor="alamat" value="Alamat (Opsional)" />
                            <textarea
                                id="alamat"
                                className="mt-1 block w-full border-gray-300 focus:border-navy focus:ring-navy rounded-md shadow-sm"
                                value={customerForm.data.alamat}
                                onChange={e => customerForm.setData('alamat', e.target.value)}
                                rows={2}
                            />
                            <InputError message={customerForm.errors.alamat} className="mt-2" />
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsCustomerModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton disabled={customerForm.processing}>Simpan Customer</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
