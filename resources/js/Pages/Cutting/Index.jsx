import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import KanbanBoard from '@/Components/Kanban/KanbanBoard';
import KanbanColumn from '@/Components/Kanban/KanbanColumn';
import KanbanCard from '@/Components/Kanban/KanbanCard';
import { ScissorsIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import StatsCard from '@/Components/StatsCard';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ orders, stats }) {
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
        router.visit(route('cutting.show', order.id));
    };

    const startCutting = (orderId, e) => {
        e.stopPropagation();
        if (confirm('Mulai proses cutting untuk order ini?')) {
            router.post(route('cutting.mulai', orderId));
        }
    };

    return (
        <AppLayout 
            title={
                <div className="flex flex-col justify-center mt-1">
                    <div className="flex items-center gap-3 leading-none">
                        <span>Divisi Cutting</span>
                    </div>
                    <span className="text-[12px] text-ink-soft mt-1 font-sans font-normal normal-case tracking-normal leading-none">Pantau dan kelola antrean potong kain berdasarkan SPK.</span>
                </div>
            }
        >
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard 
                        title="Menunggu Dikerjakan" 
                        value={stats.menunggu} 
                        status="gold" 
                        caption="Antrian order baru"
                    />
                    <StatsCard 
                        title="Sedang Dikerjakan" 
                        value={stats.dikerjakan} 
                        status="accent"
                        caption="Proses potong kain"
                    />
                    <StatsCard 
                        title="Selesai Hari Ini" 
                        value={stats.selesai_hari_ini} 
                        status="neutral" 
                        caption="Order selesai dan oper ke Jahit"
                    />
                </div>

                <div className="flex h-[calc(100vh-20rem)] relative">
                    <div className="flex-1 overflow-hidden">
                        <KanbanBoard>
                            {/* Menunggu Column */}
                            <KanbanColumn title="Menunggu" count={groupedOrders.menunggu.length} color="gold">
                                {groupedOrders.menunggu.map(order => (
                                    <div key={order.id} className="relative group cursor-pointer border border-line bg-panel p-3 rounded hover:border-navy mb-3 transition-colors" onClick={() => handleCardClick(order)}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-bold text-[13px] text-ink font-mono">{order.no_order}</div>
                                            <span className="text-[10px] bg-gold/10 text-gold font-bold px-2 py-0.5 rounded border border-gold/20">
                                                Menunggu
                                            </span>
                                        </div>
                                        <div className="text-[12px] text-ink-soft mb-4">{order.customer?.nama} • {order.jumlah} pcs</div>
                                        
                                        <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PrimaryButton 
                                                size="sm"
                                                onClick={(e) => startCutting(order.id, e)}
                                            >
                                                Mulai Potong
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                ))}
                            </KanbanColumn>
                            
                            {/* Dikerjakan Column */}
                            <KanbanColumn title="Sedang Dikerjakan" count={groupedOrders.dikerjakan.length} color="accent">
                                {groupedOrders.dikerjakan.map(order => (
                                    <div key={order.id} className="cursor-pointer border border-line bg-panel p-3 rounded hover:border-navy mb-3 transition-colors" onClick={() => handleCardClick(order)}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-bold text-[13px] text-ink font-mono">{order.no_order}</div>
                                            <span className="text-[10px] bg-accent/10 text-accent font-bold px-2 py-0.5 rounded border border-accent/20">
                                                Dikerjakan
                                            </span>
                                        </div>
                                        <div className="text-[12px] text-ink-soft mb-2">{order.customer?.nama} • {order.jumlah} pcs</div>
                                        <div className="text-[11px] text-ink-soft border-t border-line pt-2 mt-2">
                                            Klik untuk update hasil & QC
                                        </div>
                                    </div>
                                ))}
                            </KanbanColumn>
                        </KanbanBoard>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
