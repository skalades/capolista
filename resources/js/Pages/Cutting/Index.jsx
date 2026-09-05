import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import KanbanBoard from '@/Components/Kanban/KanbanBoard';
import KanbanColumn from '@/Components/Kanban/KanbanColumn';
import KanbanCard from '@/Components/Kanban/KanbanCard';
import SidePanel from '@/Components/Kanban/SidePanel';
import Badge from '@/Components/Badge';
import { ScissorsIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import StatsCard from '@/Components/StatsCard';

export default function Index({ orders, stats }) {
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Grouping orders by cutting status
    const groupedOrders = {
        menunggu: [],
        dikerjakan: [],
    };

    orders?.forEach(order => {
        const status = order.cutting?.status || 'menunggu';
        if (groupedOrders[status]) {
            groupedOrders[status].push(order);
        } else {
            groupedOrders.menunggu.push(order);
        }
    });

    const handleCardClick = (order) => {
        // Option 1: fetch complete data if needed, or just redirect to show view for now
        // since we didn't fully integrate Cutting Show into SidePanel yet.
        // Let's redirect to Show view to keep it simple, OR we can build the SidePanel.
        // The instructions said to incorporate Show.jsx functionality into SidePanel.
        router.visit(route('cutting.show', order.id));
    };

    const startCutting = (orderId, e) => {
        e.stopPropagation();
        if (confirm('Mulai proses cutting untuk order ini?')) {
            router.post(route('cutting.mulai', orderId));
        }
    };

    return (
        <AppLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Divisi Cutting</h2>}>
            <Head title="Cutting" />

            <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard title="Menunggu Dikerjakan" value={stats.menunggu} icon={ClockIcon} color="orange" />
                    <StatsCard title="Sedang Dikerjakan" value={stats.dikerjakan} icon={ScissorsIcon} color="blue" />
                    <StatsCard title="Selesai Hari Ini" value={stats.selesai_hari_ini} icon={CheckCircleIcon} color="green" />
                </div>

                <div className="flex h-[calc(100vh-20rem)] relative">
                    <div className="flex-1 overflow-hidden">
                        <KanbanBoard>
                            {/* Menunggu Column */}
                            <KanbanColumn title="Menunggu" count={groupedOrders.menunggu.length} color="orange">
                                {groupedOrders.menunggu.map(order => (
                                    <div key={order.id} className="relative">
                                        <KanbanCard 
                                            order={order}
                                            imagePlaceholder={false}
                                            badgeText="Menunggu"
                                            badgeColor="yellow"
                                            onClick={() => handleCardClick(order)}
                                        />
                                        <button 
                                            onClick={(e) => startCutting(order.id, e)}
                                            className="absolute bottom-3 right-3 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded"
                                        >
                                            Mulai
                                        </button>
                                    </div>
                                ))}
                            </KanbanColumn>
                            
                            {/* Dikerjakan Column */}
                            <KanbanColumn title="Sedang Dikerjakan" count={groupedOrders.dikerjakan.length} color="blue">
                                {groupedOrders.dikerjakan.map(order => (
                                    <KanbanCard 
                                        key={order.id} 
                                        order={order}
                                        imagePlaceholder={false}
                                        badgeText="Dikerjakan"
                                        badgeColor="gray"
                                        onClick={() => handleCardClick(order)}
                                    />
                                ))}
                            </KanbanColumn>
                        </KanbanBoard>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
