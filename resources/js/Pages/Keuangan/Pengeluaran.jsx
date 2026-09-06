import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import CurrencyInput from '@/Components/CurrencyInput';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import EmptyState from '@/Components/EmptyState';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { DocumentChartBarIcon } from '@heroicons/react/24/outline';

export default function Pengeluaran({ pengeluarans }) {
    const fmtRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        tanggal: new Date().toISOString().split('T')[0],
        kategori: 'operasional',
        deskripsi: '',
        jumlah: '',
        order_id: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('keuangan.pengeluaran.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    return (
        <AppLayout title="Pengeluaran">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-[24px] font-oswald font-bold text-ink mb-1">Daftar Pengeluaran</h2>
                        <p className="text-[13px] text-ink-soft">Riwayat pengeluaran operasional dan bahan baku.</p>
                    </div>
                    <PrimaryButton onClick={() => setShowModal(true)}>
                        + Catat Pengeluaran
                    </PrimaryButton>
                </div>

                <Card className="!p-0 overflow-hidden">
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Tanggal</Table.HeadCell>
                            <Table.HeadCell>Kategori</Table.HeadCell>
                            <Table.HeadCell>Deskripsi</Table.HeadCell>
                            <Table.HeadCell>Jumlah</Table.HeadCell>
                            <Table.HeadCell>Pencatat</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {pengeluarans.data.map(p => (
                                <Table.Row key={p.id}>
                                    <Table.Cell className="text-ink-soft">{p.tanggal}</Table.Cell>
                                    <Table.Cell className="uppercase text-[11px] font-bold text-ink-soft">{p.kategori.replace('_', ' ')}</Table.Cell>
                                    <Table.Cell className="text-ink">{p.deskripsi} {p.order_id ? <span className="text-ink-soft">(Order #{p.order_id})</span> : ''}</Table.Cell>
                                    <Table.Cell className="font-mono text-danger font-bold text-[14px]">{fmtRupiah(p.jumlah)}</Table.Cell>
                                    <Table.Cell className="text-ink-soft">{p.pencatat?.name}</Table.Cell>
                                </Table.Row>
                            ))}
                            {pengeluarans.data.length === 0 && (
                                <Table.Row>
                                    <Table.Cell colSpan={5}>
                                        <EmptyState 
                                            title="Belum ada data pengeluaran"
                                            description="Catat pengeluaran baru dengan menekan tombol di atas."
                                            icon={DocumentChartBarIcon}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </Card>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="lg">
                <div className="p-6 bg-panel">
                    <h3 className="text-[18px] font-oswald font-bold text-ink mb-6">Catat Pengeluaran</h3>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <InputLabel value="Kategori" />
                            <select 
                                className="mt-1 block w-full bg-bg border-line text-ink rounded focus:border-navy focus:ring-navy sm:text-[13px]" 
                                value={data.kategori} 
                                onChange={e => setData('kategori', e.target.value)}
                            >
                                <option value="operasional">Operasional</option>
                                <option value="bahan_baku">Bahan Baku</option>
                                <option value="lainnya">Lainnya</option>
                            </select>
                        </div>
                        
                        <div>
                            <InputLabel value="Deskripsi" />
                            <TextInput 
                                type="text" 
                                className="mt-1 block w-full" 
                                value={data.deskripsi} 
                                onChange={e => setData('deskripsi', e.target.value)} 
                                required 
                            />
                        </div>

                        <div>
                            <InputLabel value="Jumlah (Rp)" />
                            <CurrencyInput 
                                className="mt-1" 
                                value={data.jumlah} 
                                onChange={e => setData('jumlah', e.target.value)} 
                                required 
                            />
                        </div>

                        <div>
                            <InputLabel value="Order Terkait (Opsional)" />
                            <TextInput 
                                type="number" 
                                className="mt-1 block w-full" 
                                placeholder="ID Order" 
                                value={data.order_id} 
                                onChange={e => setData('order_id', e.target.value)} 
                            />
                        </div>

                        <div>
                            <InputLabel value="Tanggal" />
                            <TextInput 
                                type="date" 
                                className="mt-1 block w-full" 
                                value={data.tanggal} 
                                onChange={e => setData('tanggal', e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-line">
                            <SecondaryButton type="button" onClick={() => setShowModal(false)}>
                                Batal
                            </SecondaryButton>
                            <PrimaryButton type="submit" disabled={processing}>
                                Simpan Pengeluaran
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AppLayout>
    );
}
