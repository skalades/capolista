import { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    HomeIcon,
    ClipboardDocumentListIcon,
    PaintBrushIcon,
    PrinterIcon,
    WrenchScrewdriverIcon,
    Cog6ToothIcon,
    ArchiveBoxIcon,
    UsersIcon,
    ArrowRightOnRectangleIcon,
    BellIcon,
    Bars3Icon,
    XMarkIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    ShoppingCartIcon,
    UserGroupIcon,
    ChartBarIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

// Panggil route() dengan aman — kembalikan '#' jika route belum terdaftar
function safeRoute(name) {
    try {
        return route(name);
    } catch {
        return '#';
    }
}

function isActive(name) {
    try {
        return route().current(name);
    } catch {
        return false;
    }
}

const MENU_ITEMS = [
    { name: 'Dashboard',         routeName: 'dashboard',          icon: HomeIcon,                   levels: [0, 1, 2, 3, 4] },
    { name: 'Kelola Order',      routeName: 'orders.index',       icon: ClipboardDocumentListIcon,  levels: [0, 1, 2] },
    { name: 'Order Saya',        routeName: 'orders.index',       icon: ClipboardDocumentListIcon,  levels: [3, 4] },
    { name: 'Desain',            routeName: 'desain.index',       icon: PaintBrushIcon,             levels: [0, 1, 2, 3, 4], divisi: ['desain'] },
    { name: 'Cutting',           routeName: 'cutting.index',      icon: Cog6ToothIcon,              levels: [0, 1, 2, 3, 4], divisi: ['cutting'] },
    { name: 'Jahit',             routeName: 'jahit.index',        icon: Cog6ToothIcon,              levels: [0, 1, 2, 3, 4], divisi: ['jahit'] },
    { name: 'Printing',          routeName: 'printing.index',     icon: PrinterIcon,                levels: [0, 1, 2, 3, 4], divisi: ['printing'] },
    { name: 'Pemasangan',        routeName: 'pemasangan.index',   icon: WrenchScrewdriverIcon,      levels: [0, 1, 2, 3, 4], divisi: ['pemasangan'] },
    { name: 'Produksi',          routeName: 'produksi.index',     icon: Cog6ToothIcon,              levels: [0, 1, 2, 3, 4], divisi: ['produksi'] },
    { name: 'Procurement',       routeName: 'procurement.index',  icon: ShoppingCartIcon,           levels: [0, 1, 2, 3, 4], divisi: ['pembelian'] },
    { name: 'Gudang & Stok',     routeName: 'gudang.index',       icon: ArchiveBoxIcon,             levels: [0, 1, 2, 3, 4], divisi: ['gudang'] },
    { name: 'Keuangan',          routeName: 'keuangan.index',     icon: ClipboardDocumentListIcon,  levels: [0, 1, 2, 3, 4], divisi: ['keuangan'] },
    { name: 'HR & Gaji',         routeName: 'hr.penggajian.index',icon: UserGroupIcon,              levels: [0, 1, 2, 3, 4], divisi: ['hr'] },
    { name: 'Laporan',           routeName: 'laporan.index',      icon: ChartBarIcon,               levels: [0, 1, 2] },
    { name: 'Pengguna',          routeName: 'users.index',        icon: UsersIcon,                  levels: [0, 2] },
    { name: 'Superadmin',        routeName: 'superadmin.index',   icon: ShieldCheckIcon,            levels: [0] },
];

export default function AppLayout({ children, title = '', headerActions }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const levelAkses = user?.level_akses ?? -1;
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // ——— Notification Bell State ———
    const [notifOpen, setNotifOpen]           = useState(false);
    const [notifData, setNotifData]           = useState({ count: 0, orders: [] });
    const notifRef                            = useRef(null);

    const fetchDeadlines = async () => {
        try {
            const { data } = await axios.get(route('notifications.deadlines'));
            setNotifData(data);
        } catch {
            // silent fail — topbar tidak boleh crash
        }
    };

    useEffect(() => {
        fetchDeadlines();
        const interval = setInterval(fetchDeadlines, 5 * 60 * 1000); // refresh tiap 5 menit
        return () => clearInterval(interval);
    }, []);

    // Tutup dropdown notifikasi jika klik di luar
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDayLabel = (days) => {
        if (days === 0) return 'Hari ini!';
        if (days === 1) return 'Besok';
        return `${days} hari lagi`;
    };

    const getDayColor = (days) => {
        if (days === 0) return 'text-red-600';
        if (days === 1) return 'text-orange-500';
        return 'text-yellow-600';
    };

    const visibleMenu = MENU_ITEMS.filter(item => {
        if (!item.levels.includes(levelAkses)) return false;
        // Level 3 (Kepala Divisi) dan Level 4 (Staf) hanya melihat menu divisi mereka
        if ((levelAkses === 3 || levelAkses === 4) && item.divisi && !item.divisi.includes(user.divisi)) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo & Close Button */}
                <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6">
                    <h1 className="text-2xl font-bold tracking-wider text-brand-400">CAPOLISTA</h1>
                    <button 
                        className="lg:hidden text-gray-400 hover:text-white"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Nav Menu */}
                <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto scrollbar-hide">
                    {visibleMenu.map((item) => {
                        const href   = safeRoute(item.routeName);
                        const active = isActive(item.routeName);
                        return (
                            <Link
                                key={item.name}
                                href={href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                                    active
                                        ? 'bg-brand-600 text-white shadow-md'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                <item.icon className={`h-5 w-5 shrink-0 ${active ? 'text-white' : 'text-gray-400'}`} />
                                <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info + Logout */}
                <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold shrink-0 text-sm shadow-inner">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-400 truncate capitalize">
                                {user?.divisi || user?.roles?.[0] || 'User'}
                            </p>
                        </div>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors border border-gray-700 hover:border-gray-600"
                    >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen w-full lg:pl-64 transition-all duration-300">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-brand-600 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">{title}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {headerActions && (
                            <div className="flex items-center gap-2 mr-2">
                                {headerActions}
                            </div>
                        )}

                        {/* ——— Notification Bell Dropdown ——— */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setNotifOpen((o) => !o)}
                                className="p-2 text-gray-400 hover:text-brand-600 rounded-full hover:bg-gray-100 transition-colors relative"
                                title="Notifikasi Deadline"
                            >
                                <BellIcon className={`h-6 w-6 ${notifData.count > 0 ? 'text-orange-500' : ''}`} />
                                {notifData.count > 0 && (
                                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 ring-2 ring-white text-white text-[10px] font-bold flex items-center justify-center px-0.5">
                                        {notifData.count > 9 ? '9+' : notifData.count}
                                    </span>
                                )}
                            </button>

                            {/* Dropdown Panel */}
                            {notifOpen && (
                                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                    {/* Header dropdown */}
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-orange-50">
                                        <div className="flex items-center gap-2">
                                            <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />
                                            <p className="text-sm font-semibold text-orange-800">
                                                Deadline dalam 3 Hari
                                            </p>
                                        </div>
                                        {notifData.count > 0 && (
                                            <span className="text-xs bg-orange-200 text-orange-800 font-medium px-2 py-0.5 rounded-full">
                                                {notifData.count} order
                                            </span>
                                        )}
                                    </div>

                                    {/* List */}
                                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                                        {notifData.orders.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                                <BellIcon className="h-10 w-10 mb-2 opacity-30" />
                                                <p className="text-sm">Tidak ada deadline mendekat</p>
                                            </div>
                                        ) : (
                                            notifData.orders.map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                                            order.days_remaining === 0 ? 'bg-red-500' :
                                                            order.days_remaining === 1 ? 'bg-orange-500' : 'bg-yellow-400'
                                                        }`} />
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-gray-800 truncate">
                                                                {order.no_order}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {order.customer_nama}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="ml-2 shrink-0 text-right">
                                                        <p className={`text-xs font-semibold ${getDayColor(order.days_remaining)}`}>
                                                            {getDayLabel(order.days_remaining)}
                                                        </p>
                                                        <p className="text-xs text-gray-400 capitalize">
                                                            {order.status_label}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Footer */}
                                    {notifData.count > 0 && (
                                        <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50">
                                            <Link
                                                href={route('orders.index')}
                                                onClick={() => setNotifOpen(false)}
                                                className="text-xs font-medium text-brand-600 hover:text-brand-800 hover:underline"
                                            >
                                                Lihat semua order →
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-x-hidden">
                    <div className="sm:hidden mb-4">
                        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
}
