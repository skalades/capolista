import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import StatusTimeline from '@/Components/StatusTimeline';

export default function Show({ order }) {
  const printing = order.printing || {};
  
  const formatDateForInput = (dateString) => dateString ? dateString.split('T')[0] : '';

  const { data: updateData, setData: setUpdateData, patch: patchUpdate, processing: updateProcessing, errors: updateErrors } = useForm({
    metode_cetak: printing.metode_cetak || '',
    jumlah_warna: printing.jumlah_warna || '',
    estimasi_selesai: formatDateForInput(printing.estimasi_selesai),
    tanggal_mulai: formatDateForInput(printing.tanggal_mulai),
  });

  const { data: completeData, setData: setCompleteData, post: postComplete, processing: completeProcessing, errors: completeErrors } = useForm({
    status_qc: 'lulus',
    catatan_qc: '',
    foto_qc: null,
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    patchUpdate(route('printing.update', printing.id));
  };

  const handleComplete = (e) => {
    e.preventDefault();
    postComplete(route('printing.complete', printing.id));
  };

  return (
    <AppLayout title={`Printing ${order.no_order}`}>
      <div className="mb-6 flex space-x-2 text-sm text-gray-500">
        <Link href={route('printing.index')} className="hover:text-indigo-600">Printing</Link>
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

          <Card title="Detail Printing">
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Metode Cetak</label>
                  <select value={updateData.metode_cetak} onChange={e => setUpdateData('metode_cetak', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value="">Pilih Metode</option>
                    <option value="sablon">Sablon</option>
                    <option value="dtf">DTF</option>
                    <option value="dtg">DTG</option>
                  </select>
                  {updateErrors.metode_cetak && <p className="text-red-500 text-xs mt-1">{updateErrors.metode_cetak}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Jumlah Warna</label>
                  <input type="number" value={updateData.jumlah_warna} onChange={e => setUpdateData('jumlah_warna', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  {updateErrors.jumlah_warna && <p className="text-red-500 text-xs mt-1">{updateErrors.jumlah_warna}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
                  <input type="date" value={updateData.tanggal_mulai} onChange={e => setUpdateData('tanggal_mulai', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  {updateErrors.tanggal_mulai && <p className="text-red-500 text-xs mt-1">{updateErrors.tanggal_mulai}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estimasi Selesai</label>
                  <input type="date" value={updateData.estimasi_selesai} onChange={e => setUpdateData('estimasi_selesai', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  {updateErrors.estimasi_selesai && <p className="text-red-500 text-xs mt-1">{updateErrors.estimasi_selesai}</p>}
                </div>
              </div>
              {printing.status !== 'selesai' && (
                <button type="submit" disabled={updateProcessing} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Simpan Perubahan
                </button>
              )}
            </form>
          </Card>

          {printing.status !== 'selesai' && (
            <Card title="Selesaikan Printing (QC)">
              <form onSubmit={handleComplete} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status QC</label>
                  <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" value="lulus" checked={completeData.status_qc === 'lulus'} onChange={e => setCompleteData('status_qc', e.target.value)} className="text-indigo-600" />
                      <span className="ml-2 text-sm">Lulus</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" value="gagal" checked={completeData.status_qc === 'gagal'} onChange={e => setCompleteData('status_qc', e.target.value)} className="text-indigo-600" />
                      <span className="ml-2 text-sm">Gagal</span>
                    </label>
                  </div>
                  {completeErrors.status_qc && <p className="text-red-500 text-xs mt-1">{completeErrors.status_qc}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Catatan QC</label>
                  <textarea value={completeData.catatan_qc} onChange={e => setCompleteData('catatan_qc', e.target.value)} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
                  {completeErrors.catatan_qc && <p className="text-red-500 text-xs mt-1">{completeErrors.catatan_qc}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Foto QC</label>
                  <input type="file" onChange={e => setCompleteData('foto_qc', e.target.files[0])} className="mt-1 block w-full text-sm" />
                  {completeErrors.foto_qc && <p className="text-red-500 text-xs mt-1">{completeErrors.foto_qc}</p>}
                </div>
                <button type="submit" disabled={completeProcessing} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Selesaikan & Lanjut Pemasangan
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
