import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';
import SearchFilter from '@/Components/SearchFilter';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Link, router, useForm } from '@inertiajs/react';
import { PlusIcon, ArrowUpTrayIcon } from '@heroicons/react/20/solid';

const STATUS_COLORS = {
    draft: 'gray', desain: 'blue', procurement: 'yellow',
    cutting: 'lime', jahit: 'cyan', produksi: 'orange', printing: 'purple', pemasangan: 'pink',
    packing: 'teal', dikirim: 'indigo', selesai: 'green'
};
const STATUS_LABELS = {
    draft: 'Draft', desain: 'Desain', procurement: 'Procurement',
    cutting: 'Cutting', jahit: 'Jahit', produksi: 'Produksi', printing: 'Printing', pemasangan: 'Pemasangan',
    packing: 'Packing', dikirim: 'Dikirim', selesai: 'Selesai'
};

export default function OrderIndex({ orders, filters = {}, customers = [] }) {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
    });

    const handleSearch = (search) => {
        router.get(route('orders.index'), { search, status: filters.status }, { preserveState: true, replace: true });
    };

    const handleStatusFilter = (e) => {
        router.get(route('orders.index'), { search: filters.search, status: e.target.value }, { preserveState: true, replace: true });
    };

    const submitImport = (e) => {
        e.preventDefault();
        post(route('orders.import'), {
            onSuccess: () => {
                setIsImportModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AppLayout 
            title="Kelola Order"
            headerActions={
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        <ArrowUpTrayIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Import Excel
                    </button>
                    <Link
                        href={route('orders.create')}
                        className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
                    >
                        <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                        Buat Order
                    </Link>
                </div>
            }
        >
            <Card className="mb-6">
                <div className="flex gap-4 items-center">
                    <div className="w-64">
                        <SearchFilter value={filters.search} onChange={handleSearch} placeholder="Cari order..." />
                    </div>
                    <select
                        value={filters.status || ''}
                        onChange={handleStatusFilter}
                        className="block w-48 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
                    >
                        <option value="">Semua Status</option>
                        {Object.entries(STATUS_LABELS).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                    </select>
                </div>
            </Card>
            
            <Card>

                <Table>
                    <Table.Head>
                        <Table.HeadCell>No. Order</Table.HeadCell>
                        <Table.HeadCell>Customer</Table.HeadCell>
                        <Table.HeadCell>Jenis Produk</Table.HeadCell>
                        <Table.HeadCell>Jumlah</Table.HeadCell>
                        <Table.HeadCell>Deadline</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                        <Table.HeadCell>Aksi</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {orders?.data?.length > 0 ? (
                            orders.data.map((order) => (
                                <Table.Row key={order.id}>
                                    <Table.Cell className="font-medium">{order.no_order}</Table.Cell>
                                    <Table.Cell>{order.customer?.nama || '-'}</Table.Cell>
                                    <Table.Cell>{order.jenis_produk}</Table.Cell>
                                    <Table.Cell>{order.jumlah}</Table.Cell>
                                    <Table.Cell>{order.deadline ? new Date(order.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</Table.Cell>
                                    <Table.Cell>
                                        <Badge color={STATUS_COLORS[order.status] || 'gray'}>
                                            {STATUS_LABELS[order.status] || order.status}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link href={route('orders.show', order.id)} className="text-brand-600 hover:text-brand-900 mr-3">
                                            Detail
                                        </Link>
                                        <Link href={route('orders.edit', order.id)} className="text-blue-600 hover:text-blue-900">
                                            Edit
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        ) : (
                            <Table.Row>
                                <Table.Cell colSpan={7} className="text-center text-gray-500 py-8">
                                    Tidak ada data order.
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>

                {orders && (
                    <div className="mt-4">
                        <Pagination 
                            links={orders.links} 
                            from={orders.from} 
                            to={orders.to} 
                            total={orders.total} 
                        />
                    </div>
                )}
            </Card>
        <Modal show={isImportModalOpen} onClose={() => setIsImportModalOpen(false)}>
            <form onSubmit={submitImport} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Import Order dari Excel
                </h2>

                <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-4">
                        Unggah file Excel (.xlsx atau .xls) yang berisi daftar pesanan. 
                        Pastikan formatnya sesuai dengan urutan kolom standar sistem. Baris pertama (header) akan diabaikan.{' '}
                        <a href={route('orders.template')} className="text-brand-600 font-semibold hover:underline">
                            Download Format Excel
                        </a>
                    </p>
                    <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={(e) => setData('file', e.target.files[0])}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-brand-50 file:text-brand-700
                          hover:file:bg-brand-100"
                    />
                    {errors.file && <div className="text-red-500 text-sm mt-2">{errors.file}</div>}
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={() => setIsImportModalOpen(false)}>
                        Batal
                    </SecondaryButton>

                    <PrimaryButton className="ml-3" disabled={processing}>
                        {processing ? 'Mengimpor...' : 'Import Data'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
        </AppLayout>
    );
}
