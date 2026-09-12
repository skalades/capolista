import { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    LayoutDashboard,
    Package,
    FileEdit,
    PenTool,
    ShoppingCart,
    Printer,
    Hammer,
    Scissors,
    Shirt,
    Box,
    Truck,
    Warehouse,
    Wallet,
    Factory,
    Users,
    ClipboardCheck,
    ClipboardList,
    Banknote,
    BarChart2,
    UserCog,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    AlertTriangle
} from 'lucide-react';

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

const MENU_SECTIONS = [
    {
        title: 'RINGKASAN',
        items: [
            { name: 'Dashboard', routeName: 'dashboard', icon: LayoutDashboard, levels: [0, 1, 2, 3, 4] },
            { name: 'Manajemen Order', routeName: 'orders.index', icon: Package, levels: [0, 1, 2, 3, 4] },
        ],
    },
    {
        title: 'DIVISI & ALUR',
        items: [
            { name: 'Draft Order', routeName: 'orders.create', icon: FileEdit, levels: [0, 1, 2, 3, 4] },
            { name: 'Desain & Pola', routeName: 'desain.index', icon: PenTool, levels: [0, 1, 2, 3, 4], divisi: ['desain'] },
            { name: 'Procurement', routeName: 'procurement.index', icon: ShoppingCart, levels: [0, 1, 2, 3, 4], divisi: ['pembelian'] },
            { name: 'Printing', routeName: 'printing.index', icon: Printer, levels: [0, 1, 2, 3, 4], divisi: ['printing'] },
            { name: 'Pemasangan', routeName: 'pemasangan.index', icon: Hammer, levels: [0, 1, 2, 3, 4], divisi: ['pemasangan'] },
            { name: 'Cutting', routeName: 'cutting.index', icon: Scissors, levels: [0, 1, 2, 3, 4], divisi: ['cutting'] },
            { name: 'Jahit', routeName: 'jahit.index', icon: Shirt, levels: [0, 1, 2, 3, 4], divisi: ['jahit'] },
            { name: 'Packing', routeName: 'gudang.packing.index', icon: Box, levels: [0, 1, 2, 3, 4], divisi: ['gudang'] },
            { name: 'Dikirim', routeName: '#', icon: Truck, levels: [0, 1, 2, 3, 4] },
            { name: 'Gudang & Stok', routeName: 'gudang.index', icon: Warehouse, levels: [0, 1, 2, 3, 4], divisi: ['gudang'] },
            { name: 'Keuangan', routeName: 'keuangan.index', icon: Wallet, levels: [0, 1, 2, 3, 4], divisi: ['keuangan'] },
            { name: 'Produksi (Koordinator)', routeName: 'produksi.index', icon: Factory, levels: [0, 1, 2, 3, 4], divisi: ['produksi'] },
        ],
    },
    {
        title: 'HR & SUMBER DAYA',
        items: [
            { name: 'Data Karyawan', routeName: 'users.index', icon: Users, levels: [0, 1, 2] },
            { name: 'Absensi', routeName: 'hr.absensi.index', icon: ClipboardCheck, levels: [0, 1, 2, 3, 4], divisi: ['hr'] },
            { name: 'Approval Borongan', routeName: 'hr.output.rekap', icon: ClipboardList, levels: [0, 1, 2, 3, 4], divisi: ['hr'] },
            { name: 'Penggajian', routeName: 'hr.penggajian.index', icon: Banknote, levels: [0, 1, 2, 3, 4], divisi: ['hr'] },
        ],
    },
    {
        title: 'SISTEM',
        items: [
            { name: 'Laporan & Analitik', routeName: 'laporan.index', icon: BarChart2, levels: [0, 1, 2] },
            { name: 'Pengguna & Akses', routeName: 'superadmin.roles', icon: UserCog, levels: [0] },
            { name: 'Pengaturan Sistem', routeName: 'superadmin.settings', icon: Settings, levels: [0] },
        ],
    },
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
            // silent fail
        }
    };

    useEffect(() => {
        fetchDeadlines();
        const interval = setInterval(fetchDeadlines, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

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
        if (days === 0) return 'text-danger';
        if (days === 1) return 'text-gold';
        return 'text-gold';
    };

    return (
        <div className="min-h-screen bg-bg flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-navy/50 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-[230px] bg-navy flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-6 shrink-0 border-b border-line/10">
                    <h1 className="text-xl font-bold font-oswald tracking-widest text-white mt-1">CAPOLISTA</h1>
                    <button 
                        className="lg:hidden text-line hover:text-white"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Nav Menu */}
                <nav className="flex-1 py-4 overflow-y-auto scrollbar-hide">
                    {MENU_SECTIONS.map((section, idx) => {
                        const visibleItems = section.items.filter(item => {
                            if (!item.levels.includes(levelAkses)) return false;
                            if ((levelAkses === 3 || levelAkses === 4) && item.divisi && !item.divisi.includes(user.divisi)) return false;
                            return true;
                        });

                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={idx} className="mb-6 px-3">
                                <h3 className="px-3 mb-2 text-[11px] font-bold text-line tracking-wider uppercase">
                                    {section.title}
                                </h3>
                                <div className="space-y-1">
                                    {visibleItems.map((item) => {
                                        const href   = safeRoute(item.routeName);
                                        const active = isActive(item.routeName);
                                        return (
                                            <Link
                                                key={item.name}
                                                href={href}
                                                onClick={() => setIsSidebarOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200 ${
                                                    active
                                                        ? 'bg-white/10 text-white'
                                                        : 'text-line hover:bg-white/5 hover:text-white'
                                                }`}
                                            >
                                                <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-white' : 'text-line'}`} strokeWidth={active ? 2.5 : 2} />
                                                <span className={`text-[13px] ${active ? 'font-semibold' : 'font-medium'}`}>{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* User Info + Logout */}
                <div className="p-4 bg-black/10 shrink-0">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-semibold shrink-0 text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[13px] font-medium text-white truncate">{user?.name}</p>
                            <p className="text-[11px] text-line truncate capitalize">
                                {user?.divisi || user?.roles?.[0] || 'User'}
                            </p>
                        </div>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[12px] font-medium text-line rounded hover:bg-white/10 hover:text-white transition-colors border border-line/20"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen w-full lg:pl-[230px] transition-all duration-300">
                {/* Topbar */}
                <header className="h-16 bg-panel border-b border-line px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 -ml-2 text-ink-soft hover:text-accent rounded hover:bg-line/20 transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h2 className="text-[22px] font-semibold font-oswald text-ink hidden sm:block">{title}</h2>
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
                                className="p-2 text-ink-soft hover:text-accent rounded-full hover:bg-line/20 transition-colors relative"
                                title="Notifikasi Deadline"
                            >
                                <Bell className={`h-[22px] w-[22px] ${notifData.count > 0 ? 'text-gold' : ''}`} />
                                {notifData.count > 0 && (
                                    <span className="absolute top-1 right-1 min-w-[16px] h-[16px] rounded-full bg-danger text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                                        {notifData.count > 9 ? '9+' : notifData.count}
                                    </span>
                                )}
                            </button>

                            {/* Dropdown Panel */}
                            {notifOpen && (
                                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 panel z-50 overflow-hidden shadow-card">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-gold/10">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-gold" />
                                            <p className="text-[13px] font-semibold text-ink">
                                                Deadline dalam 3 Hari
                                            </p>
                                        </div>
                                        {notifData.count > 0 && (
                                            <span className="text-[10px] bg-gold/20 text-gold font-medium px-2 py-0.5 rounded-full">
                                                {notifData.count} order
                                            </span>
                                        )}
                                    </div>

                                    <div className="max-h-80 overflow-y-auto divide-y divide-line">
                                        {notifData.orders.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-8 text-ink-soft">
                                                <Bell className="h-8 w-8 mb-2 opacity-30" />
                                                <p className="text-[12px]">Tidak ada deadline mendekat</p>
                                            </div>
                                        ) : (
                                            notifData.orders.map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="flex items-center justify-between px-4 py-3 hover:bg-line/10 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                                            order.days_remaining === 0 ? 'bg-danger' :
                                                            order.days_remaining === 1 ? 'bg-gold' : 'bg-gold'
                                                        }`} />
                                                        <div className="min-w-0">
                                                            <p className="text-[13px] font-medium text-ink truncate">
                                                                {order.no_order}
                                                            </p>
                                                            <p className="text-[11px] text-ink-soft truncate">
                                                                {order.customer_nama}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="ml-2 shrink-0 text-right">
                                                        <p className={`text-[11px] font-semibold ${getDayColor(order.days_remaining)}`}>
                                                            {getDayLabel(order.days_remaining)}
                                                        </p>
                                                        <p className="text-[11px] text-ink-soft capitalize">
                                                            {order.status_label}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {notifData.count > 0 && (
                                        <div className="border-t border-line px-4 py-2.5 bg-panel">
                                            <Link
                                                href={route('orders.index')}
                                                onClick={() => setNotifOpen(false)}
                                                className="text-[11px] font-medium text-navy hover:text-accent"
                                            >
                                                Lihat semua order &rarr;
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-4 sm:p-6 flex-1 overflow-x-hidden">
                    <div className="sm:hidden mb-4">
                        <h2 className="text-[20px] font-oswald font-semibold text-ink">{title}</h2>
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
}
