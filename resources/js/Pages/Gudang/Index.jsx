import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Alert from '@/Components/Alert';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Badge from '@/Components/Badge';
import EmptyState from '@/Components/EmptyState';
import { ArchiveBoxIcon } from '@heroicons/react/24/outline';

export default function Index({ ordersPacking, lowStockCount }) {
  const PACKING_STATUS_COLORS = { packing: 'gold', siap_kirim: 'accent', dikirim: 'accent' };
  const PACKING_STATUS_LABELS = { packing: 'Packing', siap_kirim: 'Siap Kirim', dikirim: 'Dikirim' };

  return (
    <AppLayout 
      title="Gudang & Pengiriman"
      headerActions={
        <div className="flex gap-2">
          <Link href={route('gudang.opname.index')} className="inline-flex items-center justify-center rounded bg-panel border border-line px-3 py-1.5 text-[12.5px] font-medium font-sans text-ink shadow-sm transition-colors hover:bg-line/20">
            Stok Opname
          </Link>
          <Link href={route('gudang.stok')} className="inline-flex items-center justify-center rounded bg-navy px-3 py-1.5 text-[12.5px] font-medium font-sans text-white shadow-sm transition-colors hover:bg-navy/90">
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
        {(!ordersPacking?.data || ordersPacking.data.length === 0) ? (
          <EmptyState 
            title="Tidak ada order" 
            description="Tidak ada order yang sedang dalam antrean packing atau pengiriman."
            icon={ArchiveBoxIcon} 
          />
        ) : (
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
              {ordersPacking.data.map(order => (
                <Table.Row key={order.id}>
                  <Table.Cell className="font-medium font-mono text-ink text-[13px]">{order.no_order}</Table.Cell>
                  <Table.Cell>{order.customer?.nama}</Table.Cell>
                  <Table.Cell>{order.jenis_produk}</Table.Cell>
                  <Table.Cell>{order.jumlah}</Table.Cell>
                  <Table.Cell>
                    <Badge status={PACKING_STATUS_COLORS[order.packing?.status || 'packing']}>
                      {PACKING_STATUS_LABELS[order.packing?.status || 'packing']}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{order.packing?.kurir || '-'}</Table.Cell>
                  <Table.Cell className="font-mono text-[12px]">{order.packing?.no_resi || '-'}</Table.Cell>
                  <Table.Cell>{order.packing?.tanggal_kirim ? new Date(order.packing.tanggal_kirim).toLocaleDateString('id-ID') : '-'}</Table.Cell>
                  <Table.Cell>
                    <Link href={route('gudang.packing.show', order.id)} className="text-[12px] font-medium text-navy hover:text-navy/70 transition-colors">
                      Kelola Packing
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Card>
    </AppLayout>
  );
}
