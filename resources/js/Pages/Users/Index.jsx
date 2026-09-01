import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';
import SearchFilter from '@/Components/SearchFilter';
import { Link, router } from '@inertiajs/react';
import { PlusIcon } from '@heroicons/react/20/solid';

export default function UserIndex({ users, roles = [], filters = {} }) {
    const handleSearch = (search) => {
        router.get(route('users.index'), { search, role: filters.role }, { preserveState: true, replace: true });
    };

    const handleRoleFilter = (e) => {
        router.get(route('users.index'), { search: filters.search, role: e.target.value }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout 
            title="Kelola Pengguna"
            headerActions={
                <Link
                    href={route('users.create')}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                    <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    Tambah Pengguna
                </Link>
            }
        >
            <Card className="mb-6">
                <div className="flex gap-4 items-center">
                    <div className="w-64">
                        <SearchFilter value={filters.search} onChange={handleSearch} placeholder="Cari nama atau email..." />
                    </div>
                    <select
                        value={filters.role || ''}
                        onChange={handleRoleFilter}
                        className="block w-48 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                        <option value="">Semua Role</option>
                        {roles.map(r => (
                            <option key={r.id} value={r.name}>{r.name}</option>
                        ))}
                    </select>
                </div>
            </Card>

            <Card>
                <Table>
                    <Table.Head>
                        <Table.HeadCell>Nama</Table.HeadCell>
                        <Table.HeadCell>Email</Table.HeadCell>
                        <Table.HeadCell>Role</Table.HeadCell>
                        <Table.HeadCell>Divisi</Table.HeadCell>
                        <Table.HeadCell>Level Akses</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                        <Table.HeadCell>Aksi</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {users?.data?.length > 0 ? (
                            users.data.map((user) => (
                                <Table.Row key={user.id}>
                                    <Table.Cell className="font-medium">{user.name}</Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>{user.roles?.[0]?.name || '-'}</Table.Cell>
                                    <Table.Cell>{user.divisi || '-'}</Table.Cell>
                                    <Table.Cell>{user.level_akses}</Table.Cell>
                                    <Table.Cell>
                                        <Badge color={user.is_active ? 'green' : 'red'}>
                                            {user.is_active ? 'Aktif' : 'Non-aktif'}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link href={route('users.edit', user.id)} className="text-blue-600 hover:text-blue-900 mr-3">
                                            Edit
                                        </Link>
                                        <button className="text-gray-600 hover:text-gray-900">
                                            Toggle Status
                                        </button>
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        ) : (
                            <Table.Row>
                                <Table.Cell colSpan={7} className="text-center text-gray-500 py-8">
                                    Tidak ada data pengguna.
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>

                {users && (
                    <div className="mt-4">
                        <Pagination 
                            links={users.links} 
                            from={users.from} 
                            to={users.to} 
                            total={users.total} 
                        />
                    </div>
                )}
            </Card>
        </AppLayout>
    );
}

