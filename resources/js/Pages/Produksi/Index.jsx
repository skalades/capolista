import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Alert from '@/Components/Alert';
import { ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline';
import KanbanBoard from '@/Components/Kanban/KanbanBoard';
import KanbanColumn from '@/Components/Kanban/KanbanColumn';
import KanbanCard from '@/Components/Kanban/KanbanCard';
import StatsBar from '@/Components/Produksi/StatsBar';
import KapasitasTable from '@/Components/Produksi/KapasitasTable';
import EskalasiPanel from '@/Components/Produksi/EskalasiPanel';
import ThresholdSettings from '@/Components/Produksi/ThresholdSettings';

const TABS = [
    { key: 'kanban',    label: 'Kanban Board' },
    { key: 'kapasitas', label: 'Kapasitas & Target' },
    { key: 'eskalasi',  label: 'Eskalasi & Risiko' },
];

const KANBAN_COLUMNS = [
    { key: 'desain',     title: 'Desain',                      color: 'blue',   link: 'desain.show' },
    { key: 'produksi',   title: 'Menunggu Jadwal (Produksi)',   color: 'gray',   link: 'orders.show' },
    { key: 'cutting',    title: 'Cutting',                      color: 'green',  link: 'cutting.show' },
    { key: 'jahit',      title: 'Jahit',                        color: 'indigo', link: 'jahit.show' },
    { key: 'printing',   title: 'Printing',                     color: 'yellow', link: 'printing.show' },
    { key: 'pemasangan', title: 'Pemasangan',                   color: 'red',    link: 'pemasangan.show' },
];

// Filter options untuk kanban
const FILTER_OPTIONS = [
    { value: 'all',        label: 'Semua' },
    { value: 'bottleneck', label: '⚠️ Bottleneck Saja' },
    { value: 'overdue',    label: '🕐 Overdue Saja' },
    { value: 'risiko',     label: '🔴 Berisiko (Bottleneck + Overdue + Deadline Dekat)' },
];

export default function Index({ ordersByStatus, bottlenecks, statsPerDivisi, eskalasiOrders, thresholdConfig }) {
    const { auth } = usePage().props;
    const userLevel = auth?.user?.level_akses ?? 4;
    // Hanya level 0 (Superadmin), 1 (Owner), 2 (Admin) yang bisa edit threshold
    const canEditThreshold = userLevel <= 2;

    const [activeTab, setActiveTab]   = useState('kanban');
    const [filter, setFilter]         = useState('all');

    const totalBottleneck = bottlenecks?.length ?? 0;
    const totalEskalasi   = eskalasiOrders?.length ?? 0;

    // Terapkan filter ke ordersByStatus
    const filteredOrdersByStatus = React.useMemo(() => {
        if (filter === 'all') return ordersByStatus;

        const filtered = {};
        Object.keys(ordersByStatus).forEach((key) => {
            filtered[key] = (ordersByStatus[key] || []).filter((order) => {
                if (filter === 'bottleneck') return order.is_bottleneck;
                if (filter === 'overdue')    return order.is_overdue;
                if (filter === 'risiko')     return order.is_bottleneck || order.is_overdue || order.is_deadline_dekat;
                return true;
            });
        });
        return filtered;
    }, [ordersByStatus, filter]);

    const forwardToCutting = (orderId, e) => {
        e.stopPropagation();
        if (confirm('Jadwalkan order ini untuk mulai dikerjakan di Divisi Cutting?')) {
            router.post(route('orders.update-status', orderId), {
                status: 'cutting',
                catatan: 'Dijadwalkan untuk cutting oleh Koordinator Produksi',
            });
        }
    };

    const handleCardClick = (link, orderId) => {
        router.visit(route(link, orderId));
    };

    const getBadgeProps = (order, isBottleneck) => {
        if (order.is_overdue)        return { text: `Overdue ${Math.abs(order.hari_ke_deadline)}h`, color: 'red' };
        if (isBottleneck)            return { text: 'Tertahan', color: 'red' };
        if (order.is_deadline_dekat) return { text: `Deadline ${order.hari_ke_deadline}h lagi`, color: 'yellow' };
        return { text: `${order.hari_di_status} hari`, color: 'gray' };
    };

    return (
        <AppLayout title="Dashboard Koordinator Produksi">
            {/* Alert bottleneck */}
            {totalBottleneck > 0 && (
                <div className="mb-4">
                    <Alert
                        type="warning"
                        title={`⚠️ Ada ${totalBottleneck} order yang tertahan terlalu lama!`}
                    />
                </div>
            )}

            {/* Stats Bar */}
            <StatsBar statsPerDivisi={statsPerDivisi} />

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl w-fit">
                {TABS.map((tab) => {
                    const badgeCount =
                        tab.key === 'eskalasi' ? totalEskalasi :
                        tab.key === 'kanban'   ? totalBottleneck :
                        null;

                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                activeTab === tab.key
                                    ? 'bg-white text-brand-700 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                            }`}
                        >
                            {tab.label}
                            {badgeCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                    {badgeCount > 9 ? '9+' : badgeCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* === TAB: KANBAN === */}
            {activeTab === 'kanban' && (
                <div>
                    {/* Filter bar */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-500 font-medium">Filter:</span>
                        {FILTER_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setFilter(opt.value)}
                                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                                    filter === opt.value
                                        ? 'bg-brand-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex h-[calc(100vh-22rem)] relative">
                        <div className="flex-1 overflow-hidden">
                            <KanbanBoard>
                                {KANBAN_COLUMNS.map((col) => (
                                    <KanbanColumn
                                        key={col.key}
                                        title={col.title}
                                        count={filteredOrdersByStatus[col.key]?.length || 0}
                                        color={col.color}
                                    >
                                        {(filteredOrdersByStatus[col.key] || []).map((order) => {
                                            const isBottleneck = bottlenecks?.some((b) => b.id === order.id);
                                            const badge = getBadgeProps(order, isBottleneck);

                                            return (
                                                <div key={order.id} className="relative">
                                                    <KanbanCard
                                                        order={order}
                                                        imagePlaceholder={false}
                                                        badgeText={badge.text}
                                                        badgeColor={badge.color}
                                                        onClick={() => handleCardClick(col.link, order.id)}
                                                    />
                                                    {/* Icon indikator */}
                                                    {(isBottleneck || order.is_overdue) && (
                                                        <div className="absolute top-3 right-3 text-red-500" title="Perlu perhatian!">
                                                            <ExclamationTriangleIcon className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                    {order.is_deadline_dekat && !isBottleneck && !order.is_overdue && (
                                                        <div className="absolute top-3 right-3 text-orange-400" title="Deadline dekat">
                                                            <ClockIcon className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                    {/* Tombol mulai cutting untuk order di kolom produksi */}
                                                    {col.key === 'produksi' && (
                                                        <button
                                                            onClick={(e) => forwardToCutting(order.id, e)}
                                                            className="absolute bottom-3 right-3 text-xs bg-brand-50 text-brand-700 hover:bg-brand-100 px-3 py-1.5 rounded font-medium transition-colors border border-brand-200 shadow-sm"
                                                        >
                                                            Mulai Cutting
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </KanbanColumn>
                                ))}
                            </KanbanBoard>
                        </div>
                    </div>
                </div>
            )}

            {/* === TAB: KAPASITAS === */}
            {activeTab === 'kapasitas' && (
                <div>
                    <KapasitasTable statsPerDivisi={statsPerDivisi} />
                    <ThresholdSettings
                        thresholdConfig={thresholdConfig}
                        canEdit={canEditThreshold}
                    />
                </div>
            )}

            {/* === TAB: ESKALASI === */}
            {activeTab === 'eskalasi' && (
                <EskalasiPanel eskalasiOrders={eskalasiOrders} />
            )}
        </AppLayout>
    );
}
