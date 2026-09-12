import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import ProgressBar from '@/Components/ProgressBar';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Modal from '@/Components/Modal';
import StatsCard from '@/Components/StatsCard';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Badge from '@/Components/Badge';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import EmptyState from '@/Components/EmptyState';
import { UserGroupIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

export default function IndexMandor({ ordersCutting, operatorList, stats, progresPemotong, catatanReject, menungguApproval }) {
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
            const order = ordersCutting.find(o => o.id === operator.order_id);
            if (order) setSelectedOrder(order);
        }
    };

    const handleKirimPacking = (e) => {
        e.preventDefault();
        if (confirm('Selesaikan order dan kirim ke divisi Packing?')) {
            router.post(route('cutting.complete', selectedOrder.id), { next_divisi: 'packing' }, {
                onSuccess: () => setSelectedOrder(null)
            });
        }
    };

    return (
        <AppLayout 
            title={
                <div className="flex flex-col justify-center mt-1">
                    <div className="flex items-center gap-3 leading-none">
                        <span>Divisi Cutting</span>
                        <Badge status="gold">{stats.order_berjalan} order berjalan</Badge>
                    </div>
                    <span className="text-[12px] text-ink-soft mt-1 font-sans font-normal normal-case tracking-normal leading-none">Pemotongan & QC cuttingan — {operatorList.length} pemotong aktif hari ini</span>
                </div>
            }
        >
            <Head title="Divisi Cutting" />
            
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* 4 Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatsCard 
                        title="Total target hari ini" 
                        value={stats.total_target + " pcs"}
                        caption={`${stats.total_selesai} selesai • ${stats.total_target > 0 ? Math.round((stats.total_selesai/stats.total_target)*100) : 0}%`}
                        status="accent"
                    />
                    <StatsCard 
                        title="Order berjalan" 
                        value={stats.order_berjalan}
                        caption={`${stats.order_baru} order baru dari Cutting`}
                        status="accent"
                    />
                    <StatsCard 
                        title="Reject hari ini" 
                        value={stats.reject_hari_ini + " pcs"}
                        caption="Perlu dicutting ulang"
                        status="danger"
                    />
                    <StatsCard 
                        title="Rata-rata pcs/pemotong" 
                        value={stats.rata_rata_pcs}
                        caption={`Target harian ${stats.target_harian_per_orang} pcs`}
                        status="accent"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    
                    {/* Left Column (Progres & Reject) */}
                    <div className="w-full lg:w-3/5 space-y-6">
                        
                        {/* Progres per pemotong */}
                        <Card>
                            <div className="flex justify-between items-end mb-6">
                                <h3 className="font-oswald text-[18px] font-bold text-ink">Progres per pemotong</h3>
                                <span className="text-[11px] text-ink-soft">Diperbarui baru saja</span>
                            </div>
                            
                            <div className="space-y-3">
                                {progresPemotong.map(op => (
                                    <div 
                                        key={op.id} 
                                        className="flex items-center cursor-pointer hover:bg-line/20 p-3 -mx-3 rounded-lg transition-colors border border-transparent hover:border-line"
                                        onClick={() => handleSelectOperator(op)}
                                    >
                                        <div className="w-1/4">
                                            <div className="font-bold text-[13px] text-ink">{op.name}</div>
                                            <div className="text-[11px] text-ink-soft">{op.active_order_no || 'Tidak ada order'}</div>
                                        </div>
                                        <div className="w-2/4 px-4">
                                            <ProgressBar target={op.target} selesai={op.pcs_selesai} reject={op.pcs_reject} />
                                        </div>
                                        <div className="w-1/4 flex flex-col items-end justify-center">
                                            <div className="font-medium text-[13px] text-ink">
                                                {op.pcs_selesai} <span className="text-ink-soft font-normal">/ {op.target} pcs</span>
                                            </div>
                                            {op.pcs_reject > 0 && (
                                                <div className="text-[10px] font-bold text-danger bg-danger/10 px-1.5 py-0.5 rounded mt-1 border border-danger/20" title={`${op.pcs_reject} barang perlu perbaikan`}>
                                                    {op.pcs_reject} Reject
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {progresPemotong.length === 0 && (
                                    <EmptyState 
                                        title="Belum ada pemotong"
                                        description="Belum ada pemotong aktif hari ini."
                                        icon={UserGroupIcon}
                                    />
                                )}
                            </div>
                        </Card>

                        {/* Menunggu Approval QC */}
                        <Card className="!p-0 overflow-hidden">
                            <div className="p-6 pb-2">
                                <div className="flex justify-between items-end mb-2">
                                    <h3 className="font-oswald text-[18px] font-bold text-ink">Menunggu Approval QC</h3>
                                    <span className="text-[11px] text-ink-soft">Persetujuan hasil cuttingan harian</span>
                                </div>
                            </div>
                            
                            <Table>
                                <Table.Head>
                                    <Table.HeadCell>Pemotong</Table.HeadCell>
                                    <Table.HeadCell>Order</Table.HeadCell>
                                    <Table.HeadCell className="text-center">Diklaim</Table.HeadCell>
                                    <Table.HeadCell>Rincian Ukuran</Table.HeadCell>
                                    <Table.HeadCell className="text-right">Aksi</Table.HeadCell>
                                </Table.Head>
                                <Table.Body>
                                    {menungguApproval && menungguApproval.map((item) => (
                                        <Table.Row key={item.id}>
                                            <Table.Cell className="font-medium text-ink">{item.operator?.name}</Table.Cell>
                                            <Table.Cell className="text-ink-soft">{item.order?.no_order}</Table.Cell>
                                            <Table.Cell className="text-center font-bold text-ink">{item.pcs_klaim}</Table.Cell>
                                            <Table.Cell>
                                                {item.rincian_ukuran ? (
                                                    <div className="flex gap-1 flex-wrap">
                                                        {Object.entries(item.rincian_ukuran).map(([uk, qty]) => (
                                                            <span key={uk} className="text-[10px] bg-line/30 text-ink px-1.5 py-0.5 rounded border border-line">
                                                                {uk}:{qty}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : '-'}
                                            </Table.Cell>
                                            <Table.Cell className="flex justify-end gap-2">
                                                <PrimaryButton 
                                                    size="sm"
                                                    onClick={() => openQcModal(item)}
                                                >
                                                    Approve QC
                                                </PrimaryButton>
                                                <DangerButton 
                                                    size="sm"
                                                    onClick={() => {
                                                        const alasan = prompt('Alasan reject:');
                                                        if (alasan) {
                                                            router.post(route('cutting.output.reject', item.id), {
                                                                catatan_mandor: alasan
                                                            });
                                                        }
                                                    }}
                                                >
                                                    Reject
                                                </DangerButton>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                    {(!menungguApproval || menungguApproval.length === 0) && (
                                        <Table.Row>
                                            <Table.Cell colSpan={5}>
                                                <EmptyState 
                                                    title="Tidak ada hasil cuttingan"
                                                    description="Tidak ada hasil cuttingan yang menunggu persetujuan."
                                                    icon={ClipboardDocumentCheckIcon}
                                                />
                                            </Table.Cell>
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            </Table>
                        </Card>

                        {/* Catatan Reject */}
                        <Card className="!p-0 overflow-hidden">
                            <div className="p-6 pb-2">
                                <div className="flex justify-between items-end mb-2">
                                    <h3 className="font-oswald text-[18px] font-bold text-ink">Catatan reject</h3>
                                    <span className="text-[11px] text-ink-soft">Perlu dicutting ulang sebelum lanjut QC</span>
                                </div>
                            </div>
                            
                            <Table>
                                <Table.Head>
                                    <Table.HeadCell>No. order</Table.HeadCell>
                                    <Table.HeadCell className="text-center">Jumlah</Table.HeadCell>
                                    <Table.HeadCell>Penyebab</Table.HeadCell>
                                    <Table.HeadCell>Pemotong</Table.HeadCell>
                                    <Table.HeadCell></Table.HeadCell>
                                </Table.Head>
                                <Table.Body>
                                    {catatanReject.map((r, idx) => (
                                        <Table.Row key={idx}>
                                            <Table.Cell className="font-mono text-[12px] text-ink-soft">{r.no_order}</Table.Cell>
                                            <Table.Cell className="text-center">
                                                <Badge status="danger">{r.jumlah} pcs</Badge>
                                            </Table.Cell>
                                            <Table.Cell className="text-ink">{r.penyebab}</Table.Cell>
                                            <Table.Cell className="text-ink">{r.pemotong}</Table.Cell>
                                            <Table.Cell className="text-right">
                                                <SecondaryButton size="sm">
                                                    Cutting ulang
                                                </SecondaryButton>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                    {catatanReject.length === 0 && (
                                        <Table.Row>
                                            <Table.Cell colSpan={5} className="py-6 text-center text-ink-soft text-[12px]">
                                                Tidak ada catatan reject hari ini.
                                            </Table.Cell>
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            </Table>
                        </Card>

                        {/* Antrian Order (Unassigned) */}
                        <Card>
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="font-oswald text-[18px] font-bold text-ink">Antrian Order</h3>
                                <span className="text-[11px] text-ink-soft">Order baru dari Cutting yang belum dikerjakan</span>
                            </div>
                            
                            <div className="space-y-3">
                                {ordersCutting.filter(o => !o.cutting_assigns?.some(a => a.is_active)).map(order => (
                                    <div 
                                        key={order.id} 
                                        className="flex justify-between items-center bg-bg p-3 border border-line rounded cursor-pointer hover:border-navy transition-colors"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <div>
                                            <div className="font-bold font-mono text-[13px] text-ink">{order.no_order}</div>
                                            <div className="text-[11px] text-ink-soft">{order.customer?.nama} • {order.jumlah} pcs</div>
                                        </div>
                                        <div>
                                            <Badge status="gold">Menunggu Assign</Badge>
                                        </div>
                                    </div>
                                ))}
                                {ordersCutting.filter(o => !o.cutting_assigns?.some(a => a.is_active)).length === 0 && (
                                    <div className="text-center text-[12px] text-ink-soft py-4">Semua order sudah memiliki pemotong.</div>
                                )}
                            </div>
                        </Card>

                    </div>

                    {/* Right Column (Detail Panel) */}
                    <div className="w-full lg:w-2/5">
                        {selectedOrder ? (
                            <Card className="sticky top-8">
                                <div className="text-[11px] font-mono text-ink-soft mb-1">{selectedOrder.no_order}</div>
                                <h3 className="font-bold font-oswald text-[20px] text-ink mb-1">{selectedOrder.customer?.nama}</h3>
                                <div className="text-[12px] text-ink-soft mb-6">
                                    {selectedOrder.jenis_produk} • {selectedOrder.jumlah} pcs • deadline {new Date(selectedOrder.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </div>

                                {(!selectedOrder.cutting_assigns || !selectedOrder.cutting_assigns.some(a => a.is_active)) ? (
                                    <div className="bg-bg p-5 rounded border border-line">
                                        <h4 className="font-bold text-[14px] text-ink mb-2">Assign Pemotong</h4>
                                        <p className="text-[12px] text-ink-soft mb-4 leading-relaxed">Pilih pemotong yang akan mengerjakan order ini dan tentukan upah cutting per pcs.</p>
                                        
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            const formData = new FormData(e.target);
                                            router.post(route('cutting.assign', selectedOrder.id), {
                                                operator_id: formData.get('operator_id'),
                                                tarif_per_pcs: formData.get('tarif_per_pcs'),
                                                jenis_produk: selectedOrder.jenis_produk || 'Baju'
                                            }, {
                                                onSuccess: () => setSelectedOrder(null),
                                                onError: (err) => alert(Object.values(err).join('\n'))
                                            });
                                        }}>
                                            <div className="mb-4">
                                                <label className="block text-[11.5px] font-medium text-ink-soft uppercase tracking-wider mb-1">Pilih Pemotong</label>
                                                <select 
                                                    name="operator_id"
                                                    required
                                                    className="w-full border-line bg-panel text-ink rounded-md focus:border-navy focus:ring-navy text-[13px]"
                                                    onChange={(e) => {
                                                        const op = operatorList.find(o => o.id == e.target.value);
                                                        const tarifEl = document.getElementById('tarif_per_pcs');
                                                        const divTarif = document.getElementById('div_tarif_per_pcs');
                                                        
                                                        if (op) {
                                                            if (op.tipe_gaji === 'harian' || op.tipe_gaji === 'bulanan') {
                                                                if (tarifEl) tarifEl.value = 0;
                                                                if (divTarif) divTarif.style.display = 'none';
                                                            } else {
                                                                if (tarifEl) tarifEl.value = op.tarif_default || 5000;
                                                                if (divTarif) divTarif.style.display = 'block';
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <option value="">-- Pilih Pemotong --</option>
                                                    {operatorList.map(op => (
                                                        <option key={op.id} value={op.id}>
                                                            {op.name} {op.tipe_gaji ? `(${op.tipe_gaji})` : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            <div className="mb-6" id="div_tarif_per_pcs">
                                                <label className="block text-[11.5px] font-medium text-ink-soft uppercase tracking-wider mb-1">Tarif Cutting per Pcs (Rp)</label>
                                                <input 
                                                    type="number"
                                                    id="tarif_per_pcs"
                                                    name="tarif_per_pcs"
                                                    required
                                                    defaultValue="5000"
                                                    min="0"
                                                    className="w-full border-line bg-panel text-ink rounded-md focus:border-navy focus:ring-navy text-[13px]"
                                                />
                                            </div>
                                            
                                            <PrimaryButton type="submit" className="w-full justify-center">
                                                Simpan Penugasan
                                            </PrimaryButton>
                                        </form>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-6">
                                            <div className="flex items-end mb-2">
                                                <span className="text-4xl font-oswald font-bold text-ink leading-none">
                                                    {(() => {
                                                        const activeAssign = selectedOrder.cutting_assigns?.find(a => a.is_active);
                                                        return activeAssign?.total_pcs_approved || 0;
                                                    })()}
                                                </span>
                                                <span className="text-[12px] text-ink-soft ml-2 mb-1">/ {selectedOrder.jumlah} pcs selesai</span>
                                            </div>
                                            <ProgressBar 
                                                target={selectedOrder.jumlah} 
                                                selesai={selectedOrder.cutting_assigns?.find(a => a.is_active)?.total_pcs_approved || 0} 
                                                reject={0} 
                                            />
                                        </div>

                                        {selectedOrder.items && selectedOrder.items.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
                                                {selectedOrder.items.map(item => {
                                                    const activeAssign = selectedOrder.cutting_assigns?.find(a => a.is_active);
                                                    const finished = activeAssign?.total_rincian_selesai?.[item.ukuran] || 0;
                                                    return (
                                                        <div key={item.id} className="bg-bg text-center p-3 rounded border border-line">
                                                            <div className="text-[11px] text-ink-soft mb-1">{item.ukuran}</div>
                                                            <div className="font-bold text-[13px] text-ink">{finished}/{item.jumlah_pcs}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* QC Checkboxes */}
                                        <div className="space-y-4 mb-8">
                                            <label className="flex items-center space-x-3 text-[13px] text-ink cursor-pointer border-b border-line pb-3">
                                                <input type="checkbox" className="form-checkbox h-4 w-4 text-accent border-line rounded focus:ring-accent" defaultChecked />
                                                <span className="line-through text-ink-soft">Kerapian cuttingan</span>
                                            </label>
                                            <label className="flex items-center space-x-3 text-[13px] text-ink cursor-pointer border-b border-line pb-3">
                                                <input type="checkbox" className="form-checkbox h-4 w-4 text-accent border-line rounded focus:ring-accent" defaultChecked />
                                                <span className="line-through text-ink-soft">Kekuatan cuttingan (tarik uji)</span>
                                            </label>
                                            <label className="flex items-center space-x-3 text-[13px] text-ink cursor-pointer border-b border-line pb-3">
                                                <input type="checkbox" className="form-checkbox h-4 w-4 text-accent border-line rounded focus:ring-accent" />
                                                <span>Kelengkapan label & aksesoris</span>
                                            </label>
                                            <label className="flex items-center space-x-3 text-[13px] text-ink cursor-pointer border-b border-line pb-3">
                                                <input type="checkbox" className="form-checkbox h-4 w-4 text-accent border-line rounded focus:ring-accent" />
                                                <span>Jumlah pcs sesuai pesanan</span>
                                            </label>
                                        </div>

                                        <div className="flex space-x-3 mb-8">
                                            <PrimaryButton 
                                                onClick={handleKirimPacking}
                                                className="flex-1 justify-center"
                                            >
                                                Kirim ke Packing
                                            </PrimaryButton>
                                            <DangerButton 
                                                onClick={() => setShowFinalQcModal(true)}
                                                className="flex-1 justify-center"
                                            >
                                                Tandai reject
                                            </DangerButton>
                                        </div>

                                        {/* Riwayat */}
                                        <div>
                                            <div className="text-[11px] font-bold uppercase tracking-wider text-ink-soft mb-4">Riwayat komunikasi antar divisi</div>
                                            <div className="space-y-4">
                                                <div className="relative pl-4 border-l-2 border-line">
                                                    <div className="absolute w-2 h-2 bg-ink-soft rounded-full -left-[5px] top-1.5"></div>
                                                    <div className="text-[11px] font-bold text-ink-soft mb-0.5">Cutting - Herman</div>
                                                    <div className="text-[13px] text-ink leading-relaxed">120 potongan selesai, sesuai pola V2. Sisa kain 4%.</div>
                                                    <div className="text-[10px] text-ink-soft mt-0.5">30 Agu, 15.20</div>
                                                </div>
                                                <div className="relative pl-4 border-l-2 border-accent">
                                                    <div className="absolute w-2 h-2 bg-accent rounded-full -left-[5px] top-1.5"></div>
                                                    <div className="text-[11px] font-bold text-accent mb-0.5">Cutting - Ibu Suminah</div>
                                                    <div className="text-[13px] text-ink leading-relaxed">Dibagi ke 2 pemotong, target selesai 1 Sep sore.</div>
                                                    <div className="text-[10px] text-ink-soft mt-0.5">30 Agu, 15.45</div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </Card>
                        ) : (
                            <Card className="h-full min-h-[400px]">
                                <div className="flex flex-col items-center justify-center text-center h-full pt-20">
                                    <div className="w-16 h-16 bg-line/40 rounded-full flex items-center justify-center mb-4 text-ink-soft">
                                        <CheckCircleIcon className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-oswald text-[18px] font-bold text-ink mb-1">Pilih Pemotong</h3>
                                    <p className="text-[13px] text-ink-soft max-w-[250px] leading-relaxed mx-auto">Klik salah satu pemotong di sebelah kiri untuk melihat detail order yang sedang dikerjakannya.</p>
                                </div>
                            </Card>
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
                            alert('Jumlah approved tidak boleh melebihi klaim pemotong!');
                            return;
                        }
                        router.post(route('cutting.output.approve', qcItem.id), {
                            pcs_approved: total,
                            rincian_ukuran: qcSizes,
                            catatan_mandor: 'Lolos QC'
                        }, {
                            onSuccess: closeQcModal
                        });
                    }} className="p-6">
                        <h2 className="text-[18px] font-oswald font-bold text-ink mb-2">Approval QC: {qcItem.order?.no_order}</h2>
                        <p className="text-[13px] text-ink-soft mb-4 leading-relaxed">
                            Pemotong <strong>{qcItem.operator?.name}</strong> mengklaim <strong>{qcItem.pcs_klaim} pcs</strong> selesai. 
                            Silakan masukkan jumlah yang <strong>Lolos QC</strong> untuk masing-masing ukuran.
                        </p>

                        <div className="space-y-3 mb-6">
                            {Object.entries(qcItem.rincian_ukuran || { total: qcItem.pcs_klaim }).map(([uk, maxQty]) => (
                                <div key={uk} className="flex justify-between items-center bg-bg p-2.5 rounded border border-line">
                                    <span className="font-semibold text-ink text-[13px] w-16 text-center">{uk === 'total' ? 'Total' : uk}</span>
                                    <div className="flex items-center gap-3 flex-1 justify-end">
                                        <span className="text-[11px] text-ink-soft">Max {maxQty}</span>
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
                                            className="w-20 border-line bg-panel text-ink rounded text-[13px] py-1 text-center focus:ring-navy focus:border-navy"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <SecondaryButton onClick={closeQcModal}>
                                Batal
                            </SecondaryButton>
                            <PrimaryButton type="submit">
                                Simpan Approval ({Object.values(qcSizes).reduce((sum, val) => sum + (parseInt(val) || 0), 0)} pcs)
                            </PrimaryButton>
                        </div>
                    </form>
                )}
            </Modal>
            
            {/* Final QC Reject Modal */}
            <Modal show={showFinalQcModal} onClose={() => setShowFinalQcModal(false)} maxWidth="sm">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    router.post(route('cutting.qc-reject', selectedOrder.id), {
                        operator_id: formData.get('operator_id'),
                        jumlah: formData.get('jumlah'),
                        alasan: formData.get('alasan')
                    }, {
                        onSuccess: () => setShowFinalQcModal(false)
                    });
                }} className="p-6">
                    <h2 className="text-[18px] font-oswald font-bold text-ink mb-4">Tandai Reject (Final QC)</h2>
                    <p className="text-[13px] text-ink-soft mb-4 leading-relaxed">Masukan barang yang tidak lolos QC akhir untuk diperbaiki kembali oleh pemotong terkait.</p>

                    <div className="mb-4">
                        <label className="block text-[11.5px] font-medium text-ink-soft uppercase tracking-wider mb-1">Pemotong yang mengerjakan</label>
                        <select name="operator_id" required className="w-full border-line bg-panel text-ink rounded focus:border-navy focus:ring-navy text-[13px]">
                            <option value="">-- Pilih Pemotong --</option>
                            {selectedOrder?.cutting_assigns?.map(a => (
                                <option key={a.operator?.id} value={a.operator?.id}>{a.operator?.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-[11.5px] font-medium text-ink-soft uppercase tracking-wider mb-1">Jumlah Reject (Pcs)</label>
                        <input type="number" name="jumlah" min="1" required className="w-full border-line bg-panel text-ink rounded focus:border-navy focus:ring-navy text-[13px]" />
                    </div>

                    <div className="mb-6">
                        <label className="block text-[11.5px] font-medium text-ink-soft uppercase tracking-wider mb-1">Alasan / Penyebab</label>
                        <textarea name="alasan" required rows="2" className="w-full border-line bg-panel text-ink rounded focus:border-navy focus:ring-navy text-[13px]" placeholder="Misal: Cuttingan kerah miring"></textarea>
                    </div>

                    <div className="flex justify-end gap-2">
                        <SecondaryButton onClick={() => setShowFinalQcModal(false)}>Batal</SecondaryButton>
                        <DangerButton type="submit">Tandai Reject</DangerButton>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
