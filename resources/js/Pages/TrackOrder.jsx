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

const colorClasses = {
    gray: { bg: 'bg-gray-100', text: 'text-gray-800', badge: 'bg-gray-500' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-800', badge: 'bg-blue-500' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', badge: 'bg-yellow-500' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-800', badge: 'bg-orange-500' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-800', badge: 'bg-purple-500' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-800', badge: 'bg-pink-500' },
    teal: { bg: 'bg-teal-100', text: 'text-teal-800', badge: 'bg-teal-500' },
    indigo: { bg: 'bg-brand-100', text: 'text-brand-800', badge: 'bg-brand-500' },
    green: { bg: 'bg-green-100', text: 'text-green-800', badge: 'bg-green-500' },
};

export default function TrackOrder({ invoice, order, status_labels, status_colors }) {
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

    const getStatusColorClass = (status, type) => {
        const colorName = status_colors[status] || 'gray';
        return colorClasses[colorName]?.[type] || colorClasses['gray'][type];
    };

    return (
        <GuestLayout maxWidth="max-w-2xl lg:max-w-xl xl:max-w-2xl">
            <Head title="Cek Pesanan" />

            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden transition-all duration-300">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-brand-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="text-center mb-10 relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-50 text-brand-600 mb-4 shadow-sm border border-brand-100">
                        <DocumentTextIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Lacak Pesanan</h2>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                        Pantau progres pengerjaan pesanan Anda secara real-time. Masukkan nomor invoice di bawah ini.
                    </p>
                </div>

                <form onSubmit={submit} className="mb-10 relative z-10">
                    <div className="relative flex items-center group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className={`h-5 w-5 transition-colors duration-300 ${searchInvoice ? 'text-brand-500' : 'text-gray-400 group-focus-within:text-brand-500'}`} aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            name="invoice"
                            id="invoice"
                            className="block w-full pl-12 pr-32 py-4 sm:text-base border-gray-200 rounded-2xl focus:ring-brand-500 focus:border-brand-500 transition-all duration-300 bg-gray-50/50 hover:bg-gray-50 focus:bg-white shadow-sm"
                            placeholder="Contoh: ORD-20231015-001"
                            value={searchInvoice}
                            onChange={(e) => setSearchInvoice(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            disabled={isSearching}
                            className="absolute right-2 inset-y-2 px-6 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
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
                    <div className="rounded-2xl bg-red-50 p-5 border border-red-100 flex items-start gap-4 animate-fade-in-up">
                        <div className="bg-red-100 rounded-full p-2 mt-0.5 shrink-0">
                            <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-red-900">Pesanan Tidak Ditemukan</h3>
                            <p className="mt-1 text-sm text-red-700 leading-relaxed">
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

                        <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 mb-8 mt-12 shadow-sm">
                            <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-5">Informasi Pesanan</h3>
                            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <dt className="text-xs font-medium text-gray-500 mb-1">Nomor Invoice</dt>
                                    <dd className="text-sm font-bold text-gray-900">{order.no_order}</dd>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <dt className="text-xs font-medium text-gray-500 mb-1">Tanggal Pesan</dt>
                                    <dd className="text-sm font-semibold text-gray-900">{order.tanggal_order}</dd>
                                </div>
                                <div className="col-span-2 sm:col-span-2">
                                    <dt className="text-xs font-medium text-gray-500 mb-1">Produk</dt>
                                    <dd className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                        {order.jenis_produk} 
                                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-gray-200 text-gray-700 text-xs font-bold">
                                            {order.jumlah} Qty
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">Jejak Aktivitas</h3>
                            <div className="flow-root">
                                <ul role="list" className="-mb-8">
                                    {order.logs && order.logs.length > 0 ? (
                                        order.logs.map((log, logIdx) => {
                                            const isLatest = logIdx === 0;
                                            return (
                                                <li key={logIdx}>
                                                    <div className="relative pb-8">
                                                        {logIdx !== order.logs.length - 1 ? (
                                                            <span className="absolute left-5 top-5 -ml-px h-full w-[2px] bg-gray-100" aria-hidden="true" />
                                                        ) : null}
                                                        <div className="relative flex items-start space-x-4">
                                                            <div className="relative">
                                                                <span className={`h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white shadow-sm z-10 transition-transform duration-300 hover:scale-110 ${getStatusColorClass(log.status_baru, 'badge')}`}>
                                                                    {isLatest ? (
                                                                        <CheckCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                                                    ) : (
                                                                        <ClockIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                                <div>
                                                                    <p className="text-sm text-gray-600">
                                                                        Pesanan masuk ke tahap <span className={`font-bold ${isLatest ? getStatusColorClass(log.status_baru, 'text') : 'text-gray-900'}`}>{log.status_label}</span>
                                                                    </p>
                                                                    {log.catatan && (
                                                                        <div className="mt-2 text-sm text-gray-600 bg-white p-3 rounded-xl shadow-sm border border-gray-100 relative before:content-[''] before:absolute before:-top-2 before:left-4 before:border-8 before:border-transparent before:border-b-white">
                                                                            <span className="italic">"{log.catatan}"</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="whitespace-nowrap text-right text-xs text-gray-400 flex flex-col items-end gap-1">
                                                                    <span className="font-medium bg-gray-100 px-2 py-1 rounded-md text-gray-600">{log.tanggal.split(' ')[0]}</span>
                                                                    <span>{log.tanggal.split(' ')[1]}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })
                                    ) : (
                                        <li className="text-sm text-gray-500 italic pb-8 flex justify-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
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
