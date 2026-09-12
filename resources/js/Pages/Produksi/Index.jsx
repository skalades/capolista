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
    { key: 'procurement',title: 'Procurement',                 color: 'yellow', link: 'orders.show' },
    { key: 'printing',   title: 'Printing',                     color: 'purple', link: 'printing.show' },
    { key: 'pemasangan', title: 'Pemasangan',                   color: 'pink',   link: 'pemasangan.show' },
    { key: 'cutting',    title: 'Cutting',                      color: 'green',  link: 'cutting.show' },
    { key: 'jahit',      title: 'Jahit',                        color: 'indigo', link: 'jahit.show' },
    { key: 'produksi',   title: 'Menunggu Jadwal (Lainnya)',    color: 'gray',   link: 'orders.show' },
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
            <div className="flex gap-1 mb-4 bg-line/20 p-1 rounded-xl w-fit">
                {TABS.map((tab) => {
                    const badgeCount =
                        tab.key === 'eskalasi' ? totalEskalasi :
                        tab.key === 'kanban'   ? totalBottleneck :
                        null;

                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`relative px-4 py-2 text-[13px] font-sans font-medium rounded-lg transition-all duration-200 ${
                                activeTab === tab.key
                                    ? 'bg-panel text-ink shadow-sm'
                                    : 'text-ink-soft hover:text-ink hover:bg-line/30'
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
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-[12px] text-ink-soft font-sans font-medium">Filter:</span>
                        {FILTER_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setFilter(opt.value)}
                                className={`px-3 py-1.5 text-[11.5px] font-sans rounded-full font-medium transition-colors border ${
                                    filter === opt.value
                                        ? 'bg-navy text-white border-navy'
                                        : 'bg-panel text-ink-soft border-line hover:bg-line/20'
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
                                                    {/* Tombol mulai proses untuk order di kolom procurement dan produksi */}
                                                    {col.key === 'procurement' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (confirm('Lanjutkan order ini ke Divisi Printing?')) {
                                                                    router.post(route('orders.update-status', order.id), { status: 'printing', catatan: 'Diteruskan ke printing' });
                                                                }
                                                            }}
                                                            className="absolute bottom-3 right-3 text-xs bg-brand-50 text-brand-700 hover:bg-brand-100 px-3 py-1.5 rounded font-medium transition-colors border border-brand-200 shadow-sm"
                                                        >
                                                            Kirim ke Printing
                                                        </button>
                                                    )}
                                                    {col.key === 'produksi' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (confirm('Jadwalkan order ini untuk mulai dikerjakan di Divisi Cutting?')) {
                                                                    router.post(route('orders.update-status', order.id), { status: 'cutting', catatan: 'Dijadwalkan untuk cutting' });
                                                                }
                                                            }}
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
