import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';

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
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Supplier</h2>}
        >
            <Head title="Supplier" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="flex justify-end">
                        <Button onClick={openCreate}>Tambah Supplier</Button>
                    </div>
                    
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{isEdit ? 'Edit Supplier' : 'Tambah Supplier'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <Label htmlFor="nama">Nama Supplier</Label>
                                    <Input
                                        id="nama"
                                        value={data.nama}
                                        onChange={e => setData('nama', e.target.value)}
                                        required
                                    />
                                    {errors.nama && <p className="text-red-500 text-sm">{errors.nama}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="kontak">Kontak</Label>
                                    <Input
                                        id="kontak"
                                        value={data.kontak}
                                        onChange={e => setData('kontak', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="alamat">Alamat</Label>
                                    <Input
                                        id="alamat"
                                        value={data.alamat}
                                        onChange={e => setData('alamat', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="catatan">Catatan</Label>
                                    <Input
                                        id="catatan"
                                        value={data.catatan}
                                        onChange={e => setData('catatan', e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                                    <Button type="submit" disabled={processing}>Simpan</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Kontak</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Alamat</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {suppliers.map((sup) => (
                                    <TableRow key={sup.id}>
                                        <TableCell>{sup.nama}</TableCell>
                                        <TableCell>{sup.kontak}</TableCell>
                                        <TableCell>{sup.email}</TableCell>
                                        <TableCell>{sup.alamat}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => openEdit(sup)}>Edit</Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(sup.id)}>Hapus</Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {suppliers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-4">Belum ada supplier</TableCell>
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
