import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import OrderProgress from '@/Components/OrderProgress';
import { 
    MagnifyingGlassIcon, 
    CheckCircleIcon,
    ClockIcon,
    ExclamationCircleIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function TrackOrder({ invoice, order, status_labels }) {
    const [searchInvoice, setSearchInvoice] = useState(invoice || '');
    const [isSearching, setIsSearching] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setIsSearching(true);
        router.get(route('cek-pesanan'), { invoice: searchInvoice }, { 
            preserveState: true,
            onFinish: () => setIsSearching(false)
        });
    };

    return (
        <GuestLayout maxWidth="max-w-2xl lg:max-w-xl xl:max-w-2xl">
            <Head title="Cek Pesanan" />

            <div className="bg-panel p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-line relative overflow-hidden transition-all duration-300">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="text-center mb-10 relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy/5 text-navy mb-4 shadow-sm border border-line">
                        <DocumentTextIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-[32px] font-oswald font-bold text-ink mb-3 tracking-tight">Lacak Pesanan</h2>
                    <p className="text-ink-soft text-[14px] max-w-sm mx-auto leading-relaxed">
                        Pantau progres pengerjaan pesanan Anda secara real-time. Masukkan nomor invoice di bawah ini.
                    </p>
                </div>

                <form onSubmit={submit} className="mb-10 relative z-10">
                    <div className="relative flex items-center group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className={`h-5 w-5 transition-colors duration-300 ${searchInvoice ? 'text-navy' : 'text-ink-soft group-focus-within:text-navy'}`} aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            name="invoice"
                            id="invoice"
                            className="block w-full pl-12 pr-32 py-4 sm:text-[15px] text-ink border-line rounded-2xl focus:ring-navy focus:border-navy transition-all duration-300 bg-bg hover:bg-bg/80 focus:bg-panel shadow-sm"
                            placeholder="Contoh: ORD-20231015-001"
                            value={searchInvoice}
                            onChange={(e) => setSearchInvoice(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            disabled={isSearching}
                            className="absolute right-2 inset-y-2 px-6 bg-navy text-white text-[14px] font-semibold rounded-xl hover:bg-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-all duration-300 disabled:opacity-70"
                        >
                            {isSearching ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Mencari...
                                </span>
                            ) : 'Lacak'}
                        </button>
                    </div>
                </form>

                {invoice && !order && !isSearching && (
                    <div className="rounded-2xl bg-danger/10 p-5 border border-danger/20 flex items-start gap-4 animate-fade-in-up">
                        <div className="bg-danger/20 rounded-full p-2 mt-0.5 shrink-0">
                            <ExclamationCircleIcon className="h-6 w-6 text-danger" />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-semibold text-danger">Pesanan Tidak Ditemukan</h3>
                            <p className="mt-1 text-[13.5px] text-danger/80 leading-relaxed">
                                Kami tidak dapat menemukan pesanan dengan nomor invoice <strong>{invoice}</strong>. Silakan periksa kembali kombinasi huruf dan angka pada nota Anda.
                            </p>
                        </div>
                    </div>
                )}

                {order && !isSearching && (
                    <div className="animate-fade-in-up delay-75">
                        {/* Interactive Progress Bar */}
                        <div className="mb-14 px-2">
                            <OrderProgress currentStatus={order.status} statusLabels={status_labels} />
                        </div>

                        <div className="bg-bg rounded-2xl p-6 border border-line mb-8 mt-12 shadow-sm">
                            <h3 className="text-[11.5px] font-bold tracking-widest text-ink-soft uppercase mb-5">Informasi Pesanan</h3>
                            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <dt className="text-[12.5px] font-medium text-ink-soft mb-1">Nomor Invoice</dt>
                                    <dd className="text-[14px] font-bold text-ink">{order.no_order}</dd>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <dt className="text-[12.5px] font-medium text-ink-soft mb-1">Tanggal Pesan</dt>
                                    <dd className="text-[14px] font-semibold text-ink">{order.tanggal_order}</dd>
                                </div>
                                <div className="col-span-2 sm:col-span-2">
                                    <dt className="text-[12.5px] font-medium text-ink-soft mb-1">Produk</dt>
                                    <dd className="text-[14px] font-semibold text-ink flex items-center gap-2">
                                        {order.jenis_produk} 
                                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-line/50 text-ink text-[11.5px] font-bold">
                                            {order.jumlah} Qty
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div>
                            <h3 className="text-[11.5px] font-bold tracking-widest text-ink-soft uppercase mb-6">Jejak Aktivitas</h3>
                            <div className="flow-root">
                                <ul role="list" className="-mb-8">
                                    {order.logs && order.logs.length > 0 ? (
                                        order.logs.map((log, logIdx) => {
                                            const isLatest = logIdx === 0;
                                            return (
                                                <li key={logIdx}>
                                                    <div className="relative pb-8">
                                                        {logIdx !== order.logs.length - 1 ? (
                                                            <span className="absolute left-5 top-5 -ml-px h-full w-[2px] bg-line" aria-hidden="true" />
                                                        ) : null}
                                                        <div className="relative flex items-start space-x-4">
                                                            <div className="relative">
                                                                <span className={`h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-panel shadow-sm z-10 transition-transform duration-300 hover:scale-110 ${isLatest ? 'bg-navy' : 'bg-line'}`}>
                                                                    {isLatest ? (
                                                                        <CheckCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                                                    ) : (
                                                                        <ClockIcon className="h-5 w-5 text-ink-soft" aria-hidden="true" />
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                                <div>
                                                                    <p className="text-[14px] text-ink">
                                                                        Pesanan masuk ke tahap <span className={`font-bold ${isLatest ? 'text-navy' : 'text-ink'}`}>{log.status_label}</span>
                                                                    </p>
                                                                    {log.catatan && (
                                                                        <div className="mt-2 text-[13px] text-ink-soft bg-bg p-3 rounded-xl shadow-sm border border-line relative before:content-[''] before:absolute before:-top-2 before:left-4 before:border-8 before:border-transparent before:border-b-bg">
                                                                            <span className="italic">"{log.catatan}"</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="whitespace-nowrap text-right text-[11px] text-ink-soft flex flex-col items-end gap-1">
                                                                    <span className="font-medium bg-bg border border-line px-2 py-1 rounded-md text-ink">{log.tanggal.split(' ')[0]}</span>
                                                                    <span>{log.tanggal.split(' ')[1]}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })
                                    ) : (
                                        <li className="text-[13px] text-ink-soft italic pb-8 flex justify-center py-4 bg-bg rounded-xl border border-dashed border-line">
                                            Belum ada aktivitas tercatat.
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
