import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, totalUsers, activeUsers, totalRoles, totalDivisi }) {
    return (
        <AppLayout
            title="Superadmin Dashboard"
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-500 text-sm">Total User</div>
                            <div className="text-3xl font-bold">{totalUsers}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-500 text-sm">User Aktif</div>
                            <div className="text-3xl font-bold text-green-600">{activeUsers}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-500 text-sm">Total Role</div>
                            <div className="text-3xl font-bold">{totalRoles}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-500 text-sm">Total Divisi</div>
                            <div className="text-3xl font-bold">{totalDivisi}</div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
                            <div className="flex gap-4">
                                <Link
                                    href={route('superadmin.roles')}
                                    className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
                                >
                                    Kelola Roles
                                </Link>
                                <Link
                                    href={route('superadmin.sistem')}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    Informasi Sistem
                                </Link>
                                <Link
                                    href={route('superadmin.settings')}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    Pengaturan Sistem
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
