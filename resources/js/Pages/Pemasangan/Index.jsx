import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Badge from '@/Components/Badge';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Pagination from '@/Components/Pagination';
import EmptyState from '@/Components/EmptyState';
import SearchFilter from '@/Components/SearchFilter';

const PEMASANGAN_STATUS_COLORS = { menunggu: 'gold', proses: 'accent', selesai: 'neutral' };
const PEMASANGAN_STATUS_LABELS = { menunggu: 'Menunggu', proses: 'Proses', selesai: 'Selesai' };

export default function Index({ orders, filters }) {
  return (
    <AppLayout 
      title={
        <div className="flex flex-col justify-center mt-1">
            <div className="flex items-center gap-3 leading-none">
                <span>Divisi Pemasangan</span>
                <Badge status="gold">{orders?.total || 0} antrian</Badge>
            </div>
            <span className="text-[12px] text-ink-soft mt-1 font-sans font-normal normal-case tracking-normal leading-none">Kelola antrean pemasangan aksesoris / finishing.</span>
        </div>
      }
    >
      <div className="max-w-7xl mx-auto space-y-6">

          <Card className="mb-6 !p-4">
            <SearchFilter filters={filters} routeName="pemasangan.index" />
          </Card>

          <Card className="!p-0 overflow-hidden">
            {orders?.data?.length > 0 ? (
              <>
                <Table>
                  <Table.Head>
                      <Table.HeadCell>No. Order</Table.HeadCell>
                      <Table.HeadCell>Customer</Table.HeadCell>
                      <Table.HeadCell>Jenis Produk</Table.HeadCell>
                      <Table.HeadCell>Jumlah</Table.HeadCell>
                      <Table.HeadCell>Suhu Heat Press</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell className="text-right">Aksi</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {orders.data.map((order) => (
                      <Table.Row key={order.id}>
                        <Table.Cell className="font-medium font-mono text-[12px]">{order.no_order}</Table.Cell>
                        <Table.Cell className="font-bold text-ink">{order.customer?.nama}</Table.Cell>
                        <Table.Cell>{order.jenis_produk}</Table.Cell>
                        <Table.Cell className="font-bold text-ink">{order.jumlah} pcs</Table.Cell>
                        <Table.Cell>{order.pemasangan?.suhu_heat_press || '-'}</Table.Cell>
                        <Table.Cell>
                          <Badge status={PEMASANGAN_STATUS_COLORS[order.pemasangan?.status || 'menunggu']}>
                            {PEMASANGAN_STATUS_LABELS[order.pemasangan?.status || 'menunggu']}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell className="text-right">
                          <Link href={route('pemasangan.show', order.id)} className="inline-flex items-center justify-center rounded bg-panel border border-line px-3 py-1.5 text-[12px] font-medium text-ink hover:bg-line/20 hover:border-navy transition-colors">
                            Detail
                          </Link>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
                <div className="p-4 border-t border-line bg-panel">
                    <Pagination links={orders.links} />
                </div>
              </>
            ) : (
              <EmptyState title="Tidak ada antrian pemasangan" description="Belum ada order yang masuk ke tahap pemasangan." />
            )}
          </Card>
      </div>
    </AppLayout>
  );
}
