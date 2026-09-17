import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { usePage } from '@inertiajs/react';

// Import Sub-Views
import SuperadminView from './Dashboard/SuperadminView';
import OwnerView from './Dashboard/OwnerView';
import AdminView from './Dashboard/AdminView';
import KepalaView from './Dashboard/KepalaView';
import StafView from './Dashboard/StafView';

// Import Notification Banner
import DeadlineNotificationBanner from '@/Components/DeadlineNotificationBanner';

export default function Dashboard({ stats = {}, recentOrders = [], upcomingDeadlines = [], lowStockCount = 0, extraData = {} }) {
    const { auth } = usePage().props;
    const user = auth.user;
    
    const renderRoleView = () => {
        switch (user?.level_akses) {
            case 0: // LEVEL_SUPERADMIN
                return <SuperadminView stats={stats} extraData={extraData} recentOrders={recentOrders} lowStockCount={lowStockCount} upcomingDeadlines={upcomingDeadlines} />;
            case 1: // LEVEL_OWNER
                return <OwnerView extraData={extraData} recentOrders={recentOrders} upcomingDeadlines={upcomingDeadlines} />;
            case 2: // LEVEL_ADMIN
                return <AdminView extraData={extraData} recentOrders={recentOrders} upcomingDeadlines={upcomingDeadlines} />;
            case 3: // LEVEL_KEPALA_DIVISI
                return <KepalaView extraData={extraData} />;
            case 4: // LEVEL_STAF
                return <StafView extraData={extraData} />;
            default:
                return (
                    <div className="text-center py-12 text-ink-soft">
                        <p>Akses ke dashboard tidak tersedia untuk peran Anda.</p>
                    </div>
                );
        }
    };

    return (
        <AppLayout title="Dashboard">
            {/* Welcome Section */}
            <div className="relative overflow-hidden rounded-panel bg-navy px-5 py-4 shadow-card mb-6">
                <div className="relative z-10 flex items-center gap-4">
                    <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/10 p-1 shadow-inner backdrop-blur-sm">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-accent text-lg font-bold font-oswald text-white shadow-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold font-oswald tracking-tight text-white m-0">
                            Selamat datang kembali, {user?.name}! 👋
                        </h2>
                        <p className="text-line/80 text-[12px] sm:text-[13px] font-sans mt-0.5">
                            Berikut adalah ringkasan aktivitas dan performa sistem hari ini.
                        </p>
                    </div>
                </div>
            </div>

            {/* Deadline Notification Banner — muncul jika ada order ≤ 3 hari */}
            <DeadlineNotificationBanner upcomingDeadlines={upcomingDeadlines} />

            {/* Render Dashboard Content Based on Role */}
            {renderRoleView()}
            
        </AppLayout>
    );
}
