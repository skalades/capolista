import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import Card from '@/Components/Card';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Show({ order, operatorList }) {
    const { data: assignData, setData: setAssignData, post: postAssign, processing: assignProcessing, reset: resetAssign } = useForm({
        operator_id: '',
        jenis_produk: order.jenis_produk,
        tarif_per_pcs: '',
        catatan: ''
    });

    const { data: completeData, setData: setCompleteData, post: postComplete, processing: completeProcessing } = useForm({
        next_divisi: 'packing',
        catatan: ''
    });

    const handleAssign = (e) => {
        e.preventDefault();
        postAssign(route('jahit.assign', order.id), {
            onSuccess: () => resetAssign('operator_id', 'tarif_per_pcs', 'catatan'),
        });
    };

    const handleComplete = (e) => {
        e.preventDefault();
        if (confirm('Selesaikan proses jahit untuk order ini?')) {
            postComplete(route('jahit.complete', order.id));
        }
    };

    return (
        <AppLayout header={
            <div className="flex justify-between items-center">
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Order Jahit: {order.no_order}</h2>
                <Link href={route('jahit.index')} className="text-sm text-gray-500 hover:text-gray-700">Kembali</Link>
            </div>
        }>
            <Head title={`Jahit Order ${order.no_order}`} />

            <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Detail Order">
                        <div className="space-y-2">
                            <p className="text-sm"><strong>Customer:</strong> {order.customer?.nama}</p>
                            <p className="text-sm"><strong>Produk:</strong> {order.jenis_produk} ({order.jumlah} pcs)</p>
                            <p className="text-sm"><strong>Status:</strong> <span className="uppercase font-semibold text-brand-600">{order.status}</span></p>
                            <p className="text-sm"><strong>Deadline:</strong> {order.deadline}</p>
                        </div>
                    </Card>

                    <Card title="Selesaikan Order">
                        <form onSubmit={handleComplete} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="catatan_complete" value="Catatan (Opsional)" />
                                <TextInput
                                    id="catatan_complete"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={completeData.catatan}
                                    onChange={e => setCompleteData('catatan', e.target.value)}
                                    placeholder="Contoh: Jahitan sudah rapi, barang siap packing."
                                />
                            </div>
                            <PrimaryButton disabled={completeProcessing}>Selesai Jahit</PrimaryButton>
                        </form>
                    </Card>
                </div>

                <Card title="Operator Ditugaskan (Assign)">
                    {order.jahit_assigns && order.jahit_assigns.length > 0 ? (
                        <div className="overflow-x-auto mt-4 mb-6 border rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operator</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarif/Pcs</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {order.jahit_assigns.map(assign => (
                                        <tr key={assign.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assign.operator?.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assign.jenis_produk}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {parseInt(assign.tarif_per_pcs).toLocaleString('id-ID')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assign.is_active ? 'Aktif' : 'Non-aktif'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm mb-6 mt-4">Belum ada operator yang ditugaskan.</p>
                    )}

                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-lg mb-4">Tugaskan Operator Baru</h3>
                        <form onSubmit={handleAssign} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <InputLabel htmlFor="operator_id" value="Operator" />
                                <select
                                    id="operator_id"
                                    required
                                    className="border-gray-300 focus:border-brand-500 focus:ring-brand-500 rounded-md shadow-sm w-full mt-1 block"
                                    value={assignData.operator_id}
                                    onChange={e => setAssignData('operator_id', e.target.value)}
                                >
                                    <option value="">Pilih Operator</option>
                                    {operatorList.map(op => (
                                        <option key={op.id} value={op.id}>{op.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <InputLabel htmlFor="jenis_produk" value="Produk" />
                                <TextInput
                                    id="jenis_produk"
                                    type="text"
                                    required
                                    className="mt-1 block w-full"
                                    value={assignData.jenis_produk}
                                    onChange={e => setAssignData('jenis_produk', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="tarif_per_pcs" value="Tarif Borongan (Rp/pcs)" />
                                <TextInput
                                    id="tarif_per_pcs"
                                    type="number"
                                    required
                                    min="0"
                                    className="mt-1 block w-full"
                                    value={assignData.tarif_per_pcs}
                                    onChange={e => setAssignData('tarif_per_pcs', e.target.value)}
                                />
                            </div>
                            <div>
                                <PrimaryButton disabled={assignProcessing} className="w-full justify-center">Assign</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </Card>

            </div>
        </AppLayout>
    );
}
