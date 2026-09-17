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
import { Link, router, useForm, usePage } from '@inertiajs/react';
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
    const { auth } = usePage().props;
    const canCreate = auth.user.level_akses <= 2;
    
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
    });

    const handleBulkUpdate = (status) => {
        if (!status || selectedOrders.length === 0) return;
        if (confirm(`Apakah Anda yakin ingin mengubah status ${selectedOrders.length} order yang dipilih menjadi "${STATUS_LABELS[status]}"?`)) {
            router.post(route('orders.bulk-update-status'), {
                order_ids: selectedOrders,
                status: status
            }, {
                onSuccess: () => setSelectedOrders([])
            });
        }
    };

    const handleSearch = (search) => {
        router.get(route('orders.index'), { search, status: filters.status, filter_deadline: filters.filter_deadline, source: filters.source }, { preserveState: true, replace: true });
    };

    const handleStatusFilter = (e) => {
        router.get(route('orders.index'), { search: filters.search, status: e.target.value, filter_deadline: filters.filter_deadline, source: filters.source }, { preserveState: true, replace: true });
    };


    const handleDeadlineFilter = (e) => {
        router.get(route('orders.index'), { search: filters.search, status: filters.status, filter_deadline: e.target.value, source: filters.source }, { preserveState: true, replace: true });
    };

    const handleSourceFilter = (e) => {
        router.get(route('orders.index'), { search: filters.search, status: filters.status, filter_deadline: filters.filter_deadline, source: e.target.value }, { preserveState: true, replace: true });
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
                canCreate && (
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
                )
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
                    <select
                        value={filters.filter_deadline || ''}
                        onChange={handleDeadlineFilter}
                        className="block w-full sm:w-48 rounded-md border-line py-1.5 text-ink text-[13px] focus:ring-2 focus:ring-navy focus:border-navy"
                    >
                        <option value="">Semua Deadline</option>
                        <option value="hari_ini">Deadline Hari Ini</option>
                        <option value="mendekati">Mendekati (H-3)</option>
                        <option value="lewat">Terlewat</option>
                    </select>
                    <select
                        value={filters.source || ''}
                        onChange={handleSourceFilter}
                        className="block w-full sm:w-48 rounded-md border-line py-1.5 text-ink text-[13px] focus:ring-2 focus:ring-navy focus:border-navy"
                    >
                        <option value="">Semua Sumber</option>
                        <option value="import">Hasil Import Excel</option>
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
                    <>
                        <div className="mb-4 flex gap-2 items-center" style={{ display: selectedOrders.length > 0 ? 'flex' : 'none' }}>
                            <span className="text-[13px] font-medium text-ink-soft mr-2">
                                {selectedOrders.length} order dipilih
                            </span>
                            <select
                                onChange={(e) => handleBulkUpdate(e.target.value)}
                                className="block rounded-md border-line py-1 text-ink text-[12px] focus:ring-2 focus:ring-navy focus:border-navy"
                                value=""
                            >
                                <option value="" disabled>Ubah Status Massal...</option>
                                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </select>
                            {canCreate && (
                                <>
                                    <button
                                        onClick={() => {
                                            if (selectedOrders.length < 2) {
                                                alert("Pilih minimal 2 order untuk digabungkan.");
                                                return;
                                            }
                                            if (confirm(`Apakah Anda yakin ingin menggabungkan ${selectedOrders.length} order? Item, pembayaran, dan catatan akan dipindahkan ke order yang paling awal, lalu order lainnya akan dihapus.`)) {
                                                router.post(route('orders.bulk-merge'), {
                                                    order_ids: selectedOrders,
                                                }, {
                                                    onSuccess: () => setSelectedOrders([])
                                                });
                                            }
                                        }}
                                        className="ml-2 inline-flex items-center justify-center rounded bg-gold px-3 py-1 text-[12px] font-medium text-white hover:bg-gold/90"
                                    >
                                        Gabungkan Order
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm(`Apakah Anda yakin ingin menghapus ${selectedOrders.length} order secara massal? Ini tidak dapat dibatalkan.`)) {
                                                router.post(route('orders.bulk-delete'), {
                                                    order_ids: selectedOrders,
                                                }, {
                                                    onSuccess: () => setSelectedOrders([])
                                                });
                                            }
                                        }}
                                        className="ml-2 inline-flex items-center justify-center rounded bg-danger px-3 py-1 text-[12px] font-medium text-white hover:bg-danger/90"
                                    >
                                        Hapus Massal
                                    </button>
                                </>
                            )}
                        </div>
                        <Table>
                            <Table.Head>
                                <Table.HeadCell className="w-8">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-line text-navy focus:ring-navy"
                                        checked={orders.data.length > 0 && selectedOrders.length === orders.data.length}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedOrders(orders.data.map(o => o.id));
                                            } else {
                                                setSelectedOrders([]);
                                            }
                                        }}
                                    />
                                </Table.HeadCell>
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
                                        <Table.Cell>
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-line text-navy focus:ring-navy"
                                                checked={selectedOrders.includes(order.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedOrders([...selectedOrders, order.id]);
                                                    } else {
                                                        setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                                                    }
                                                }}
                                            />
                                        </Table.Cell>
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
                                            <button 
                                                onClick={() => {
                                                    if(confirm('Apakah Anda yakin ingin menghapus order ini?')) {
                                                        router.delete(route('orders.destroy', order.id));
                                                    }
                                                }}
                                                className="text-[12px] font-medium text-danger hover:text-danger/70"
                                            >
                                                Hapus
                                            </button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </>
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
