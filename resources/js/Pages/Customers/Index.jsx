import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import Pagination from '@/Components/Pagination';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function CustomerIndex({ customers, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('customers.index'), { search }, { preserveState: true });
    };

    return (
        <AppLayout title="Daftar Customer">
            <Card>
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <TextInput
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama/kontak..."
                            className="w-full sm:w-64"
                        />
                        <PrimaryButton type="submit">Cari</PrimaryButton>
                    </form>
                    
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {customers.data.map((customer) => (
                                <tr key={customer.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{customer.nama}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{customer.kontak}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{customer.email || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={route('customers.show', customer.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">Lihat</Link>
                                        <Link href={route('customers.edit', customer.id)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</Link>
                                        <button 
                                            onClick={() => {
                                                if (confirm('Yakin ingin menghapus customer ini?')) {
                                                    router.delete(route('customers.destroy', customer.id));
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {customers.data.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Tidak ada data customer.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4">
                    <Pagination links={customers.links} />
                </div>
            </Card>
        </AppLayout>
    );
}
