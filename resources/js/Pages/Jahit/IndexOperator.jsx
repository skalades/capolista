import React, { useState } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { 
    ScissorsIcon, 
    ClockIcon, 
    BanknotesIcon,
    CheckCircleIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { 
    ScissorsIcon as ScissorsSolid, 
    ClockIcon as ClockSolid, 
    BanknotesIcon as BanknotesSolid 
} from '@heroicons/react/24/solid';

export default function IndexOperator({ myAssigns, todayOutputs, recentOutputs, upahBulanIni, tanggal }) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('tugas');

    const { data, setData, post, processing, errors, reset } = useForm({
        assign_id: myAssigns.length === 1 ? myAssigns[0].id : '',
        tanggal: tanggal,
        pcs_klaim: '',
        rincian_ukuran: {},
        catatan_operator: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('jahit.output.store'), {
            onSuccess: () => {
                reset('pcs_klaim', 'catatan_operator');
                alert('Berhasil mengirim progres harian!');
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-200 flex justify-center font-sans">
            <Head title="Staf Jahit - Dashboard" />

            {/* Mobile Container */}
            <div className="w-full max-w-md bg-gray-50 min-h-screen relative shadow-2xl flex flex-col">
                
                {/* Top App Bar */}
                <div className="bg-white px-5 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                    <div>
                        <h1 className="font-bold text-gray-800 text-lg">CAPOLISTA</h1>
                        <p className="text-xs text-gray-500">{auth?.user?.name || 'Staf Jahit'}</p>
                    </div>
                    <Link 
                        href={route('logout')} 
                        method="post" 
                        as="button"
                        className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors flex items-center"
                    >
                        <ArrowRightOnRectangleIcon className="w-6 h-6" />
                    </Link>
                </div>
                
                {/* Content Area */}
                <div className="p-4 flex-1 overflow-y-auto pb-24">
                    {/* TAB: TUGAS & INPUT */}
                    {activeTab === 'tugas' && (
                        <div className="space-y-6 animation-fade-in">
                            <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-xl p-5 text-white shadow-md">
                                <h3 className="text-sm opacity-90 mb-1">Halo, Selamat Bekerja!</h3>
                                <p className="font-bold text-xl">Anda memiliki {myAssigns.length} tugas aktif</p>
                            </div>

                            {myAssigns.length === 0 ? (
                                <div className="bg-white p-8 rounded-xl border border-gray-200 text-center shadow-sm">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                        <CheckCircleIcon className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h4 className="font-bold text-gray-800 mb-1">Belum ada tugas</h4>
                                    <p className="text-sm text-gray-500">Saat ini Anda tidak memiliki tugas jahitan yang aktif dari Mandor.</p>
                                </div>
                            ) : (
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Input Progres Harian</h4>
                                    
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Order (Tugas)</label>
                                            <select 
                                                value={data.assign_id}
                                                onChange={e => {
                                                    setData({
                                                        ...data,
                                                        assign_id: e.target.value,
                                                        pcs_klaim: '',
                                                        rincian_ukuran: {}
                                                    });
                                                }}
                                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                                                required
                                            >
                                                <option value="">-- Pilih Order --</option>
                                                {myAssigns.map(a => (
                                                    <option key={a.id} value={a.id}>
                                                        {a.order?.no_order} - {a.order?.customer?.nama} (Upah: Rp{a.tarif_per_pcs})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.assign_id && <div className="text-red-500 text-xs mt-1">{errors.assign_id}</div>}
                                        </div>

                                        {/* Tampilkan detail order yang dipilih */}
                                        {(() => {
                                            const selAssign = myAssigns.find(a => a.id == data.assign_id);
                                            if (!selAssign || !selAssign.order) return null;
                                            const ord = selAssign.order;
                                            return (
                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2 mb-4 shadow-inner text-sm">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <div className="font-bold text-gray-800">{ord.no_order}</div>
                                                            <div className="text-xs text-gray-500">{ord.jenis_produk} • Total: {ord.jumlah} pcs</div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-xs text-gray-500">Deadline</div>
                                                            <div className="font-bold text-red-600">
                                                                {new Date(ord.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {ord.items && ord.items.length > 0 && (
                                                        <div className="mt-3 border-t pt-3">
                                                            <div className="text-xs font-semibold text-gray-800 mb-2">Input Ukuran yang Dijahit:</div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {ord.items.map(item => {
                                                                    const alreadyDone = selAssign.total_rincian_selesai?.[item.ukuran] || 0;
                                                                    const sisa = Math.max(0, item.jumlah_pcs - alreadyDone);
                                                                    
                                                                    return (
                                                                    <div key={item.id} className={`flex items-center gap-2 bg-white p-1 rounded border ${sisa === 0 ? 'border-gray-100 bg-gray-50 opacity-60' : 'border-gray-200'}`}>
                                                                        <span className="text-xs font-bold w-12 text-center">{item.ukuran}</span>
                                                                        <input 
                                                                            type="number"
                                                                            min="0"
                                                                            max={sisa}
                                                                            value={data.rincian_ukuran[item.ukuran] || ''}
                                                                            onChange={e => {
                                                                                const val = parseInt(e.target.value);
                                                                                const newRincian = { ...data.rincian_ukuran, [item.ukuran]: isNaN(val) ? '' : val };
                                                                                const total = Object.values(newRincian).reduce((sum, v) => sum + (parseInt(v) || 0), 0);
                                                                                setData({
                                                                                    ...data,
                                                                                    rincian_ukuran: newRincian,
                                                                                    pcs_klaim: total || ''
                                                                                });
                                                                            }}
                                                                            className={`w-full rounded text-sm py-1 px-2 ${sisa === 0 ? 'border-transparent bg-transparent cursor-not-allowed text-gray-400' : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'}`}
                                                                            placeholder={sisa === 0 ? 'Selesai' : `Max ${sisa}`}
                                                                            disabled={sisa === 0}
                                                                        />
                                                                    </div>
                                                                )})}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Diselesaikan (Pcs)</label>
                                            <input 
                                                type="number"
                                                min="1"
                                                value={data.pcs_klaim}
                                                onChange={e => setData('pcs_klaim', e.target.value)}
                                                readOnly={
                                                    data.assign_id && 
                                                    myAssigns.find(a => a.id == data.assign_id)?.order?.items?.length > 0
                                                }
                                                className={`w-full border-gray-300 rounded-lg shadow-sm text-lg py-3 ${
                                                    data.assign_id && myAssigns.find(a => a.id == data.assign_id)?.order?.items?.length > 0 
                                                        ? 'bg-gray-100 cursor-not-allowed text-gray-500' 
                                                        : 'focus:border-teal-500 focus:ring-teal-500'
                                                }`}
                                                placeholder="Contoh: 25"
                                                required
                                            />
                                            {errors.pcs_klaim && <div className="text-red-500 text-xs mt-1">{errors.pcs_klaim}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                                            <input 
                                                type="date"
                                                value={data.tanggal}
                                                onChange={e => setData('tanggal', e.target.value)}
                                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm bg-gray-50"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (Opsional)</label>
                                            <textarea 
                                                value={data.catatan_operator}
                                                onChange={e => setData('catatan_operator', e.target.value)}
                                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                                                rows="2"
                                                placeholder="Ada masalah mesin atau kain?"
                                            ></textarea>
                                        </div>

                                        <button 
                                            type="submit" 
                                            disabled={processing}
                                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors disabled:opacity-50"
                                        >
                                            {processing ? 'Menyimpan...' : 'Kirim Laporan Progres'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: RIWAYAT */}
                    {activeTab === 'riwayat' && (
                        <div className="space-y-4 animation-fade-in">
                            <h3 className="font-bold text-gray-800 text-lg mb-2">Riwayat Output (Hari Ini)</h3>
                            
                            {todayOutputs.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4 bg-white rounded-lg border border-gray-200 shadow-sm">Belum ada progres yang dikirim hari ini.</p>
                            ) : (
                                <div className="space-y-3">
                                    {todayOutputs.map(out => (
                                        <div key={out.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-gray-800">{out.order?.no_order}</div>
                                                <div className="text-xs text-gray-500 mb-1">{out.pcs_klaim} pcs diklaim</div>
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                                                    out.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    out.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {out.status === 'menunggu_approval' ? 'MENUNGGU ACC' : out.status.toUpperCase()}
                                                </span>
                                            </div>
                                            {out.status === 'approved' && (
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-500">Upah</div>
                                                    <div className="font-bold text-green-600">Rp{(out.upah_kotor*1).toLocaleString('id-ID')}</div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <h3 className="font-bold text-gray-800 text-lg mt-6 mb-2">10 Output Terakhir (Disetujui)</h3>
                            {recentOutputs.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4 bg-white rounded-lg border border-gray-200 shadow-sm">Belum ada riwayat sebelumnya.</p>
                            ) : (
                                <div className="space-y-3 opacity-80">
                                    {recentOutputs.slice(0, 10).map(out => (
                                        <div key={out.id} className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center text-sm">
                                            <div>
                                                <span className="font-medium">{out.order?.no_order}</span>
                                                <span className="text-gray-400 ml-2">{new Date(out.tanggal).toLocaleDateString('id-ID', {day:'numeric', month:'short'})}</span>
                                            </div>
                                            <div className="font-semibold text-gray-700">{out.pcs_approved} pcs</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: PENGHASILAN */}
                    {activeTab === 'penghasilan' && (
                        <div className="space-y-6 animation-fade-in">
                            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg text-center relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 opacity-10">
                                    <BanknotesSolid className="w-32 h-32" />
                                </div>
                                <h3 className="text-sm opacity-90 mb-2 relative z-10">Estimasi Penghasilan Bulan Ini</h3>
                                <div className="font-black text-4xl mb-1 relative z-10">
                                    Rp{(upahBulanIni).toLocaleString('id-ID')}
                                </div>
                                <p className="text-xs opacity-75 relative z-10">Berdasarkan output yang telah di-ACC Mandor</p>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">Info Penggajian</h4>
                                <ul className="text-sm text-gray-600 space-y-3">
                                    <li className="flex justify-between">
                                        <span>Status</span>
                                        <span className="font-semibold text-gray-800">Borongan</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Total pcs di-ACC bulan ini</span>
                                        <span className="font-semibold text-gray-800">
                                            {recentOutputs.filter(o => new Date(o.tanggal).getMonth() === new Date().getMonth()).reduce((sum, o) => sum + o.pcs_approved, 0)} pcs
                                        </span>
                                    </li>
                                    <li className="text-xs text-gray-400 mt-4 pt-4 border-t">
                                        Catatan: Angka di atas adalah estimasi upah kotor. Pencairan gaji mengikuti jadwal dari HR/Manajemen dan akan dipotong kasbon (jika ada).
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Navigation (Sticky) */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                    <button 
                        onClick={() => setActiveTab('tugas')} 
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'tugas' ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {activeTab === 'tugas' ? <ScissorsSolid className="w-6 h-6" /> : <ScissorsIcon className="w-6 h-6" />}
                        <span className="text-[10px] font-medium">Tugas</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('riwayat')} 
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'riwayat' ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {activeTab === 'riwayat' ? <ClockSolid className="w-6 h-6" /> : <ClockIcon className="w-6 h-6" />}
                        <span className="text-[10px] font-medium">Riwayat</span>
                    </button>

                    <button 
                        onClick={() => setActiveTab('penghasilan')} 
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'penghasilan' ? 'text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {activeTab === 'penghasilan' ? <BanknotesSolid className="w-6 h-6" /> : <BanknotesIcon className="w-6 h-6" />}
                        <span className="text-[10px] font-medium">Penghasilan</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
