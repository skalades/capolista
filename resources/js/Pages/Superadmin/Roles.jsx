import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Roles({ auth, roles }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        name: '',
    });

    const openCreateModal = () => {
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (role) => {
        setSelectedRole(role);
        setData('name', role.name);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (role) => {
        setSelectedRole(role);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        reset();
        setSelectedRole(null);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        post(route('superadmin.roles.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        patch(route('superadmin.roles.update', selectedRole.id), {
            onSuccess: () => closeModal(),
        });
    };

    const handleDelete = (e) => {
        e.preventDefault();
        destroy(route('superadmin.roles.destroy', selectedRole.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AppLayout
            title="Kelola Roles"
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Daftar Role</h3>
                                <PrimaryButton onClick={openCreateModal}>Tambah Role</PrimaryButton>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guard</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {roles.map((role) => (
                                            <tr key={role.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{role.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role.guard_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button onClick={() => openEditModal(role)} className="text-brand-600 hover:text-brand-900 mr-4">Edit</button>
                                                    <button onClick={() => openDeleteModal(role)} className="text-red-600 hover:text-red-900">Hapus</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {roles.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    Belum ada data role.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Create */}
            <Modal show={isCreateModalOpen} onClose={closeModal}>
                <form onSubmit={handleCreate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Tambah Role Baru</h2>
                    <div className="mt-4">
                        <InputLabel htmlFor="name" value="Nama Role" />
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 block w-full"
                            isFocused
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal Edit */}
            <Modal show={isEditModalOpen} onClose={closeModal}>
                <form onSubmit={handleEdit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Edit Role</h2>
                    <div className="mt-4">
                        <InputLabel htmlFor="name" value="Nama Role" />
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 block w-full"
                            isFocused
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal Delete */}
            <Modal show={isDeleteModalOpen} onClose={closeModal}>
                <form onSubmit={handleDelete} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Hapus Role</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Apakah Anda yakin ingin menghapus role <strong>{selectedRole?.name}</strong>?
                    </p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <DangerButton className="ml-3" disabled={processing}>Hapus</DangerButton>
                    </div>
                </form>
            </Modal>

        </AppLayout>
    );
}
