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
import EmptyState from '@/Components/EmptyState';
import { Link, router, useForm } from '@inertiajs/react';
import { PlusIcon, ArrowUpTrayIcon, DocumentDuplicateIcon } from '@heroicons/react/20/solid';

const STATUS_SEMANTICS = {
    draft: 'neutral', desain: 'gold', procurement: 'gold',
    cutting: 'gold', jahit: 'gold', produksi: 'gold', printing: 'gold', pemasangan: 'gold',
    packing: 'gold', dikirim: 'accent', selesai: 'accent'
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
                        className="inline-flex items-center justify-center rounded bg-panel border border-line px-3 py-1.5 text-[12.5px] font-medium font-sans text-ink shadow-sm transition-colors hover:bg-line/20"
                    >
                        <ArrowUpTrayIcon className="-ml-0.5 h-4 w-4 mr-1 text-ink-soft" aria-hidden="true" />
                        Import Excel
                    </button>
                    <Link
                        href={route('orders.create')}
                        className="inline-flex items-center justify-center rounded bg-navy px-3 py-1.5 text-[12.5px] font-medium font-sans text-white shadow-sm transition-colors hover:bg-navy/90"
                    >
                        <PlusIcon className="-ml-0.5 h-4 w-4 mr-1 text-white" aria-hidden="true" />
                        Buat Order
                    </Link>
                </div>
            }
        >
            <Card className="mb-6">
                <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
                    <div className="w-full sm:w-64">
                        <SearchFilter value={filters.search} onChange={handleSearch} placeholder="Cari order..." />
                    </div>
                    <select
                        value={filters.status || ''}
                        onChange={handleStatusFilter}
                        className="block w-full sm:w-48 rounded-md border-line py-1.5 text-ink text-[13px] focus:ring-2 focus:ring-navy focus:border-navy"
                    >
                        <option value="">Semua Status</option>
                        {Object.entries(STATUS_LABELS).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                    </select>
                </div>
            </Card>
            
            <Card>
                {(!orders?.data || orders.data.length === 0) ? (
                    <EmptyState 
                        title="Tidak ada data order"
                        description="Belum ada pesanan yang sesuai dengan pencarian atau filter Anda."
                        icon={DocumentDuplicateIcon}
                    />
                ) : (
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>No. Order</Table.HeadCell>
                            <Table.HeadCell>Customer</Table.HeadCell>
                            <Table.HeadCell>Jenis Produk</Table.HeadCell>
                            <Table.HeadCell>Jumlah</Table.HeadCell>
                            <Table.HeadCell>Deadline</Table.HeadCell>
                            <Table.HeadCell className="text-center">Status</Table.HeadCell>
                            <Table.HeadCell className="text-right">Aksi</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {orders.data.map((order) => (
                                <Table.Row key={order.id}>
                                    <Table.Cell className="font-mono font-medium text-[13px] text-ink">{order.no_order}</Table.Cell>
                                    <Table.Cell>{order.customer?.nama || '-'}</Table.Cell>
                                    <Table.Cell>{order.jenis_produk}</Table.Cell>
                                    <Table.Cell>{order.jumlah}</Table.Cell>
                                    <Table.Cell className="text-ink-soft">{order.deadline ? new Date(order.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</Table.Cell>
                                    <Table.Cell className="text-center">
                                        <Badge status={STATUS_SEMANTICS[order.status] || 'neutral'}>
                                            {STATUS_LABELS[order.status] || order.status}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="text-right space-x-3">
                                        <Link href={route('orders.show', order.id)} className="text-[12px] font-medium text-navy hover:text-navy/70">
                                            Detail
                                        </Link>
                                        <Link href={route('orders.edit', order.id)} className="text-[12px] font-medium text-navy hover:text-navy/70">
                                            Edit
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                )}

                {orders?.links && orders.data.length > 0 && (
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
                    <h2 className="text-[18px] font-oswald font-bold text-ink mb-1">
                        Import Order dari Excel
                    </h2>
                    
                    <div className="mt-4">
                        <p className="text-[13px] text-ink-soft mb-4 leading-relaxed">
                            Unggah file Excel (.xlsx atau .xls) yang berisi daftar pesanan. 
                            Pastikan formatnya sesuai dengan urutan kolom standar sistem. Baris pertama (header) akan diabaikan.{' '}
                            <a href={route('orders.template')} className="text-navy font-semibold hover:underline">
                                Download Format Excel
                            </a>
                        </p>
                        <input
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            onChange={(e) => setData('file', e.target.files[0])}
                            className="block w-full text-[13px] text-ink-soft
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-[13px] file:font-semibold
                              file:bg-line/20 file:text-ink
                              hover:file:bg-line/40 cursor-pointer border border-line p-1"
                        />
                        {errors.file && <div className="text-danger text-sm mt-2">{errors.file}</div>}
                    </div>

                    <div className="mt-6 flex justify-end space-x-2">
                        <SecondaryButton onClick={() => setIsImportModalOpen(false)}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Mengimpor...' : 'Import Data'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
