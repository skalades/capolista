import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import { useForm, Link } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function CustomerEdit({ customer }) {
    const { data, setData, put, processing, errors } = useForm({
        nama: customer.nama || '',
        kontak: customer.kontak || '',
        email: customer.email || '',
        alamat: customer.alamat || '',
        catatan: customer.catatan || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('customers.update', customer.id));
    };

    return (
        <AppLayout title={`Edit Customer: ${customer.nama}`}>
            <Card>
                <form onSubmit={submit} className="space-y-6 max-w-2xl">
                    <div>
                        <InputLabel htmlFor="nama" value="Nama Customer" />
                        <TextInput
                            id="nama"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.nama}
                            onChange={e => setData('nama', e.target.value)}
                        />
                        <InputError message={errors.nama} className="mt-2" />
                    </div>
                    
                    <div>
                        <InputLabel htmlFor="kontak" value="Kontak (No HP/WA)" />
                        <TextInput
                            id="kontak"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.kontak}
                            onChange={e => setData('kontak', e.target.value)}
                        />
                        <InputError message={errors.kontak} className="mt-2" />
                    </div>
                    
                    <div>
                        <InputLabel htmlFor="email" value="Email (Opsional)" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                    
                    <div>
                        <InputLabel htmlFor="alamat" value="Alamat (Opsional)" />
                        <textarea
                            id="alamat"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            value={data.alamat}
                            onChange={e => setData('alamat', e.target.value)}
                            rows={3}
                        />
                        <InputError message={errors.alamat} className="mt-2" />
                    </div>
                    
                    <div>
                        <InputLabel htmlFor="catatan" value="Catatan Tambahan (Opsional)" />
                        <textarea
                            id="catatan"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            value={data.catatan}
                            onChange={e => setData('catatan', e.target.value)}
                            rows={3}
                        />
                        <InputError message={errors.catatan} className="mt-2" />
                    </div>
                    
                    <div className="mt-6 flex gap-3">
                        <Link href={route('customers.index')}>
                            <SecondaryButton>Batal</SecondaryButton>
                        </Link>
                        <PrimaryButton disabled={processing}>Simpan Perubahan</PrimaryButton>
                    </div>
                </form>
            </Card>
        </AppLayout>
    );
}
