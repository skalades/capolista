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
        <AppLayout
            title="Manajemen Supplier"
        >
            

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="flex justify-end">
                        <PrimaryButton onClick={openCreate}>Tambah Supplier</PrimaryButton>
                    </div>
                    
                    <Modal show={isOpen} onClose={() => setIsOpen(false)}>
                        <div className="p-6">
                            <div className="mb-4">
                                <h2 className="text-lg font-medium text-gray-900">{isEdit ? 'Edit Supplier' : 'Tambah Supplier'}</h2>
                            </div>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <TextInputLabel htmlFor="nama" value="Nama Supplier"  />
                                    <Input
                                        id="nama"
                                        value={data.nama}
                                        onChange={e => setData('nama', e.target.value)}
                                        required
                                    />
                                    {errors.nama && <p className="text-red-500 text-sm">{errors.nama}</p>}
                                </div>
                                <div>
                                    <TextInputLabel htmlFor="kontak" value="Kontak"  />
                                    <Input
                                        id="kontak"
                                        value={data.kontak}
                                        onChange={e => setData('kontak', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <TextInputLabel htmlFor="email" value="Email"  />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <TextInputLabel htmlFor="alamat" value="Alamat"  />
                                    <Input
                                        id="alamat"
                                        value={data.alamat}
                                        onChange={e => setData('alamat', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <TextInputLabel htmlFor="catatan" value="Catatan"  />
                                    <Input
                                        id="catatan"
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

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <Table>
                            <Table.Head>
                                <Table.Row>
                                    <Table.HeadCell>Nama</Table.HeadCell>
                                    <Table.HeadCell>Kontak</Table.HeadCell>
                                    <Table.HeadCell>Email</Table.HeadCell>
                                    <Table.HeadCell>Alamat</Table.HeadCell>
                                    <Table.HeadCell>Aksi</Table.HeadCell>
                                </Table.Row>
                            </Table.Head>
                            <Table.Body>
                                {suppliers.map((sup) => (
                                    <Table.Row key={sup.id}>
                                        <Table.Cell>{sup.nama}</Table.Cell>
                                        <Table.Cell>{sup.kontak}</Table.Cell>
                                        <Table.Cell>{sup.email}</Table.Cell>
                                        <Table.Cell>{sup.alamat}</Table.Cell>
                                        <Table.Cell>
                                            <div className="flex space-x-2">
                                                <SecondaryButton size="sm" onClick={() => openEdit(sup)}>Edit</SecondaryButton>
                                                <DangerButton size="sm" onClick={() => handleDelete(sup.id)}>Hapus</DangerButton>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                                {suppliers.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell colSpan={5} className="text-center py-4">Belum ada supplier</Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
