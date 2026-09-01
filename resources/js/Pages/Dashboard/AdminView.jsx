import React from 'react';
import StatsCard from '@/Components/StatsCard';
import Card from '@/Components/Card';
import { ClipboardDocumentListIcon, ExclamationCircleIcon, ClockIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function AdminView({ extraData, recentOrders, upcomingDeadlines }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatsCard title="Order Aktif" value={extraData.order_aktif || 0} icon={ClipboardDocumentListIcon} color="blue" />
                <StatsCard title="Order Terlambat" value={extraData.order_terlambat || 0} icon={ExclamationCircleIcon} color="red" />
                <StatsCard title="Menunggu Approval" value={extraData.order_menunggu_approval || 0} icon={MagnifyingGlassIcon} color="yellow" />
                <StatsCard title="Bottleneck (>3 Hari)" value={extraData.order_bottleneck || 0} icon={ClockIcon} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Upcoming Deadlines">
                    <div className="space-y-4 mt-4">
                        {upcomingDeadlines?.map((order) => (
                            <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-sm">{order.no_order}</p>
                                    <p className="text-xs text-gray-500">{order.customer?.nama || 'Unknown'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-red-600 font-medium">
                                        {formatDate(order.deadline)}
                                    </p>
                                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full capitalize">
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {(!upcomingDeadlines || upcomingDeadlines.length === 0) && (
                            <p className="text-center text-sm text-gray-500 py-4">Tidak ada deadline dalam waktu dekat.</p>
                        )}
                    </div>
                </Card>

                <Card title="Recent Orders">
                    <div className="space-y-4 mt-4">
                        {recentOrders?.map((order) => (
                            <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-sm">{order.no_order}</p>
                                    <p className="text-xs text-gray-500">{order.jenis_produk}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {(!recentOrders || recentOrders.length === 0) && (
                            <p className="text-center text-sm text-gray-500 py-4">Belum ada order terbaru.</p>
                        )}
                    </div>
                </Card>
            </div>
        </>
    );
}
