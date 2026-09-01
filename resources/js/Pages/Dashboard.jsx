import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { usePage } from '@inertiajs/react';

// Import Sub-Views
import SuperadminView from './Dashboard/SuperadminView';
import OwnerView from './Dashboard/OwnerView';
import AdminView from './Dashboard/AdminView';
import KepalaView from './Dashboard/KepalaView';
import StafView from './Dashboard/StafView';

export default function Dashboard({ stats = {}, recentOrders = [], upcomingDeadlines = [], lowStockCount = 0, extraData = {} }) {
    const { auth } = usePage().props;
    const user = auth.user;
    
    const renderRoleView = () => {
        switch (user?.level_akses) {
            case 0: // LEVEL_SUPERADMIN
                return <SuperadminView extraData={extraData} />;
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
                    <div className="text-center py-12 text-gray-500">
                        <p>Akses ke dashboard tidak tersedia untuk peran Anda.</p>
                    </div>
                );
        }
    };

    return (
        <AppLayout title="Dashboard">
            {/* Welcome Section */}
            <div className="relative overflow-hidden rounded-2xl bg-brand-900 px-6 py-10 shadow-lg sm:px-12 mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600/40 to-brand-900/90 mix-blend-multiply" />
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-brand-400 rounded-full blur-3xl opacity-30" />
                
                <div className="relative z-10 flex items-center gap-6">
                    <div className="hidden sm:flex h-20 w-20 items-center justify-center rounded-full bg-white/10 p-2 shadow-inner ring-1 ring-white/20 backdrop-blur-sm">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-brand-500 text-2xl font-bold text-white shadow-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                            Selamat datang kembali, {user?.name}! 👋
                        </h2>
                        <p className="text-brand-100 max-w-2xl text-sm sm:text-base">
                            Berikut adalah ringkasan aktivitas dan performa sistem hari ini. 
                            Pantau terus progres pekerjaan untuk memastikan target tercapai.
                        </p>
                    </div>
                </div>
            </div>

            {/* Render Dashboard Content Based on Role */}
            {renderRoleView()}
            
        </AppLayout>
    );
}
