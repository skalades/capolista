import React from 'react';
import StatsCard from '@/Components/StatsCard';
import Card from '@/Components/Card';
import { CurrencyDollarIcon, CreditCardIcon, CheckBadgeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function OwnerView({ extraData, recentOrders, upcomingDeadlines }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatsCard title="Omzet Bulan Ini" value={formatCurrency(extraData.omzet_bulan_ini)} icon={CurrencyDollarIcon} color="green" />
                <StatsCard title="Total Piutang" value={formatCurrency(extraData.total_piutang)} icon={CreditCardIcon} color="red" />
                <StatsCard title="Order Selesai" value={extraData.order_selesai || 0} icon={CheckBadgeIcon} color="blue" />
                <StatsCard title="Order Terlambat" value={extraData.order_terlambat || 0} icon={ExclamationTriangleIcon} color="red" />
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
                                    <p className="text-sm font-medium">{formatCurrency(order.total_harga)}</p>
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
