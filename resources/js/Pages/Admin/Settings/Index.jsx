import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { MapPin, Settings2, Clock, Trash2, PlusCircle, Save } from 'lucide-react';

export default function Index({ locations, shifts, settings }) {
    // State untuk form Tambah Lokasi
    const [showLocationForm, setShowLocationForm] = useState(false);
    const locationForm = useForm({
        id: null,
        name: '',
        latitude: '',
        longitude: '',
        radius_meters: 100,
    });

    // State untuk form Pengaturan Global (Payroll)
    const settingsForm = useForm({
        late_penalty_per_minute: settings.late_penalty_per_minute || '1000',
        overtime_rate_per_hour: settings.overtime_rate_per_hour || '25000',
    });

    // Handle Simpan Lokasi
    const submitLocation = (e) => {
        e.preventDefault();
        locationForm.post('/admin/settings/locations', {
            onSuccess: () => {
                setShowLocationForm(false);
                locationForm.reset();
            }
        });
    };

    // Handle Simpan Settings
    const submitSettings = (e) => {
        e.preventDefault();
        settingsForm.post('/admin/settings/global');
    };

    const deleteLocation = (id) => {
        if (confirm('Yakin ingin menghapus lokasi ini?')) {
            router.delete(`/admin/settings/locations/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Settings2 className="w-8 h-8 text-blue-600" />
                        Panel Admin: Pengaturan Sistem
                    </h1>
                    <p className="text-gray-500 mt-1">Atur radius geofencing, lokasi kantor, dan aturan payroll.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Kiri: Pengaturan Global & Shift */}
                    <div className="md:col-span-1 space-y-8">
                        {/* Pengaturan Payroll */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-4">
                                <span className="bg-orange-100 p-2 rounded-lg text-orange-600"><Settings2 size={18} /></span>
                                Aturan Payroll
                            </h2>
                            <form onSubmit={submitSettings} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Potongan Telat (Rp / Menit)</label>
                                    <input 
                                        type="number" 
                                        value={settingsForm.data.late_penalty_per_minute}
                                        onChange={e => settingsForm.setData('late_penalty_per_minute', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Uang Lembur (Rp / Jam)</label>
                                    <input 
                                        type="number" 
                                        value={settingsForm.data.overtime_rate_per_hour}
                                        onChange={e => settingsForm.setData('overtime_rate_per_hour', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                                <button type="submit" disabled={settingsForm.processing} className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2">
                                    <Save size={16} /> Simpan Aturan
                                </button>
                            </form>
                        </div>

                        {/* Pengaturan Shift */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-4">
                                <span className="bg-purple-100 p-2 rounded-lg text-purple-600"><Clock size={18} /></span>
                                Master Shift
                            </h2>
                            <div className="space-y-3">
                                {shifts.map((s) => (
                                    <div key={s.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <h3 className="font-semibold text-gray-700 text-sm">{s.name}</h3>
                                        <p className="text-xs text-gray-500">{s.start_time} — {s.end_time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Kanan: Master Lokasi Geofencing */}
                    <div className="md:col-span-2">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <span className="bg-green-100 p-2 rounded-lg text-green-600"><MapPin size={18} /></span>
                                    Daftar Lokasi & Radius Absen
                                </h2>
                                <button 
                                    onClick={() => setShowLocationForm(!showLocationForm)}
                                    className="text-sm bg-green-50 text-green-700 font-semibold py-2 px-4 rounded-lg hover:bg-green-100 transition flex items-center gap-2"
                                >
                                    <PlusCircle size={16} /> Tambah Lokasi
                                </button>
                            </div>

                            {/* Form Tambah/Edit Lokasi */}
                            {showLocationForm && (
                                <form onSubmit={submitLocation} className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-xs font-medium text-gray-500">Nama Kantor / Cabang</label>
                                        <input required type="text" value={locationForm.data.name} onChange={e => locationForm.setData('name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 text-sm" placeholder="Contoh: Kantor Cabang Sudirman" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500">Latitude</label>
                                        <input required type="number" step="any" value={locationForm.data.latitude} onChange={e => locationForm.setData('latitude', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500">Longitude</label>
                                        <input required type="number" step="any" value={locationForm.data.longitude} onChange={e => locationForm.setData('longitude', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 text-sm" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-medium text-gray-500">Radius Diizinkan (Meter)</label>
                                        <input required type="number" value={locationForm.data.radius_meters} onChange={e => locationForm.setData('radius_meters', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 text-sm" />
                                    </div>
                                    <div className="col-span-2 flex justify-end gap-2 mt-2">
                                        <button type="button" onClick={() => setShowLocationForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-md">Batal</button>
                                        <button type="submit" disabled={locationForm.processing} className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md">Simpan Lokasi</button>
                                    </div>
                                </form>
                            )}

                            {/* Tabel Lokasi */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 rounded-tl-lg">Nama Lokasi</th>
                                            <th className="px-4 py-3">Koordinat (Lat, Lng)</th>
                                            <th className="px-4 py-3">Radius</th>
                                            <th className="px-4 py-3 text-right rounded-tr-lg">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {locations.length === 0 ? (
                                            <tr><td colSpan="4" className="text-center py-4">Belum ada lokasi terdaftar.</td></tr>
                                        ) : locations.map((loc) => (
                                            <tr key={loc.id} className="border-b">
                                                <td className="px-4 py-3 font-medium text-gray-900">{loc.name}</td>
                                                <td className="px-4 py-3">{loc.latitude}, {loc.longitude}</td>
                                                <td className="px-4 py-3">
                                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">{loc.radius_meters} m</span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button onClick={() => deleteLocation(loc.id)} className="text-red-500 hover:text-red-700 p-1">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
