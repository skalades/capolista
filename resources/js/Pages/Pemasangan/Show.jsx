import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import StatusTimeline from '@/Components/StatusTimeline';

export default function Show({ order }) {
  const pemasangan = order.pemasangan || {};
  
  const { data: updateData, setData: setUpdateData, patch: patchUpdate, processing: updateProcessing } = useForm({
    suhu_heat_press: pemasangan.suhu_heat_press || '',
    waktu_curing: pemasangan.waktu_curing || '',
  });

  const { data: completeData, setData: setCompleteData, post: postComplete, processing: completeProcessing } = useForm({
    status_qc: 'Lulus',
    catatan: '',
    foto_qc: null,
  });

  const [qcChecklist, setQcChecklist] = useState({
    kerekatan: false,
    kerapian: false,
    kebersihan: false,
    warna_sesuai: false
  });

  const handleQcChange = (field) => {
    setQcChecklist(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    patchUpdate(route('pemasangan.update', pemasangan.id));
  };

  const handleComplete = (e) => {
    e.preventDefault();
    postComplete(route('pemasangan.complete', pemasangan.id));
  };

  return (
    <AppLayout title={`Pemasangan ${order.no_order}`}>
      <div className="mb-6 flex space-x-2 text-sm text-gray-500">
        <Link href={route('pemasangan.index')} className="hover:text-indigo-600">Pemasangan</Link>
        <span>/</span>
        <span className="text-gray-900">{order.no_order}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card title="Info Order">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">Customer</p><p className="font-medium">{order.customer?.nama}</p></div>
              <div><p className="text-sm text-gray-500">Jenis Produk</p><p className="font-medium">{order.jenis_produk}</p></div>
              <div><p className="text-sm text-gray-500">Jumlah</p><p className="font-medium">{order.jumlah}</p></div>
            </div>
          </Card>

          <Card title="Parameter Pemasangan">
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Suhu Heat Press</label>
                  <input type="text" value={updateData.suhu_heat_press} onChange={e => setUpdateData('suhu_heat_press', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Misal: 150 C" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Waktu Curing</label>
                  <input type="text" value={updateData.waktu_curing} onChange={e => setUpdateData('waktu_curing', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Misal: 15 detik" />
                </div>
              </div>
              {pemasangan.status !== 'selesai' && (
                <button type="submit" disabled={updateProcessing} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Simpan Parameter
                </button>
              )}
            </form>
          </Card>

          {pemasangan.status !== 'selesai' && (
            <Card title="QC & Selesaikan">
              <form onSubmit={handleComplete} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Checklist QC</label>
                  <div className="space-y-2">
                    {['kerekatan', 'kerapian', 'kebersihan', 'warna_sesuai'].map((item) => (
                      <label key={item} className="flex items-center">
                        <input type="checkbox" checked={qcChecklist[item]} onChange={() => handleQcChange(item)} className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{item.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status QC</label>
                  <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" value="Lulus" checked={completeData.status_qc === 'Lulus'} onChange={e => setCompleteData('status_qc', e.target.value)} className="text-indigo-600" />
                      <span className="ml-2 text-sm">Lulus</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" value="Gagal" checked={completeData.status_qc === 'Gagal'} onChange={e => setCompleteData('status_qc', e.target.value)} className="text-indigo-600" />
                      <span className="ml-2 text-sm">Gagal</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Catatan</label>
                  <textarea value={completeData.catatan} onChange={e => setCompleteData('catatan', e.target.value)} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Foto QC</label>
                  <input type="file" onChange={e => setCompleteData('foto_qc', e.target.files[0])} className="mt-1 block w-full text-sm" />
                </div>
                <button type="submit" disabled={completeProcessing} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Selesaikan Pemasangan
                </button>
              </form>
            </Card>
          )}
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
