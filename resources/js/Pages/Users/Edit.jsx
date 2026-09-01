import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import { useForm, Link } from '@inertiajs/react';

export default function UserEdit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.roles?.[0]?.name || '',
        divisi: user?.divisi || '',
        level_akses: user?.level_akses || '',
        is_active: user?.is_active ?? true,
    });

    const roles = ['superadmin', 'owner', 'admin', 'kepala_divisi', 'staf', 'customer'];
    const divisis = ['Desain', 'Printing', 'Pemasangan', 'Produksi', 'Gudang'];
    
    const handleRoleChange = (role) => {
        let level = 4; // default staf
        if (role === 'superadmin') level = 0;
        else if (role === 'owner') level = 1;
        else if (role === 'admin') level = 2;
        else if (role === 'kepala_divisi') level = 3;
        else if (role === 'customer') level = 5;

        setData(data => ({
            ...data,
            role,
            level_akses: level,
            divisi: (role === 'kepala_divisi' || role === 'staf') ? data.divisi : ''
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    const showDivisi = data.role === 'kepala_divisi' || data.role === 'staf';

    return (
        <AppLayout title={`Edit Pengguna: ${user?.name}`}>
            <Card className="max-w-2xl mx-auto">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">Nama</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Role</label>
                            <select
                                value={data.role}
                                onChange={e => handleRoleChange(e.target.value)}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                                <option value="">Pilih Role</option>
                                {roles.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Level Akses</label>
                            <input
                                type="number"
                                value={data.level_akses}
                                onChange={e => setData('level_akses', e.target.value)}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-50"
                            />
                        </div>
                    </div>

                    {showDivisi && (
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Divisi</label>
                            <select
                                value={data.divisi}
                                onChange={e => setData('divisi', e.target.value)}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                                <option value="">Pilih Divisi</option>
                                {divisis.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    )}

                    <div className="flex items-center">
                        <input
                            id="is_active"
                            type="checkbox"
                            checked={data.is_active}
                            onChange={e => setData('is_active', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                            Status Aktif
                        </label>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <Link href={route('users.index')} className="text-sm font-semibold leading-6 text-gray-900">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </Card>
        </AppLayout>
    );
}

