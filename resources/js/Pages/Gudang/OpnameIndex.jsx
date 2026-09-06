import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Pagination from '@/Components/Pagination';
import Badge from '@/Components/Badge';
import { format } from 'date-fns';

export default function OpnameIndex({ opnameList }) {
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

  return (
    <AppLayout 
      title="Stok Opname"
      headerActions={
        <Link href={route('gudang.opname.create')} className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Buat Stok Opname
        </Link>
      }
    >
      <Card>
        <Table>
          <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Tanggal</Table.HeadCell>
              <Table.HeadCell>Dibuat Oleh</Table.HeadCell>
              <Table.HeadCell>Catatan</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Aksi</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {(opnameList?.data || []).map(opname => (
              <Table.Row key={opname.id}>
                <Table.Cell>#{opname.id}</Table.Cell>
                <Table.Cell>{format(new Date(opname.tanggal), 'dd MMM yyyy')}</Table.Cell>
                <Table.Cell>{opname.pembuat?.name}</Table.Cell>
                <Table.Cell>{opname.catatan || '-'}</Table.Cell>
                <Table.Cell>
                  <Badge color={getStatusColor(opname.status)}>{formatStatus(opname.status)}</Badge>
                </Table.Cell>
                <Table.Cell>
                  <Link href={route('gudang.opname.show', opname.id)} className="text-brand-600 hover:text-brand-900 font-medium">
                    Detail
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
            {(!opnameList?.data || opnameList.data.length === 0) && (
              <Table.Row>
                <Table.Cell colSpan={6} className="text-center text-gray-500 py-4">
                  Belum ada data Stok Opname.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <Pagination links={opnameList?.links} className="mt-4" />
      </Card>
    </AppLayout>
  );
}
