import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Table from '@/Components/Table';

export default function PoShow({ auth, purchaseOrder }) {
    
    const updateStatus = (status) => {
        if (confirm(`Ubah status PO menjadi ${status}? ${status === 'diterima' ? 'Stok bahan akan otomatis bertambah.' : ''}`)) {
            router.patch(route('procurement.po.update-status', purchaseOrder.id), { status });
        }
    };

    return (
        <AppLayout
            title={`Detail PO: ${purchaseOrder.no_po}`}
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
                                <PrimaryButton onClick={() => updateStatus('dikirim')} className="bg-blue-500 hover:bg-brand-600">Tandai Dikirim</PrimaryButton>
                            )}
                            {purchaseOrder.status === 'dikirim' && (
                                <PrimaryButton onClick={() => updateStatus('diterima')} className="bg-green-500 hover:bg-green-600">Tandai Diterima</PrimaryButton>
                            )}
                            {(purchaseOrder.status === 'draft' || purchaseOrder.status === 'dikirim') && (
                                <PrimaryButton onClick={() => updateStatus('dibatalkan')} variant="destructive">Batalkan PO</PrimaryButton>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card title="Informasi Supplier">
                            <div className="space-y-2">
                                <p><strong>Nama:</strong> {purchaseOrder.supplier?.nama}</p>
                                <p><strong>Kontak:</strong> {purchaseOrder.supplier?.kontak || '-'}</p>
                                <p><strong>Email:</strong> {purchaseOrder.supplier?.email || '-'}</p>
                                <p><strong>Alamat:</strong> {purchaseOrder.supplier?.alamat || '-'}</p>
                            </div>
                        </Card>

                        <Card title="Informasi PO">
                            <div className="space-y-2">
                                <p><strong>No PO:</strong> {purchaseOrder.no_po}</p>
                                <p><strong>Tanggal:</strong> {purchaseOrder.tanggal_po}</p>
                                <p><strong>Dibuat Oleh:</strong> {purchaseOrder.creator?.name || '-'}</p>
                                <p><strong>Catatan:</strong> {purchaseOrder.catatan || '-'}</p>
                            </div>
                        </Card>
                    </div>

                    <Card title="Item Pembelian">
                        <Table>
                            <Table.Head>
                                <Table.Row>
                                    <Table.HeadCell>Nama Bahan</Table.HeadCell>
                                    <Table.HeadCell>Jumlah</Table.HeadCell>
                                    <Table.HeadCell>Satuan</Table.HeadCell>
                                    <Table.HeadCell>Harga Satuan</Table.HeadCell>
                                    <Table.HeadCell>Subtotal</Table.HeadCell>
                                </Table.Row>
                            </Table.Head>
                            <Table.Body>
                                {purchaseOrder.items.map(item => (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>{item.nama_bahan}</Table.Cell>
                                        <Table.Cell>{item.jumlah}</Table.Cell>
                                        <Table.Cell>{item.satuan}</Table.Cell>
                                        <Table.Cell>Rp {Number(item.harga_satuan).toLocaleString()}</Table.Cell>
                                        <Table.Cell>Rp {(item.jumlah * item.harga_satuan).toLocaleString()}</Table.Cell>
                                    </Table.Row>
                                ))}
                                <Table.Row>
                                    <Table.Cell colSpan={4} className="text-right font-bold">Total Keseluruhan:</Table.Cell>
                                    <Table.Cell className="font-bold">Rp {Number(purchaseOrder.total_harga).toLocaleString()}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Card>

                </div>
            </div>
        </AppLayout>
    );
}
