import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import { useForm, Link } from '@inertiajs/react';

export default function UserCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        divisi: '',
        level_akses: '',
        is_active: true,
        nik: '',
        jabatan: '',
        tanggal_masuk: '',
        tipe_gaji: '',
        tarif_default: '',
        tarif_lembur: '',
        no_hp: '',
        alamat: '',
        mesin_pos: '',
    });

    const roles = ['superadmin', 'owner', 'admin', 'kepala_divisi', 'staf', 'customer'];
    const divisis = ['Desain', 'Printing', 'Pemasangan', 'Produksi', 'Gudang', 'Cutting', 'Jahit', 'HR/Personalia', 'Keuangan', 'Pembelian'];
    const tipeGajis = ['borongan', 'harian', 'bulanan'];
    
    // Auto set level_akses based on role
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
        post(route('users.store'));
    };

    const showDivisi = data.role === 'kepala_divisi' || data.role === 'staf';

    return (
        <AppLayout title="Tambah Pengguna">
            <Card className="max-w-4xl mx-auto">
                <form onSubmit={submit} className="space-y-8">
                    
                    <div>
                        <h2 className="text-lg font-semibold leading-7 text-gray-900">Informasi Dasar</h2>
                        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Nama</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                />
                                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                />
                                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Konfirmasi Password</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Role</label>
                                <select
                                    value={data.role}
                                    onChange={e => handleRoleChange(e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                >
                                    <option value="">Pilih Role</option>
                                    {roles.map(r => <option key={r} value={r}>{r.replace('_', ' ').toUpperCase()}</option>)}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Level Akses</label>
                                <input
                                    type="number"
                                    value={data.level_akses}
                                    onChange={e => setData('level_akses', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6 bg-gray-50"
                                />
                            </div>

                            {showDivisi && (
                                <div>
                                    <label className="block text-sm font-medium leading-6 text-gray-900">Divisi</label>
                                    <select
                                        value={data.divisi}
                                        onChange={e => setData('divisi', e.target.value)}
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                    >
                                        <option value="">Pilih Divisi</option>
                                        {divisis.map(d => <option key={d} value={d.toLowerCase()}>{d}</option>)}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Status Aktif</label>
                                <div className="mt-2 flex items-center h-9">
                                    <input
                                        id="is_active"
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={e => setData('is_active', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                    />
                                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                        Aktif
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr />

                    <div>
                        <h2 className="text-lg font-semibold leading-7 text-gray-900">Data HR & Penggajian</h2>
                        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">NIK</label>
                                <input
                                    type="text"
                                    value={data.nik}
                                    onChange={e => setData('nik', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Jabatan</label>
                                <input
                                    type="text"
                                    value={data.jabatan}
                                    onChange={e => setData('jabatan', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Tanggal Masuk</label>
                                <input
                                    type="date"
                                    value={data.tanggal_masuk}
                                    onChange={e => setData('tanggal_masuk', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Tipe Gaji</label>
                                <select
                                    value={data.tipe_gaji}
                                    onChange={e => setData('tipe_gaji', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                >
                                    <option value="">Pilih Tipe Gaji</option>
                                    {tipeGajis.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Nominal Gaji Pokok/Harian (Rp)</label>
                                <input
                                    type="number"
                                    value={data.tarif_default}
                                    onChange={e => setData('tarif_default', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Tarif Lembur per Jam (Rp)</label>
                                <input
                                    type="number"
                                    value={data.tarif_lembur}
                                    onChange={e => setData('tarif_lembur', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Nomor HP</label>
                                <input
                                    type="text"
                                    value={data.no_hp}
                                    onChange={e => setData('no_hp', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Mesin / Pos</label>
                                <input
                                    type="text"
                                    value={data.mesin_pos}
                                    onChange={e => setData('mesin_pos', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                    placeholder="Contoh: Mesin Jahit 1"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Alamat</label>
                                <textarea
                                    value={data.alamat}
                                    onChange={e => setData('alamat', e.target.value)}
                                    rows={3}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <Link href={route('users.index')} className="text-sm font-semibold leading-6 text-gray-900">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-navy px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-navy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:opacity-50"
                        >
                            Simpan Pengguna
                        </button>
                    </div>
                </form>
            </Card>
        </AppLayout>
    );
}

