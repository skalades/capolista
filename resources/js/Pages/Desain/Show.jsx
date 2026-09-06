import React, { useState } from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Badge from '@/Components/Badge';
import Card from '@/Components/Card';
import StatusTimeline from '@/Components/StatusTimeline';
import ConfirmModal from '@/Components/ConfirmModal';

const DESAIN_STATUS_COLORS = { menunggu: 'gray', dikerjakan: 'blue', revisi: 'yellow', disetujui: 'green' };
const DESAIN_STATUS_LABELS = { menunggu: 'Menunggu', dikerjakan: 'Dikerjakan', revisi: 'Revisi', disetujui: 'Disetujui' };

export default function Show({ order }) {
  const { auth } = usePage().props;
  const { data: mockupData, setData: setMockupData, post: postMockup, processing: mockupProcessing } = useForm({
    file_mockup: null,
  });
  
  const { data: rejectData, setData: setRejectData, post: postReject, processing: rejectProcessing } = useForm({
    catatan_revisi: '',
  });

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const handleMockupSubmit = (e) => {
    e.preventDefault();
    postMockup(route('desain.upload-mockup', order.id));
  };

  const handleApprove = () => {
    router.post(route('desain.approve', order.desain.id));
  };

  const handleReject = (e) => {
    e.preventDefault();
    postReject(route('desain.reject', order.desain.id), {
      onSuccess: () => setIsRejectModalOpen(false)
    });
  };

  return (
    <AppLayout title={`Desain ${order.no_order}`}>
      <div className="mb-6 flex space-x-2 text-sm text-gray-500">
        <Link href={route('desain.index')} className="hover:text-brand-600">Desain</Link>
        <span>/</span>
        <span className="text-gray-900">{order.no_order}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card title="Info Order">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{order.customer?.nama} ({order.customer?.kontak})</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jenis Produk</p>
                <p className="font-medium">{order.jenis_produk}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jumlah</p>
                <p className="font-medium">{order.jumlah}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="font-medium">{new Date(order.deadline).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Catatan Desain</p>
              <p className="whitespace-pre-line text-sm mt-1">{order.catatan_desain || '-'}</p>
            </div>
          </Card>

          <Card title="Mockup Desain">
            {order.desain ? (
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm">Versi: {order.desain.versi}</p>
                  <p className="text-sm">Dikerjakan oleh: {order.desain.pekerja?.name || '-'}</p>
                </div>
                <Badge color={DESAIN_STATUS_COLORS[order.desain.status]}>
                  {DESAIN_STATUS_LABELS[order.desain.status]}
                </Badge>
              </div>
            ) : null}

            {order.desain?.file_mockup ? (
              <div className="mb-4 space-y-3">
                {/\.(jpg|jpeg|png|gif|webp)$/i.test(order.desain.file_mockup) && (
                  <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                    <img 
                      src={`/storage/${order.desain.file_mockup}`} 
                      alt="Mockup Desain" 
                      className="max-w-full h-auto max-h-96 object-contain rounded"
                    />
                  </div>
                )}
                <a href={`/storage/${order.desain.file_mockup}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  {/\.(jpg|jpeg|png|gif|webp)$/i.test(order.desain.file_mockup) ? 'Buka Ukuran Penuh' : 'Lihat / Unduh File Mockup'}
                </a>
              </div>
            ) : (
              <form onSubmit={handleMockupSubmit} className="mb-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload Mockup</label>
                  <input type="file" onChange={(e) => setMockupData('file_mockup', e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100" />
                </div>
                <button type="submit" disabled={mockupProcessing} className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Upload
                </button>
              </form>
            )}

            {auth.user.level_akses <= 2 && order.desain && order.desain.status !== 'disetujui' && (
              <div className="flex space-x-2 mt-4 pt-4 border-t">
                <button onClick={handleApprove} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Setujui
                </button>
                <button onClick={() => setIsRejectModalOpen(true)} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Tolak/Revisi
                </button>
              </div>
            )}
          </Card>

          <Card title="File Pendukung">
            <ul className="space-y-2">
              {order.orderFiles?.map((file) => (
                <li key={file.id}>
                  <a href={`/storage/${file.path}`} className="text-brand-600 hover:underline text-sm">{file.nama_file}</a>
                </li>
              ))}
              {(!order.orderFiles || order.orderFiles.length === 0) && <p className="text-sm text-gray-500">Tidak ada file pendukung.</p>}
            </ul>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card title="Riwayat Status">
            <StatusTimeline logs={order.orderLogs} />
          </Card>
        </div>
      </div>

      <ConfirmModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Revisi Desain"
      >
        <form onSubmit={handleReject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Catatan Revisi</label>
            <textarea
              value={rejectData.catatan_revisi}
              onChange={(e) => setRejectData('catatan_revisi', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setIsRejectModalOpen(false)} className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Batal
            </button>
            <button type="submit" disabled={rejectProcessing} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Kirim Revisi
            </button>
          </div>
        </form>
      </ConfirmModal>
    </AppLayout>
  );
}
