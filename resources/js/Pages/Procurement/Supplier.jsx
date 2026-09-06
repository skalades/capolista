import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import Table from '@/Components/Table';
import Card from '@/Components/Card';
import EmptyState from '@/Components/EmptyState';
import { UsersIcon } from '@heroicons/react/24/outline';

export default function Supplier({ auth, suppliers }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
        nama: '',
        kontak: '',
        email: '',
        alamat: '',
        catatan: '',
    });

    const openCreate = () => {
        setIsEdit(false);
        reset();
        setIsOpen(true);
    };

    const openEdit = (supplier) => {
        setIsEdit(true);
        setEditId(supplier.id);
        setData({
            nama: supplier.nama,
            kontak: supplier.kontak || '',
            email: supplier.email || '',
            alamat: supplier.alamat || '',
            catatan: supplier.catatan || '',
        });
        setIsOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('procurement.supplier.update', editId), {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            post(route('procurement.supplier.store'), {
                onSuccess: () => setIsOpen(false),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus supplier ini?')) {
            destroy(route('procurement.supplier.destroy', id));
        }
    };

    return (
        <AppLayout title="Manajemen Supplier">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[24px] font-oswald font-bold text-ink">Daftar Supplier</h2>
                    <PrimaryButton onClick={openCreate}>+ Tambah Supplier</PrimaryButton>
                </div>
                
                <Modal show={isOpen} onClose={() => setIsOpen(false)}>
                    <div className="p-6">
                        <div className="mb-4">
                            <h2 className="text-lg font-medium font-oswald text-ink">{isEdit ? 'Edit Supplier' : 'Tambah Supplier'}</h2>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="nama" value="Nama Supplier"  />
                                <TextInput
                                    id="nama"
                                    className="block w-full mt-1"
                                    value={data.nama}
                                    onChange={e => setData('nama', e.target.value)}
                                    required
                                />
                                {errors.nama && <InputError message={errors.nama} className="mt-1" />}
                            </div>
                            <div>
                                <InputLabel htmlFor="kontak" value="Kontak"  />
                                <TextInput
                                    id="kontak"
                                    className="block w-full mt-1"
                                    value={data.kontak}
                                    onChange={e => setData('kontak', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="email" value="Email"  />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="block w-full mt-1"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="alamat" value="Alamat"  />
                                <TextInput
                                    id="alamat"
                                    className="block w-full mt-1"
                                    value={data.alamat}
                                    onChange={e => setData('alamat', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="catatan" value="Catatan"  />
                                <TextInput
                                    id="catatan"
                                    className="block w-full mt-1"
                                    value={data.catatan}
                                    onChange={e => setData('catatan', e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <SecondaryButton type="button" onClick={() => setIsOpen(false)}>Batal</SecondaryButton>
                                <PrimaryButton type="submit" disabled={processing}>Simpan</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </Modal>

                <Card>
                    {(!suppliers || suppliers.length === 0) ? (
                        <EmptyState 
                            title="Belum ada supplier"
                            description="Anda belum menambahkan satupun supplier."
                            icon={UsersIcon}
                        />
                    ) : (
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>Nama</Table.HeadCell>
                                <Table.HeadCell>Kontak</Table.HeadCell>
                                <Table.HeadCell>Email</Table.HeadCell>
                                <Table.HeadCell>Alamat</Table.HeadCell>
                                <Table.HeadCell className="text-right">Aksi</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {suppliers.map((sup) => (
                                    <Table.Row key={sup.id}>
                                        <Table.Cell className="font-medium text-ink">{sup.nama}</Table.Cell>
                                        <Table.Cell>{sup.kontak || '-'}</Table.Cell>
                                        <Table.Cell>{sup.email || '-'}</Table.Cell>
                                        <Table.Cell>{sup.alamat || '-'}</Table.Cell>
                                        <Table.Cell className="text-right space-x-3">
                                            <button onClick={() => openEdit(sup)} className="text-[12px] font-medium text-navy hover:text-navy/70">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(sup.id)} className="text-[12px] font-medium text-danger hover:text-danger/70">
                                                Hapus
                                            </button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
