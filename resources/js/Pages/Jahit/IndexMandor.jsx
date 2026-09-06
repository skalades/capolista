import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import ProgressBar from '@/Components/Jahit/ProgressBar';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Modal from '@/Components/Modal';

export default function IndexMandor({ ordersJahit, operatorList, stats, progresPenjahit, catatanReject, menungguApproval }) {
    const [selectedOrder, setSelectedOrder] = useState(null);

    // QC Modal State
    const [qcItem, setQcItem] = useState(null);
    const [qcSizes, setQcSizes] = useState({});
    
    // Final QC Modal State
    const [showFinalQcModal, setShowFinalQcModal] = useState(false);
    
    const openQcModal = (item) => {
        setQcItem(item);
        if (item.rincian_ukuran) {
            setQcSizes(item.rincian_ukuran);
        } else {
            setQcSizes({ total: item.pcs_klaim }); // fallback
        }
    };

    const closeQcModal = () => {
        setQcItem(null);
        setQcSizes({});
    };

    const handleSelectOperator = (operator) => {
        if (operator.order_id) {
            const order = ordersJahit.find(o => o.id === operator.order_id);
            if (order) setSelectedOrder(order);
        }
    };

    const handleKirimPrinting = (e) => {
        e.preventDefault();
        if (confirm('Kirim order ini ke divisi Printing?')) {
            router.post(route('jahit.complete', selectedOrder.id), { next_divisi: 'printing' }, {
                onSuccess: () => setSelectedOrder(null)
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Divisi Jahit" />
            
            {/* Soft cream background similar to the mockup */}
            <div className="min-h-screen bg-[#f3f0e8] py-8 px-4 sm:px-6 lg:px-8 font-sans">
                
                {/* Header */}
                <div className="max-w-7xl mx-auto mb-6">
                    <div className="flex items-center space-x-3 mb-1">
                        <h2 className="font-bold text-3xl text-gray-900 tracking-tight">Divisi Jahit</h2>
                        <span className="bg-[#f0e6d2] text-yellow-800 text-xs px-2.5 py-1 rounded-full font-semibold border border-[#d4c3a3]">
                            {stats.order_berjalan} order berjalan
                        </span>
                    </div>
                    <p className="text-gray-600 text-sm">Penjahitan & QC jahitan — {operatorList.length} penjahit aktif hari ini</p>
                </div>

                {/* 4 Stats Cards */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {/* Card 1 */}
                    <div className="bg-white p-5 rounded border-t-4 border-t-teal-700 shadow-sm border border-gray-100">
                        <div className="text-xs text-gray-500 mb-2">Total target hari ini</div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.total_target} <span className="text-sm font-normal text-gray-500">pcs</span>
                        </div>
                        <div className="text-xs text-gray-500">{stats.total_selesai} selesai • {stats.total_target > 0 ? Math.round((stats.total_selesai/stats.total_target)*100) : 0}%</div>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-white p-5 rounded border-t-4 border-t-teal-700 shadow-sm border border-gray-100">
                        <div className="text-xs text-gray-500 mb-2">Order berjalan</div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{stats.order_berjalan}</div>
                        <div className="text-xs text-gray-500">{stats.order_baru} order baru dari Cutting</div>
                    </div>
                    {/* Card 3 */}
                    <div className="bg-white p-5 rounded border-t-4 border-t-red-700 shadow-sm border border-gray-100">
                        <div className="text-xs text-gray-500 mb-2">Reject hari ini</div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.reject_hari_ini} <span className="text-sm font-normal text-gray-500">pcs</span>
                        </div>
                        <div className="text-xs text-red-600">Perlu dijahit ulang</div>
                    </div>
                    {/* Card 4 */}
                    <div className="bg-white p-5 rounded border-t-4 border-t-teal-700 shadow-sm border border-gray-100">
                        <div className="text-xs text-gray-500 mb-2">Rata-rata pcs/penjahit</div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{stats.rata_rata_pcs}</div>
                        <div className="text-xs text-gray-500">Target harian {stats.target_harian_per_orang} pcs</div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
                    
                    {/* Left Column (Progres & Reject) */}
                    <div className="w-full lg:w-3/5 space-y-6">
                        
                        {/* Progres per penjahit */}
                        <div className="bg-[#fcfbf9] p-6 rounded-md shadow-sm border border-[#e8e4db]">
                            <div className="flex justify-between items-end mb-6">
                                <h3 className="font-bold text-lg text-gray-800">Progres per penjahit</h3>
                                <span className="text-xs text-gray-400">Diperbarui baru saja</span>
                            </div>
                            
                            <div className="space-y-5">
                                {progresPenjahit.map(op => (
                                    <div 
                                        key={op.id} 
                                        className="flex items-center cursor-pointer hover:bg-[#f3f0e8] p-2 -mx-2 rounded transition-colors"
                                        onClick={() => handleSelectOperator(op)}
                                    >
                                        <div className="w-1/4">
                                            <div className="font-bold text-sm text-gray-800">{op.name}</div>
                                            <div className="text-xs text-gray-400">{op.active_order_no || 'Tidak ada order'}</div>
                                        </div>
                                        <div className="w-2/4 px-4">
                                            <ProgressBar target={op.target} selesai={op.pcs_selesai} reject={op.pcs_reject} />
                                        </div>
                                        <div className="w-1/4 text-right font-semibold text-sm text-gray-800">
                                            {op.pcs_selesai}/{op.target}
                                        </div>
                                    </div>
                                ))}
                                {progresPenjahit.length === 0 && (
                                    <div className="text-center text-sm text-gray-400 py-4">Belum ada penjahit aktif hari ini.</div>
                                )}
                            </div>
                        </div>

                        {/* Menunggu Approval QC */}
                        <div className="bg-[#fcfbf9] p-6 rounded-md shadow-sm border border-[#e8e4db]">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="font-bold text-lg text-gray-800">Menunggu Approval QC</h3>
                                <span className="text-xs text-gray-400">Persetujuan hasil jahitan harian</span>
                            </div>
                            
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="text-gray-500 border-b border-[#e8e4db]">
                                        <th className="pb-3 font-normal">Penjahit</th>
                                        <th className="pb-3 font-normal">Order</th>
                                        <th className="pb-3 font-normal text-center">Diklaim</th>
                                        <th className="pb-3 font-normal">Rincian Ukuran</th>
                                        <th className="pb-3 font-normal text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {menungguApproval && menungguApproval.map((item) => (
                                        <tr key={item.id} className="border-b border-[#f3f0e8] last:border-0">
                                            <td className="py-4 font-medium text-gray-800">{item.operator?.name}</td>
                                            <td className="py-4 text-gray-600">{item.order?.no_order}</td>
                                            <td className="py-4 text-center font-bold">{item.pcs_klaim}</td>
                                            <td className="py-4 text-gray-600">
                                                {item.rincian_ukuran ? (
                                                    <div className="flex gap-1 flex-wrap">
                                                        {Object.entries(item.rincian_ukuran).map(([uk, qty]) => (
                                                            <span key={uk} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                                                {uk}:{qty}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : '-'}
                                            </td>
                                            <td className="py-4 flex justify-end gap-2">
                                                <button 
                                                    onClick={() => openQcModal(item)}
                                                    className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                                >
                                                    Approve QC
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        const alasan = prompt('Alasan reject:');
                                                        if (alasan) {
                                                            router.post(route('jahit.output.reject', item.id), {
                                                                catatan_mandor: alasan
                                                            });
                                                        }
                                                    }}
                                                    className="border border-red-500 text-red-600 hover:bg-red-50 px-3 py-1 rounded text-xs transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!menungguApproval || menungguApproval.length === 0) && (
                                        <tr>
                                            <td colSpan="5" className="py-6 text-center text-gray-400">Tidak ada hasil jahitan yang menunggu persetujuan.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Catatan Reject */}
                        <div className="bg-[#fcfbf9] p-6 rounded-md shadow-sm border border-[#e8e4db]">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="font-bold text-lg text-gray-800">Catatan reject</h3>
                                <span className="text-xs text-gray-400">Perlu dijahit ulang sebelum lanjut QC</span>
                            </div>
                            
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="text-gray-500 border-b border-[#e8e4db]">
                                        <th className="pb-3 font-normal">No. order</th>
                                        <th className="pb-3 font-normal text-center">Jumlah</th>
                                        <th className="pb-3 font-normal">Penyebab</th>
                                        <th className="pb-3 font-normal">Penjahit</th>
                                        <th className="pb-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {catatanReject.map((r, idx) => (
                                        <tr key={idx} className="border-b border-[#f3f0e8] last:border-0">
                                            <td className="py-4 text-gray-600">{r.no_order}</td>
                                            <td className="py-4 text-center">
                                                <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs">{r.jumlah} pcs</span>
                                            </td>
                                            <td className="py-4 text-gray-700">{r.penyebab}</td>
                                            <td className="py-4 text-gray-700">{r.penjahit}</td>
                                            <td className="py-4 text-right">
                                                <button className="border border-gray-300 rounded px-3 py-1 text-xs text-gray-600 hover:bg-gray-50">
                                                    Jahit ulang
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {catatanReject.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="py-6 text-center text-gray-400">Tidak ada catatan reject hari ini.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Antrian Order (Unassigned) */}
                        <div className="bg-[#fcfbf9] p-6 rounded-md shadow-sm border border-[#e8e4db]">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="font-bold text-lg text-gray-800">Antrian Order</h3>
                                <span className="text-xs text-gray-400">Order baru dari Cutting yang belum dikerjakan</span>
                            </div>
                            
                            <div className="space-y-3">
                                {ordersJahit.filter(o => !o.jahit_assigns?.some(a => a.is_active)).map(order => (
                                    <div 
                                        key={order.id} 
                                        className="flex justify-between items-center bg-white p-3 border border-gray-200 rounded cursor-pointer hover:border-teal-500 transition-colors"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <div>
                                            <div className="font-bold text-sm text-gray-800">{order.no_order}</div>
                                            <div className="text-xs text-gray-500">{order.customer?.nama} • {order.jumlah} pcs</div>
                                        </div>
                                        <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                            Menunggu Assign
                                        </div>
                                    </div>
                                ))}
                                {ordersJahit.filter(o => !o.jahit_assigns?.some(a => a.is_active)).length === 0 && (
                                    <div className="text-center text-sm text-gray-400 py-4">Semua order sudah memiliki penjahit.</div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Detail Panel) */}
                    <div className="w-full lg:w-2/5">
                        {selectedOrder ? (
                            <div className="bg-[#fcfbf9] p-6 rounded-md shadow-sm border border-[#e8e4db] sticky top-8">
                                <div className="text-xs text-gray-500 mb-1">{selectedOrder.no_order}</div>
                                <h3 className="font-bold text-xl text-gray-900 mb-1">{selectedOrder.customer?.nama}</h3>
                                <div className="text-xs text-gray-500 mb-6">
                                    {selectedOrder.jenis_produk} • {selectedOrder.jumlah} pcs • deadline {new Date(selectedOrder.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </div>

                                {(!selectedOrder.jahit_assigns || !selectedOrder.jahit_assigns.some(a => a.is_active)) ? (
                                    <div className="bg-white p-6 rounded border border-gray-200">
                                        <h4 className="font-bold text-gray-800 mb-4">Assign Penjahit</h4>
                                        <p className="text-sm text-gray-600 mb-4">Pilih penjahit yang akan mengerjakan order ini dan tentukan upah jahit per pcs.</p>
                                        
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            const formData = new FormData(e.target);
                                            router.post(route('jahit.assign', selectedOrder.id), {
                                                operator_id: formData.get('operator_id'),
                                                tarif_per_pcs: formData.get('tarif_per_pcs'),
                                                jenis_produk: selectedOrder.jenis_produk || 'Baju' // Mengambil jenis produk dari order
                                            }, {
                                                onSuccess: () => setSelectedOrder(null),
                                                onError: (err) => alert(Object.values(err).join('\n')) // Tampilkan jika ada error validasi
                                            });
                                        }}>
                                            <div className="mb-4">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Pilih Penjahit</label>
                                                <select 
                                                    name="operator_id"
                                                    required
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                                                    onChange={(e) => {
                                                        // Jika user punya tarif default, bisa kita autofill. 
                                                        // Tapi karena kita ambil via FormData nanti, biarkan saja.
                                                        const op = operatorList.find(o => o.id == e.target.value);
                                                        if (op && op.tarif_default) {
                                                            document.getElementById('tarif_per_pcs').value = op.tarif_default;
                                                        }
                                                    }}
                                                >
                                                    <option value="">-- Pilih Penjahit --</option>
                                                    {operatorList.map(op => (
                                                        <option key={op.id} value={op.id}>{op.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            <div className="mb-6">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Tarif Jahit per Pcs (Rp)</label>
                                                <input 
                                                    type="number"
                                                    id="tarif_per_pcs"
                                                    name="tarif_per_pcs"
                                                    required
                                                    defaultValue="5000"
                                                    min="0"
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                                                />
                                            </div>
                                            
                                            <button 
                                                type="submit"
                                                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-medium py-2 px-4 rounded text-sm transition-colors"
                                            >
                                                Simpan Penugasan
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-6">
                                            <div className="flex items-end mb-2">
                                                <span className="text-4xl font-bold text-gray-900 leading-none">
                                                    {(() => {
                                                        const activeAssign = selectedOrder.jahit_assigns?.find(a => a.is_active);
                                                        return activeAssign?.total_pcs_approved || 0;
                                                    })()}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-2">/ {selectedOrder.jumlah} pcs selesai</span>
                                            </div>
                                            <ProgressBar 
                                                target={selectedOrder.jumlah} 
                                                selesai={selectedOrder.jahit_assigns?.find(a => a.is_active)?.total_pcs_approved || 0} 
                                                reject={0} 
                                            />
                                        </div>

                                        {selectedOrder.items && selectedOrder.items.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
                                                {selectedOrder.items.map(item => {
                                                    const activeAssign = selectedOrder.jahit_assigns?.find(a => a.is_active);
                                                    const finished = activeAssign?.total_rincian_selesai?.[item.ukuran] || 0;
                                                    return (
                                                        <div key={item.id} className="bg-[#f3f0e8] text-center p-3 rounded border border-[#e8e4db]">
                                                            <div className="text-xs text-gray-500 mb-1">{item.ukuran}</div>
                                                            <div className="font-bold text-sm">{finished}/{item.jumlah_pcs}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* QC Checkboxes */}
                                        <div className="space-y-4 mb-8">
                                            <label className="flex items-center space-x-3 text-sm text-gray-700 cursor-pointer border-b border-gray-100 pb-3">
                                                <input type="checkbox" className="form-checkbox h-4 w-4 text-teal-700 border-gray-300 rounded" defaultChecked />
                                                <span className="line-through text-gray-400">Kerapian jahitan</span>
                                            </label>
                                            <label className="flex items-center space-x-3 text-sm text-gray-700 cursor-pointer border-b border-gray-100 pb-3">
                                                <input type="checkbox" className="form-checkbox h-4 w-4 text-teal-700 border-gray-300 rounded" defaultChecked />
                                                <span className="line-through text-gray-400">Kekuatan jahitan (tarik uji)</span>
                                            </label>
                                            <label className="flex items-center space-x-3 text-sm text-gray-700 cursor-pointer border-b border-gray-100 pb-3">
                                                <input type="checkbox" className="form-checkbox h-4 w-4 text-teal-700 border-gray-300 rounded" />
                                                <span>Kelengkapan label & aksesoris</span>
                                            </label>
                                            <label className="flex items-center space-x-3 text-sm text-gray-700 cursor-pointer border-b border-gray-100 pb-3">
                                                <input type="checkbox" className="form-checkbox h-4 w-4 text-teal-700 border-gray-300 rounded" />
                                                <span>Jumlah pcs sesuai pesanan</span>
                                            </label>
                                        </div>

                                        <div className="flex space-x-3 mb-8">
                                            <button 
                                                onClick={handleKirimPrinting}
                                                className="flex-1 bg-[#2c6558] hover:bg-[#204f44] text-white font-medium py-2.5 rounded text-sm transition-colors"
                                            >
                                                Kirim ke Printing
                                            </button>
                                            <button 
                                                onClick={() => setShowFinalQcModal(true)}
                                                className="flex-1 bg-white border border-[#e8e4db] hover:bg-gray-50 text-red-600 font-medium py-2.5 rounded text-sm transition-colors"
                                            >
                                                Tandai reject
                                            </button>
                                        </div>

                                        {/* Riwayat */}
                                        <div>
                                            <div className="text-xs text-gray-500 mb-4">Riwayat komunikasi antar divisi</div>
                                            <div className="space-y-4">
                                                <div className="relative pl-4 border-l-2 border-gray-200">
                                                    <div className="absolute w-2 h-2 bg-gray-400 rounded-full -left-[5px] top-1.5"></div>
                                                    <div className="text-xs text-gray-500 mb-0.5">Cutting - Herman</div>
                                                    <div className="text-sm text-gray-800">120 potongan selesai, sesuai pola V2. Sisa kain 4%.</div>
                                                    <div className="text-xs text-gray-400 mt-0.5">30 Agu, 15.20</div>
                                                </div>
                                                <div className="relative pl-4 border-l-2 border-teal-600">
                                                    <div className="absolute w-2 h-2 bg-teal-600 rounded-full -left-[5px] top-1.5"></div>
                                                    <div className="text-xs text-gray-500 mb-0.5">Jahit - Ibu Suminah</div>
                                                    <div className="text-sm text-gray-800">Dibagi ke 2 penjahit, target selesai 1 Sep sore.</div>
                                                    <div className="text-xs text-gray-400 mt-0.5">30 Agu, 15.45</div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="bg-[#fcfbf9] p-8 rounded-md shadow-sm border border-[#e8e4db] flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircleIcon className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-1">Pilih Penjahit</h3>
                                <p className="text-sm text-gray-500">Klik salah satu penjahit di sebelah kiri untuk melihat detail order yang sedang dikerjakannya.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* QC Approval Modal */}
            <Modal show={!!qcItem} onClose={closeQcModal} maxWidth="md">
                {qcItem && (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const total = Object.values(qcSizes).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
                        if (total > qcItem.pcs_klaim) {
                            alert('Jumlah approved tidak boleh melebihi klaim penjahit!');
                            return;
                        }
                        router.post(route('jahit.output.approve', qcItem.id), {
                            pcs_approved: total,
                            rincian_ukuran: qcSizes,
                            catatan_mandor: 'Lolos QC'
                        }, {
                            onSuccess: closeQcModal
                        });
                    }} className="p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-2">Approval QC: {qcItem.order?.no_order}</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Penjahit <strong>{qcItem.operator?.name}</strong> mengklaim <strong>{qcItem.pcs_klaim} pcs</strong> selesai. 
                            Silakan masukkan jumlah yang <strong>Lolos QC</strong> untuk masing-masing ukuran.
                        </p>

                        <div className="space-y-3 mb-6">
                            {Object.entries(qcItem.rincian_ukuran || { total: qcItem.pcs_klaim }).map(([uk, maxQty]) => (
                                <div key={uk} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200">
                                    <span className="font-semibold text-gray-700 w-16 text-center">{uk === 'total' ? 'Total' : uk}</span>
                                    <div className="flex items-center gap-2 flex-1 justify-end">
                                        <span className="text-xs text-gray-500">Max {maxQty}</span>
                                        <input 
                                            type="number"
                                            min="0"
                                            max={maxQty}
                                            value={qcSizes[uk] || ''}
                                            onChange={e => {
                                                const val = parseInt(e.target.value);
                                                setQcSizes({
                                                    ...qcSizes,
                                                    [uk]: isNaN(val) ? '' : val
                                                });
                                            }}
                                            className="w-24 border-gray-300 rounded text-sm py-1 focus:ring-teal-500 focus:border-teal-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button 
                                type="button" 
                                onClick={closeQcModal}
                                className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded text-sm font-medium"
                            >
                                Simpan Approval ({Object.values(qcSizes).reduce((sum, val) => sum + (parseInt(val) || 0), 0)} pcs)
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
            {/* Final QC Reject Modal */}
            <Modal show={showFinalQcModal} onClose={() => setShowFinalQcModal(false)} maxWidth="sm">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    router.post(route('jahit.qc-reject', selectedOrder.id), {
                        operator_id: formData.get('operator_id'),
                        jumlah: formData.get('jumlah'),
                        alasan: formData.get('alasan')
                    }, {
                        onSuccess: () => setShowFinalQcModal(false)
                    });
                }} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Tandai Reject (Final QC)</h2>
                    <p className="text-sm text-gray-600 mb-4">Masukan barang yang tidak lolos QC akhir untuk diperbaiki kembali oleh penjahit terkait.</p>

                    <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Penjahit yang mengerjakan</label>
                        <select name="operator_id" required className="w-full border-gray-300 rounded text-sm focus:border-teal-500 focus:ring-teal-500">
                            <option value="">-- Pilih Penjahit --</option>
                            {selectedOrder?.jahit_assigns?.map(a => (
                                <option key={a.operator?.id} value={a.operator?.id}>{a.operator?.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Jumlah Reject (Pcs)</label>
                        <input type="number" name="jumlah" min="1" required className="w-full border-gray-300 rounded text-sm focus:border-teal-500 focus:ring-teal-500" />
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Alasan / Penyebab</label>
                        <textarea name="alasan" required rows="2" className="w-full border-gray-300 rounded text-sm focus:border-teal-500 focus:ring-teal-500" placeholder="Misal: Jahitan kerah miring"></textarea>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowFinalQcModal(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium">Tandai Reject</button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
