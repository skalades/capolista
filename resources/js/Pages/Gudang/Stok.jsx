import React, { useState, Fragment } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Pagination from '@/Components/Pagination';
import SearchFilter from '@/Components/SearchFilter';
import Badge from '@/Components/Badge';
import { Dialog, Transition } from '@headlessui/react';

export default function Stok({ stokList, filters }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [mutasiBahan, setMutasiBahan] = useState(null);

  const { data: addData, setData: setAddData, post: postAdd, processing: addProcessing, reset: resetAdd } = useForm({
    nama_bahan: '', satuan: '', jumlah_masuk: '', minimum_stok: '', keterangan: ''
  });

  const { data: mutasiData, setData: setMutasiData, patch: patchMutasi, processing: mutasiProcessing, reset: resetMutasi } = useForm({
    tipe: 'masuk', jumlah: '', keterangan: ''
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    postAdd(route('gudang.stok.store'), {
      onSuccess: () => { setIsAddModalOpen(false); resetAdd(); }
    });
  };

  const handleMutasiSubmit = (e) => {
    e.preventDefault();
    if(mutasiBahan) {
      patchMutasi(route('gudang.stok.update', mutasiBahan.id), {
        onSuccess: () => { setMutasiBahan(null); resetMutasi(); }
      });
    }
  };

  const openMutasi = (bahan) => {
    setMutasiBahan(bahan);
  };

  return (
    <AppLayout 
      title="Kelola Stok Bahan"
      headerActions={
        <div className="flex gap-2">
          <Link href={route('gudang.opname.index')} className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Stok Opname
          </Link>
          <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Tambah Bahan
          </button>
        </div>
      }
    >
      <Card className="mb-6"><SearchFilter filters={filters} routeName="gudang.stok" /></Card>

      <Card>
        <Table>
          <Table.Head>
              <Table.HeadCell>Nama Bahan</Table.HeadCell>
              <Table.HeadCell>Satuan</Table.HeadCell>
              <Table.HeadCell>Stok Saat Ini</Table.HeadCell>
              <Table.HeadCell>Min. Stok</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Aksi</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {(stokList?.data || []).map(bahan => {
              const status = bahan.jumlah_stok <= 0 ? 'Habis' : (bahan.jumlah_stok <= bahan.minimum_stok ? 'Menipis' : 'Aman');
              const color = status === 'Habis' ? 'red' : (status === 'Menipis' ? 'yellow' : 'green');
              return (
                <Table.Row key={bahan.id}>
                  <Table.Cell>{bahan.nama_bahan}</Table.Cell>
                  <Table.Cell>{bahan.satuan}</Table.Cell>
                  <Table.Cell className="font-bold">{bahan.jumlah_stok}</Table.Cell>
                  <Table.Cell>{bahan.minimum_stok}</Table.Cell>
                  <Table.Cell><Badge color={color}>{status}</Badge></Table.Cell>
                  <Table.Cell>
                    <button onClick={() => openMutasi(bahan)} className="text-indigo-600 hover:text-indigo-900 font-medium">Tambah/Kurangi</button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <Pagination links={stokList?.links} className="mt-4" />
      </Card>

      {/* Modal Tambah */}
      <Transition appear show={isAddModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsAddModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">Tambah Bahan Baru</Dialog.Title>
                  <form onSubmit={handleAddSubmit} className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700">Nama Bahan</label><input type="text" value={addData.nama_bahan} onChange={e => setAddData('nama_bahan', e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Satuan (pcs, meter, dll)</label><input type="text" value={addData.satuan} onChange={e => setAddData('satuan', e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700">Jumlah Awal</label><input type="number" value={addData.jumlah_masuk} onChange={e => setAddData('jumlah_masuk', e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" /></div>
                      <div><label className="block text-sm font-medium text-gray-700">Min. Stok</label><input type="number" value={addData.minimum_stok} onChange={e => setAddData('minimum_stok', e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700">Keterangan</label><textarea value={addData.keterangan} onChange={e => setAddData('keterangan', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></textarea></div>
                    <div className="mt-4 flex justify-end gap-2">
                      <button type="button" onClick={() => setIsAddModalOpen(false)} className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors">Batal</button>
                      <button type="submit" disabled={addProcessing} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">Simpan</button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal Mutasi */}
      <Transition appear show={!!mutasiBahan} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setMutasiBahan(null)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">Mutasi Stok: {mutasiBahan?.nama_bahan}</Dialog.Title>
                  <form onSubmit={handleMutasiSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tipe Mutasi</label>
                      <div className="mt-2 space-x-4">
                        <label className="inline-flex items-center"><input type="radio" value="masuk" checked={mutasiData.tipe === 'masuk'} onChange={e => setMutasiData('tipe', e.target.value)} className="text-indigo-600" /><span className="ml-2 text-sm">Masuk (Tambah)</span></label>
                        <label className="inline-flex items-center"><input type="radio" value="keluar" checked={mutasiData.tipe === 'keluar'} onChange={e => setMutasiData('tipe', e.target.value)} className="text-indigo-600" /><span className="ml-2 text-sm">Keluar (Kurangi)</span></label>
                      </div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700">Jumlah</label><input type="number" value={mutasiData.jumlah} onChange={e => setMutasiData('jumlah', e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Keterangan</label><textarea value={mutasiData.keterangan} onChange={e => setMutasiData('keterangan', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></textarea></div>
                    <div className="mt-4 flex justify-end gap-2">
                      <button type="button" onClick={() => setMutasiBahan(null)} className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors">Batal</button>
                      <button type="submit" disabled={mutasiProcessing} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">Simpan Mutasi</button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </AppLayout>
  );
}
