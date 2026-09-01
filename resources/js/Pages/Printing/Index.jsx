import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Badge from '@/Components/Badge';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Pagination from '@/Components/Pagination';
import EmptyState from '@/Components/EmptyState';
import SearchFilter from '@/Components/SearchFilter';

const PRINTING_STATUS_COLORS = { menunggu: 'gray', proses: 'blue', selesai: 'green' };
const PRINTING_STATUS_LABELS = { menunggu: 'Menunggu', proses: 'Proses', selesai: 'Selesai' };

export default function Index({ orders, filters }) {
  return (
    <AppLayout title={`Antrian Printing (${orders?.total || 0})`}>
      <Card className="mb-6">
        <SearchFilter filters={filters} routeName="printing.index" />
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
                  <Table.HeadCell>Metode Cetak</Table.HeadCell>
                  <Table.HeadCell>Est. Selesai</Table.HeadCell>
                  <Table.HeadCell>Status Printing</Table.HeadCell>
                  <Table.HeadCell>Aksi</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {orders.data.map((order) => (
                  <Table.Row key={order.id}>
                    <Table.Cell className="font-medium">{order.no_order}</Table.Cell>
                    <Table.Cell>{order.customer?.nama}</Table.Cell>
                    <Table.Cell>{order.jenis_produk}</Table.Cell>
                    <Table.Cell>{order.jumlah}</Table.Cell>
                    <Table.Cell>{order.printing?.metode_cetak || '-'}</Table.Cell>
                    <Table.Cell>{order.printing?.estimasi_selesai ? new Date(order.printing.estimasi_selesai).toLocaleDateString('id-ID') : '-'}</Table.Cell>
                    <Table.Cell>
                      <Badge color={PRINTING_STATUS_COLORS[order.printing?.status || 'menunggu']}>
                        {PRINTING_STATUS_LABELS[order.printing?.status || 'menunggu']}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Link href={route('printing.show', order.id)} className="text-indigo-600 hover:text-indigo-900 font-medium mr-3">
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
          <EmptyState title="Tidak ada antrian printing" description="Belum ada order yang masuk ke tahap printing." />
        )}
      </Card>
    </AppLayout>
  );
}
