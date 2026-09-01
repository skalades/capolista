import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import { format } from 'date-fns';

export default function OpnameCreate({ stokList }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (stokList) {
      setItems(stokList.map(bahan => ({
        bahan_id: bahan.id,
        nama_bahan: bahan.nama_bahan,
        satuan: bahan.satuan,
        stok_sistem: bahan.jumlah_stok,
        stok_fisik: '',
        keterangan_selisih: ''
      })));
    }
  }, [stokList]);

  const { data, setData, post, processing, errors } = useForm({
    tanggal: format(new Date(), 'yyyy-MM-dd'),
    catatan: '',
    items: []
  });

  useEffect(() => {
    setData('items', items);
  }, [items]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('gudang.opname.store'));
  };

  return (
    <AppLayout title="Buat Stok Opname">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card title="Informasi Opname">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                  <input 
                    type="date" 
                    value={data.tanggal} 
                    onChange={e => setData('tanggal', e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.tanggal && <div className="text-red-500 text-xs mt-1">{errors.tanggal}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Catatan (Opsional)</label>
                  <textarea 
                    value={data.catatan}
                    onChange={e => setData('catatan', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card title="Daftar Bahan" className="overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <Table.Head>
                    <Table.HeadCell>Bahan</Table.HeadCell>
                    <Table.HeadCell>Stok Sistem</Table.HeadCell>
                    <Table.HeadCell>Stok Fisik</Table.HeadCell>
                    <Table.HeadCell>Selisih</Table.HeadCell>
                    <Table.HeadCell>Keterangan (Jika ada selisih)</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {items.map((item, index) => {
                      const selisih = item.stok_fisik !== '' ? Number(item.stok_fisik) - Number(item.stok_sistem) : 0;
                      return (
                        <Table.Row key={item.bahan_id}>
                          <Table.Cell>
                            <div className="font-medium text-gray-900">{item.nama_bahan}</div>
                            <div className="text-sm text-gray-500">{item.satuan}</div>
                          </Table.Cell>
                          <Table.Cell className="font-bold">{item.stok_sistem}</Table.Cell>
                          <Table.Cell>
                            <input 
                              type="number"
                              step="0.01"
                              value={item.stok_fisik}
                              onChange={e => handleItemChange(index, 'stok_fisik', e.target.value)}
                              className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder="Fisik"
                            />
                          </Table.Cell>
                          <Table.Cell>
                            {item.stok_fisik !== '' && (
                              <span className={`font-medium ${selisih > 0 ? 'text-green-600' : selisih < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                {selisih > 0 ? '+' : ''}{selisih}
                              </span>
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            <input 
                              type="text"
                              value={item.keterangan_selisih}
                              onChange={e => handleItemChange(index, 'keterangan_selisih', e.target.value)}
                              disabled={selisih === 0}
                              className={`block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${selisih === 0 ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-indigo-500 focus:ring-indigo-500'}`}
                              placeholder={selisih !== 0 ? 'Wajib jika selisih' : ''}
                            />
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </div>
              <div className="mt-4 flex justify-end gap-3 p-4 border-t">
                <Link href={route('gudang.opname.index')} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Batal
                </Link>
                <button type="submit" disabled={processing} className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Simpan Draft
                </button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </AppLayout>
  );
}
