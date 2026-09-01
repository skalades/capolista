import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Alert from '@/Components/Alert';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Badge from '@/Components/Badge';

export default function Index({ ordersPacking, lowStockCount }) {
  const PACKING_STATUS_COLORS = { packing: 'yellow', siap_kirim: 'blue', dikirim: 'green' };
  const PACKING_STATUS_LABELS = { packing: 'Packing', siap_kirim: 'Siap Kirim', dikirim: 'Dikirim' };

  return (
    <AppLayout 
      title="Gudang & Pengiriman"
      headerActions={
        <div className="flex gap-2">
          <Link href={route('gudang.opname.index')} className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Stok Opname
          </Link>
          <Link href={route('gudang.stok')} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Kelola Stok Bahan
          </Link>
        </div>
      }
    >
      {lowStockCount > 0 && (
        <div className="mb-6">
          <Alert type="warning" title={`Perhatian: ${lowStockCount} bahan stoknya menipis atau habis!`} />
        </div>
      )}

      <Card title="Daftar Order untuk Dipacking/Dikirim">
        <Table>
          <Table.Head>
              <Table.HeadCell>No. Order</Table.HeadCell>
              <Table.HeadCell>Customer</Table.HeadCell>
              <Table.HeadCell>Produk</Table.HeadCell>
              <Table.HeadCell>Jumlah</Table.HeadCell>
              <Table.HeadCell>Status Packing</Table.HeadCell>
              <Table.HeadCell>Kurir</Table.HeadCell>
              <Table.HeadCell>No. Resi</Table.HeadCell>
              <Table.HeadCell>Tgl Kirim</Table.HeadCell>
              <Table.HeadCell>Aksi</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {(ordersPacking?.data || []).map(order => (
              <Table.Row key={order.id}>
                <Table.Cell className="font-medium">{order.no_order}</Table.Cell>
                <Table.Cell>{order.customer?.nama}</Table.Cell>
                <Table.Cell>{order.jenis_produk}</Table.Cell>
                <Table.Cell>{order.jumlah}</Table.Cell>
                <Table.Cell>
                  <Badge color={PACKING_STATUS_COLORS[order.packing?.status || 'packing']}>
                    {PACKING_STATUS_LABELS[order.packing?.status || 'packing']}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{order.packing?.kurir || '-'}</Table.Cell>
                <Table.Cell>{order.packing?.no_resi || '-'}</Table.Cell>
                <Table.Cell>{order.packing?.tanggal_kirim ? new Date(order.packing.tanggal_kirim).toLocaleDateString('id-ID') : '-'}</Table.Cell>
                <Table.Cell>
                  <Link href={route('gudang.packing.show', order.id)} className="text-indigo-600 hover:text-indigo-900 font-medium">
                    Kelola Packing
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        {ordersPacking?.data?.length === 0 && <p className="text-center text-sm text-gray-500 py-4">Tidak ada order yang sedang dipacking.</p>}
      </Card>
    </AppLayout>
  );
}
