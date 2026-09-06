import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import {
    ExclamationTriangleIcon,
    ClockIcon,
    PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

function RisikoBadge({ order }) {
    if (order.is_overdue) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                <ClockIcon className="w-3 h-3" /> Overdue
            </span>
        );
    }
    if (order.is_bottleneck) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                <ExclamationTriangleIcon className="w-3 h-3" /> Bottleneck
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
            ⚡ Deadline Dekat
        </span>
    );
}

export default function EskalasiModal({ eskalasiOrders }) {
    const [modalOpen, setModalOpen]   = useState(false);
    const [selectedOrder, setSelected] = useState(null);
    const [catatan, setCatatan]        = useState('');
    const [loading, setLoading]        = useState(false);

    const openModal = (order) => {
        setSelected(order);
        setCatatan('');
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelected(null);
    };

    const handleSubmit = () => {
        if (!catatan.trim()) return;
        setLoading(true);
        router.post(
            route('produksi.eskalasi', selectedOrder.id),
            { catatan },
            {
                preserveScroll: true,
                onFinish: () => {
                    setLoading(false);
                    closeModal();
                },
            }
        );
    };

    if (!eskalasiOrders?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl">✅</span>
                </div>
                <p className="font-medium text-gray-600">Semua order dalam kondisi normal</p>
                <p className="text-sm mt-1">Tidak ada order yang perlu dieskalasi saat ini.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-3 flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                <span className="text-sm font-semibold text-red-600">
                    {eskalasiOrders.length} order memerlukan perhatian
                </span>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">No Order</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Hari di Status</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Deadline</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Risiko</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {eskalasiOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-red-50/30 transition-colors">
                                <td className="px-4 py-3 font-mono font-semibold text-gray-900">
                                    {order.no_order}
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    {order.customer?.nama ?? '—'}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium capitalize">
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`font-semibold ${order.hari_di_status > order.threshold ? 'text-red-600' : 'text-gray-700'}`}>
                                        {order.hari_di_status} hari
                                    </span>
                                    <span className="text-gray-400 text-xs"> / max {order.threshold}</span>
                                </td>
                                <td className="px-4 py-3 text-center text-gray-600 text-xs">
                                    {order.deadline
                                        ? new Date(order.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                                        : '—'
                                    }
                                    {order.hari_ke_deadline !== null && (
                                        <div className={`text-[10px] font-semibold ${order.is_overdue ? 'text-red-600' : 'text-orange-500'}`}>
                                            {order.is_overdue
                                                ? `${Math.abs(order.hari_ke_deadline)} hari lewat`
                                                : `${order.hari_ke_deadline} hari lagi`
                                            }
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <RisikoBadge order={order} />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => openModal(order)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                                    >
                                        <PaperAirplaneIcon className="w-3.5 h-3.5" />
                                        Eskalasi
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal konfirmasi eskalasi */}
            <Modal show={modalOpen} onClose={closeModal} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Kirim Eskalasi ke Manajemen</h3>
                            <p className="text-sm text-gray-500">
                                Order <span className="font-mono font-semibold">{selectedOrder?.no_order}</span> —{' '}
                                {selectedOrder?.customer?.nama}
                            </p>
                        </div>
                    </div>

                    <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800">
                        Order ini sudah <strong>{selectedOrder?.hari_di_status} hari</strong> di status{' '}
                        <strong className="capitalize">{selectedOrder?.status}</strong>.
                        {selectedOrder?.is_overdue && (
                            <span className="ml-1 text-red-600 font-semibold">
                                Deadline sudah terlewat {Math.abs(selectedOrder?.hari_ke_deadline)} hari!
                            </span>
                        )}
                    </div>

                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Catatan / Alasan Eskalasi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        rows={3}
                        maxLength={500}
                        placeholder="Jelaskan kondisi atau kendala yang dihadapi..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
                    />
                    <div className="text-xs text-gray-400 text-right mt-0.5">{catatan.length}/500</div>

                    <p className="text-xs text-gray-500 mt-2 mb-4">
                        Notifikasi akan dikirim ke semua Owner dan Admin yang aktif.
                    </p>

                    <div className="flex justify-end gap-2">
                        <SecondaryButton onClick={closeModal} disabled={loading}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            onClick={handleSubmit}
                            disabled={loading || !catatan.trim()}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        >
                            {loading ? 'Mengirim...' : 'Kirim Eskalasi'}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
