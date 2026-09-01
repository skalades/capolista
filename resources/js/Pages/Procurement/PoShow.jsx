import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Card, CardHeader, CardContent, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';

export default function PoShow({ auth, purchaseOrder }) {
    
    const updateStatus = (status) => {
        if (confirm(`Ubah status PO menjadi ${status}? ${status === 'diterima' ? 'Stok bahan akan otomatis bertambah.' : ''}`)) {
            router.patch(route('procurement.po.update-status', purchaseOrder.id), { status });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail PO: {purchaseOrder.no_po}</h2>}
        >
            <Head title={`Detail PO ${purchaseOrder.no_po}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex space-x-2">
                            <span className="font-bold">Status Saat Ini: </span>
                            <span className={`px-2 py-1 rounded text-xs text-white ${purchaseOrder.status === 'draft' ? 'bg-gray-500' : purchaseOrder.status === 'dikirim' ? 'bg-blue-500' : purchaseOrder.status === 'diterima' ? 'bg-green-500' : 'bg-red-500'}`}>
                                {purchaseOrder.status.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex space-x-2">
                            {purchaseOrder.status === 'draft' && (
                                <Button onClick={() => updateStatus('dikirim')} className="bg-blue-500 hover:bg-blue-600">Tandai Dikirim</Button>
                            )}
                            {purchaseOrder.status === 'dikirim' && (
                                <Button onClick={() => updateStatus('diterima')} className="bg-green-500 hover:bg-green-600">Tandai Diterima</Button>
                            )}
                            {(purchaseOrder.status === 'draft' || purchaseOrder.status === 'dikirim') && (
                                <Button onClick={() => updateStatus('dibatalkan')} variant="destructive">Batalkan PO</Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Supplier</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p><strong>Nama:</strong> {purchaseOrder.supplier?.nama}</p>
                                <p><strong>Kontak:</strong> {purchaseOrder.supplier?.kontak || '-'}</p>
                                <p><strong>Email:</strong> {purchaseOrder.supplier?.email || '-'}</p>
                                <p><strong>Alamat:</strong> {purchaseOrder.supplier?.alamat || '-'}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi PO</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p><strong>No PO:</strong> {purchaseOrder.no_po}</p>
                                <p><strong>Tanggal:</strong> {purchaseOrder.tanggal_po}</p>
                                <p><strong>Dibuat Oleh:</strong> {purchaseOrder.creator?.name || '-'}</p>
                                <p><strong>Catatan:</strong> {purchaseOrder.catatan || '-'}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Item Pembelian</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Bahan</TableHead>
                                        <TableHead>Jumlah</TableHead>
                                        <TableHead>Satuan</TableHead>
                                        <TableHead>Harga Satuan</TableHead>
                                        <TableHead>Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {purchaseOrder.items.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.nama_bahan}</TableCell>
                                            <TableCell>{item.jumlah}</TableCell>
                                            <TableCell>{item.satuan}</TableCell>
                                            <TableCell>Rp {Number(item.harga_satuan).toLocaleString()}</TableCell>
                                            <TableCell>Rp {(item.jumlah * item.harga_satuan).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-right font-bold">Total Keseluruhan:</TableCell>
                                        <TableCell className="font-bold">Rp {Number(purchaseOrder.total_harga).toLocaleString()}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
