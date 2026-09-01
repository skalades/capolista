import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Badge from '@/Components/Badge';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Pagination from '@/Components/Pagination';
import EmptyState from '@/Components/EmptyState';
import SearchFilter from '@/Components/SearchFilter';

const STATUS_COLORS = {
  draft: 'gray', desain: 'blue', procurement: 'yellow', produksi: 'orange',
  printing: 'purple', pemasangan: 'pink', packing: 'teal', dikirim: 'indigo', selesai: 'green'
};

const STATUS_LABELS = {
  draft: 'Draft', desain: 'Desain', procurement: 'Procurement', produksi: 'Produksi',
  printing: 'Printing', pemasangan: 'Pemasangan', packing: 'Packing', dikirim: 'Dikirim', selesai: 'Selesai'
};

const DESAIN_STATUS_COLORS = { menunggu: 'gray', dikerjakan: 'blue', revisi: 'yellow', disetujui: 'green' };
const DESAIN_STATUS_LABELS = { menunggu: 'Menunggu', dikerjakan: 'Dikerjakan', revisi: 'Revisi', disetujui: 'Disetujui' };

export default function Index({ orders, filters }) {
  return (
    <AppLayout title={`Antrian Desain (${orders?.total || 0})`}>
      <Card className="mb-6">
        <SearchFilter filters={filters} routeName="desain.index" />
      </Card>

      <Card>
        {orders?.data?.length > 0 ? (
          <>
            <Table>
              <Table.Head>
                  <Table.HeadCell>No. Order</Table.HeadCell>
                  <Table.HeadCell>Customer</Table.HeadCell>
                  <Table.HeadCell>Jenis Produk</Table.HeadCell>
                  <Table.HeadCell>Jumlah</Table.HeadCell>
                  <Table.HeadCell>Deadline</Table.HeadCell>
                  <Table.HeadCell>Status Desain</Table.HeadCell>
                  <Table.HeadCell>Status Order</Table.HeadCell>
                  <Table.HeadCell>Aksi</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {orders.data.map((order) => (
                  <Table.Row key={order.id}>
                    <Table.Cell className="font-medium">{order.no_order}</Table.Cell>
                    <Table.Cell>{order.customer?.nama}</Table.Cell>
                    <Table.Cell>{order.jenis_produk}</Table.Cell>
                    <Table.Cell>{order.jumlah}</Table.Cell>
                    <Table.Cell>{new Date(order.deadline).toLocaleDateString('id-ID')}</Table.Cell>
                    <Table.Cell>
                      <Badge color={DESAIN_STATUS_COLORS[order.desain?.status || 'menunggu']}>
                        {DESAIN_STATUS_LABELS[order.desain?.status || 'menunggu']}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={STATUS_COLORS[order.status]}>
                        {STATUS_LABELS[order.status]}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Link href={route('desain.show', order.id)} className="text-indigo-600 hover:text-indigo-900 font-medium mr-3">
                        Detail
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <Pagination links={orders.links} className="mt-4" />
          </>
        ) : (
          <EmptyState title="Tidak ada antrian desain" description="Belum ada order yang masuk ke tahap desain." />
        )}
      </Card>
    </AppLayout>
  );
}
