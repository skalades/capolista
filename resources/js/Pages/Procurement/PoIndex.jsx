import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';

export default function PoIndex({ auth, purchaseOrders, filters }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleFilterChange = (val) => {
        const newStatus = val === 'all' ? '' : val;
        setStatusFilter(newStatus);
        
        router.get(route('procurement.po.index'), 
            { status: newStatus },
            { preserveState: true }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Daftar Purchase Order</h2>}
        >
            <Head title="Purchase Orders" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Filter Status:</span>
                            <Select value={statusFilter || 'all'} onValueChange={handleFilterChange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="dikirim">Dikirim</SelectItem>
                                    <SelectItem value="diterima">Diterima</SelectItem>
                                    <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button asChild>
                            <Link href={route('procurement.po.create')}>Buat PO Baru</Link>
                        </Button>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No. PO</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>Total Harga</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchaseOrders.data.map((po) => (
                                    <TableRow key={po.id}>
                                        <TableCell className="font-medium">{po.no_po}</TableCell>
                                        <TableCell>{po.tanggal_po}</TableCell>
                                        <TableCell>{po.supplier?.nama}</TableCell>
                                        <TableCell>Rp {Number(po.total_harga).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs text-white ${po.status === 'draft' ? 'bg-gray-500' : po.status === 'dikirim' ? 'bg-blue-500' : po.status === 'diterima' ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {po.status.toUpperCase()}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('procurement.po.show', po.id)}>Detail</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {purchaseOrders.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-4">Belum ada Purchase Order</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
