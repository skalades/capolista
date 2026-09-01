import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';
import SearchFilter from '@/Components/SearchFilter';
import { Link, router } from '@inertiajs/react';
import { PlusIcon } from '@heroicons/react/20/solid';

const STATUS_COLORS = {
    draft: 'gray', desain: 'blue', procurement: 'yellow',
    produksi: 'orange', printing: 'purple', pemasangan: 'pink',
    packing: 'teal', dikirim: 'indigo', selesai: 'green'
};
const STATUS_LABELS = {
    draft: 'Draft', desain: 'Desain', procurement: 'Procurement',
    produksi: 'Produksi', printing: 'Printing', pemasangan: 'Pemasangan',
    packing: 'Packing', dikirim: 'Dikirim', selesai: 'Selesai'
};

export default function OrderIndex({ orders, filters = {}, customers = [] }) {
    const handleSearch = (search) => {
        router.get(route('orders.index'), { search, status: filters.status }, { preserveState: true, replace: true });
    };

    const handleStatusFilter = (e) => {
        router.get(route('orders.index'), { search: filters.search, status: e.target.value }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout 
            title="Kelola Order"
            headerActions={
                <Link
                    href={route('orders.create')}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                    <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    Buat Order
                </Link>
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
                        className="block w-48 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                    <Table.Cell>{order.customer?.name || '-'}</Table.Cell>
                                    <Table.Cell>{order.jenis_produk}</Table.Cell>
                                    <Table.Cell>{order.jumlah}</Table.Cell>
                                    <Table.Cell>{order.deadline ? new Date(order.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</Table.Cell>
                                    <Table.Cell>
                                        <Badge color={STATUS_COLORS[order.status] || 'gray'}>
                                            {STATUS_LABELS[order.status] || order.status}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link href={route('orders.show', order.id)} className="text-indigo-600 hover:text-indigo-900 mr-3">
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
        </AppLayout>
    );
}
