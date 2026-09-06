import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import { PrinterIcon, CheckCircleIcon, BanknotesIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function SlipGaji({ penggajian }) {
    const { karyawan, items, pembuat, penyetuju } = penggajian;

    const handleApprove = () => {
        if (confirm('Setujui slip gaji ini?')) {
            router.post(route('hr.penggajian.approve', penggajian.id));
        }
    };

    const handleBayar = () => {
        if (confirm('Tandai slip gaji ini sudah dibayar/ditransfer?')) {
            router.post(route('hr.penggajian.bayar', penggajian.id));
        }
    };

    return (
        <AppLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Slip Gaji</h2>}>
            <Head title={`Slip Gaji - ${karyawan?.name}`} />

            <div className="py-8 max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                <div className="flex justify-between items-center">
                    <Link
                        href={route('hr.penggajian.index')}
                        className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Kembali ke Daftar
                    </Link>

                    <div className="flex gap-2">
                        <a
                            href={route('hr.penggajian.print', penggajian.id)}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
                        >
                            <PrinterIcon className="h-4 w-4" />
                            Cetak PDF
                        </a>
                        {penggajian.status_bayar === 'draft' && (
                            <button
                                onClick={handleApprove}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-600 rounded-lg text-sm font-medium text-white hover:bg-brand-700 shadow-sm"
                            >
                                <CheckCircleIcon className="h-4 w-4" />
                                Setujui (Approve)
                            </button>
                        )}
                        {penggajian.status_bayar === 'disetujui' && (
                            <button
                                onClick={handleBayar}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 shadow-sm"
                            >
                                <BanknotesIcon className="h-4 w-4" />
                                Tandai Dibayar
                            </button>
                        )}
                    </div>
                </div>

                <Card className="p-8">
                    <div className="border-b border-gray-200 pb-6 mb-6 flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">CAPOLISTA APPAREL</h1>
                            <p className="text-sm text-gray-500">Slip Gaji Karyawan</p>
                        </div>
                        <div className="text-right">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                                penggajian.status_bayar === 'dibayar' ? 'bg-emerald-100 text-emerald-800' :
                                penggajian.status_bayar === 'disetujui' ? 'bg-blue-100 text-blue-800' :
                                'bg-amber-100 text-amber-800'
                            }`}>
                                {penggajian.status_bayar}
                            </span>
                            <p className="text-xs text-gray-400 mt-2">No: #{penggajian.id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
                        <div className="space-y-1.5">
                            <div className="flex"><span className="w-28 text-gray-500">Nama:</span> <span className="font-semibold text-gray-900">{karyawan?.name}</span></div>
                            <div className="flex"><span className="w-28 text-gray-500">Divisi:</span> <span className="capitalize text-gray-800">{karyawan?.divisi}</span></div>
                            <div className="flex"><span className="w-28 text-gray-500">Jabatan:</span> <span className="capitalize text-gray-800">{karyawan?.jabatan ?? '-'}</span></div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex"><span className="w-32 text-gray-500">Periode:</span> <span className="text-gray-800 font-medium">{penggajian.periode_mulai} s/d {penggajian.periode_selesai}</span></div>
                            <div className="flex"><span className="w-32 text-gray-500">Tipe Gaji:</span> <span className="capitalize font-semibold text-brand-600">{penggajian.tipe_gaji}</span></div>
                            <div className="flex"><span className="w-32 text-gray-500">Dibuat oleh:</span> <span className="text-gray-800">{pembuat?.name ?? '-'}</span></div>
                        </div>
                    </div>

                    {/* Breakdown Rincian Gaji */}
                    {items && items.length > 0 && (
                        <div className="mb-6">
                            <h4 className="font-medium text-gray-900 mb-2 text-sm">Rincian Komponen / Output</h4>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Keterangan / Order</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qty / Pcs</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Tarif</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {items.map((it, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-2 text-gray-800">
                                                    {it.order ? `Order #${it.order.no_order}` : (it.keterangan || 'Komponen Gaji')}
                                                </td>
                                                <td className="px-4 py-2 text-center text-gray-600">{it.jumlah_pcs ?? '-'}</td>
                                                <td className="px-4 py-2 text-right text-gray-600">Rp {Number(it.tarif_per_pcs || 0).toLocaleString('id-ID')}</td>
                                                <td className="px-4 py-2 text-right font-medium text-gray-900">Rp {Number(it.subtotal || 0).toLocaleString('id-ID')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Total Upah Kotor:</span>
                            <span>Rp {Number(penggajian.total_upah_kotor || 0).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-emerald-600">
                            <span>Tunjangan:</span>
                            <span>+ Rp {Number(penggajian.tunjangan || 0).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-rose-600">
                            <span>Potongan:</span>
                            <span>- Rp {Number(penggajian.potongan || 0).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-bold text-gray-900">
                            <span>Total Gaji Bersih:</span>
                            <span className="text-brand-600">Rp {Number(penggajian.total_upah_bersih || 0).toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    {penyetuju && (
                        <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-gray-500 text-right">
                            Disetujui oleh: <span className="font-medium text-gray-700">{penyetuju.name}</span> pada {penggajian.disetujui_at}
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
