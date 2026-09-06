import React from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Badge from '@/Components/Badge';
import { format } from 'date-fns';

export default function OpnameShow({ opname }) {
  const { auth } = usePage().props;
  const isManager = auth.user.level_akses <= 2; // Level 0,1,2 for approval

  const { post: postSubmit, processing: submitProcessing } = useForm();
  const { post: postApprove, processing: approveProcessing } = useForm({
    action: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'gray';
      case 'menunggu_approval': return 'yellow';
      case 'disetujui': return 'green';
      case 'ditolak': return 'red';
      default: return 'gray';
    }
  };

  const formatStatus = (status) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleSubmit = () => {
    if (confirm('Yakin ingin submit opname ini untuk approval?')) {
      postSubmit(route('gudang.opname.submit', opname.id));
    }
  };

  const handleApprove = (action) => {
    const text = action === 'approve' ? 'menyetujui' : 'menolak';
    if (confirm(`Yakin ingin ${text} opname ini?`)) {
      postApprove(route('gudang.opname.approve', opname.id), {
        data: { action }
      });
    }
  };

  return (
    <AppLayout 
      title={`Detail Stok Opname #${opname.id}`}
      headerActions={
        <Link href={route('gudang.opname.index')} className="text-gray-500 hover:text-gray-700 font-medium">
          &larr; Kembali ke Daftar
        </Link>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-1">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Opname</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <Badge color={getStatusColor(opname.status)}>{formatStatus(opname.status)}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tanggal</dt>
                <dd className="mt-1 text-sm text-gray-900">{format(new Date(opname.tanggal), 'dd MMMM yyyy')}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Dibuat Oleh</dt>
                <dd className="mt-1 text-sm text-gray-900">{opname.pembuat?.name}</dd>
              </div>
              {opname.catatan && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Catatan</dt>
                  <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{opname.catatan}</dd>
                </div>
              )}
              {opname.disetujui_oleh && (
                <>
                  <div className="pt-4 border-t border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">{opname.status === 'disetujui' ? 'Disetujui Oleh' : 'Ditolak Oleh'}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{opname.penyetuju?.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Pada Tanggal</dt>
                    <dd className="mt-1 text-sm text-gray-900">{format(new Date(opname.disetujui_at), 'dd MMM yyyy HH:mm')}</dd>
                  </div>
                </>
              )}
            </dl>

            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col gap-3">
              {opname.status === 'draft' && (
                <button 
                  onClick={handleSubmit} 
                  disabled={submitProcessing}
                  className="w-full justify-center inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Submit untuk Approval
                </button>
              )}
              
              {opname.status === 'menunggu_approval' && isManager && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleApprove('approve')} 
                    disabled={approveProcessing}
                    className="flex-1 justify-center inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Setujui
                  </button>
                  <button 
                    onClick={() => handleApprove('reject')} 
                    disabled={approveProcessing}
                    className="flex-1 justify-center inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Tolak
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card title="Daftar Bahan" className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <Table.Head>
                  <Table.HeadCell>Bahan</Table.HeadCell>
                  <Table.HeadCell className="text-right">Stok Sistem</Table.HeadCell>
                  <Table.HeadCell className="text-right">Stok Fisik</Table.HeadCell>
                  <Table.HeadCell className="text-right">Selisih</Table.HeadCell>
                  <Table.HeadCell>Keterangan</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {opname.items.map((item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>
                        <div className="font-medium text-gray-900">{item.nama_bahan}</div>
                        <div className="text-sm text-gray-500">{item.satuan}</div>
                      </Table.Cell>
                      <Table.Cell className="text-right">{item.stok_sistem}</Table.Cell>
                      <Table.Cell className="text-right font-bold">{item.stok_fisik ?? '-'}</Table.Cell>
                      <Table.Cell className="text-right">
                        {item.selisih !== null ? (
                          <span className={`font-medium ${item.selisih > 0 ? 'text-green-600' : item.selisih < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                            {item.selisih > 0 ? '+' : ''}{item.selisih}
                          </span>
                        ) : '-'}
                      </Table.Cell>
                      <Table.Cell>{item.keterangan_selisih || '-'}</Table.Cell>
                    </Table.Row>
                  ))}
                  {opname.items.length === 0 && (
                    <Table.Row>
                      <Table.Cell colSpan={5} className="text-center py-4 text-gray-500">Tidak ada data item.</Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
