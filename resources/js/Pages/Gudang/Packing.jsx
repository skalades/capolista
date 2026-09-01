import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import StatusTimeline from '@/Components/StatusTimeline';

export default function Packing({ order }) {
  const packing = order.packing || {};
  
  const { data, setData, patch, processing } = useForm({
    kurir: packing.kurir || '',
    no_resi: packing.no_resi || '',
    tanggal_kirim: packing.tanggal_kirim || '',
    catatan: packing.catatan || '',
    status: packing.status || 'packing',
  });

  const [checklist, setChecklist] = useState({
    kesesuaian_produk: false,
    kelengkapan_jumlah: false,
    kondisi_bersih: false,
    packing_aman: false
  });

  const handleChecklist = (field) => {
    setChecklist(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    patch(route('gudang.packing.update', packing.id));
  };

  return (
    <AppLayout title={`Packing ${order.no_order}`}>
      <div className="mb-6 flex space-x-2 text-sm text-gray-500">
        <Link href={route('gudang.index')} className="hover:text-indigo-600">Gudang</Link>
        <span>/</span>
        <span className="text-gray-900">{order.no_order}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card title="Info Order">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">Customer</p><p className="font-medium">{order.customer?.nama} ({order.customer?.kontak})</p></div>
              <div><p className="text-sm text-gray-500">Alamat Pengiriman</p><p className="font-medium">{order.customer?.alamat}</p></div>
              <div><p className="text-sm text-gray-500">Jenis Produk</p><p className="font-medium">{order.jenis_produk}</p></div>
              <div><p className="text-sm text-gray-500">Jumlah Total</p><p className="font-medium">{order.jumlah}</p></div>
            </div>
          </Card>

          <Card title="Checklist Packing">
            <div className="space-y-3">
              {Object.keys(checklist).map(key => (
                <label key={key} className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={checklist[key]} onChange={() => handleChecklist(key)} className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-3 text-sm text-gray-700 capitalize">{key.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </Card>

          <Card title="Data Pengiriman">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700">Kurir / Ekspedisi</label><input type="text" value={data.kurir} onChange={e => setData('kurir', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700">No. Resi</label><input type="text" value={data.no_resi} onChange={e => setData('no_resi', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700">Tanggal Kirim</label><input type="date" value={data.tanggal_kirim} onChange={e => setData('tanggal_kirim', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" /></div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status Packing</label>
                  <select value={data.status} onChange={e => setData('status', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value="packing">Sedang Dipacking</option>
                    <option value="siap_kirim">Siap Kirim</option>
                    <option value="dikirim">Dikirim</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Catatan</label>
                <textarea value={data.catatan} onChange={e => setData('catatan', e.target.value)} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
              </div>
              <button type="submit" disabled={processing} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Simpan Data Pengiriman
              </button>
            </form>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card title="Riwayat Status">
            <StatusTimeline logs={order.orderLogs} />
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
