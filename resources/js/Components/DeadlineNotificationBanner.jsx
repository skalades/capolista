import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    ExclamationTriangleIcon,
    XMarkIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';

/**
 * Banner notifikasi yang muncul di dashboard ketika ada order
 * yang akan jatuh tempo dalam 3 hari ke depan.
 *
 * @param {Array}   upcomingDeadlines  - Array order dari server (sudah include days_remaining)
 */
export default function DeadlineNotificationBanner({ upcomingDeadlines = [] }) {
    const [dismissed, setDismissed]   = useState(false);
    const [collapsed, setCollapsed]   = useState(false);

    if (!upcomingDeadlines || upcomingDeadlines.length === 0 || dismissed) {
        return null;
    }

    const urgentCount    = upcomingDeadlines.filter((o) => o.days_remaining === 0).length;
    const tomorrowCount  = upcomingDeadlines.filter((o) => o.days_remaining === 1).length;
    const totalCount     = upcomingDeadlines.length;

    // Warna border & ikon berdasarkan urgency
    const isUrgent = urgentCount > 0;

    const getDayLabel = (days) => {
        if (days === 0) return { text: 'Hari ini!', color: 'text-red-700 bg-red-100' };
        if (days === 1) return { text: 'Besok',     color: 'text-orange-700 bg-orange-100' };
        if (days === 2) return { text: '2 hari lagi', color: 'text-yellow-700 bg-yellow-100' };
        return { text: `${days} hari lagi`, color: 'text-yellow-600 bg-yellow-50' };
    };

    return (
        <div
            className={`mb-6 rounded-xl border-l-4 shadow-sm overflow-hidden transition-all duration-300 ${
                isUrgent
                    ? 'border-red-500 bg-red-50'
                    : 'border-orange-400 bg-orange-50'
            }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <ExclamationTriangleIcon
                        className={`h-5 w-5 shrink-0 ${isUrgent ? 'text-red-500' : 'text-orange-500'}`}
                    />
                    <p className={`font-semibold text-sm ${isUrgent ? 'text-red-800' : 'text-orange-800'}`}>
                        ⚠️ {totalCount} Order Mendekati Deadline!
                        {urgentCount > 0 && (
                            <span className="ml-2 text-xs font-medium bg-red-200 text-red-800 px-2 py-0.5 rounded-full">
                                {urgentCount} jatuh tempo hari ini
                            </span>
                        )}
                        {tomorrowCount > 0 && (
                            <span className="ml-1 text-xs font-medium bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">
                                {tomorrowCount} besok
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setCollapsed((c) => !c)}
                        className={`p-1.5 rounded-lg transition-colors ${
                            isUrgent
                                ? 'hover:bg-red-100 text-red-600'
                                : 'hover:bg-orange-100 text-orange-600'
                        }`}
                        title={collapsed ? 'Tampilkan detail' : 'Sembunyikan detail'}
                    >
                        {collapsed ? (
                            <ChevronDownIcon className="h-4 w-4" />
                        ) : (
                            <ChevronUpIcon className="h-4 w-4" />
                        )}
                    </button>
                    <button
                        onClick={() => setDismissed(true)}
                        className={`p-1.5 rounded-lg transition-colors ${
                            isUrgent
                                ? 'hover:bg-red-100 text-red-400 hover:text-red-700'
                                : 'hover:bg-orange-100 text-orange-400 hover:text-orange-700'
                        }`}
                        title="Tutup notifikasi"
                    >
                        <XMarkIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Detail list */}
            {!collapsed && (
                <div className={`px-4 pb-4 border-t ${isUrgent ? 'border-red-200' : 'border-orange-200'}`}>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                        {upcomingDeadlines.map((order) => {
                            const dayLabel = getDayLabel(order.days_remaining);
                            return (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100 shadow-sm"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <ClockIcon className="h-4 w-4 shrink-0 text-gray-400" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">
                                                {order.no_order}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {order.customer?.nama ?? order.customer_nama ?? '-'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 ml-2 shrink-0">
                                        <span
                                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${dayLabel.color}`}
                                        >
                                            {dayLabel.text}
                                        </span>
                                        <span className="text-xs text-gray-400 capitalize">
                                            {order.status_label ?? order.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Link ke orders */}
                    <div className="mt-3 flex justify-end">
                        <Link
                            href={route('orders.index')}
                            className={`text-xs font-medium underline-offset-2 hover:underline ${
                                isUrgent ? 'text-red-700' : 'text-orange-700'
                            }`}
                        >
                            Lihat semua order →
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
