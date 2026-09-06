import React from 'react';
import { Link } from '@inertiajs/react';

export default function HRTabs() {
    const navs = [
        { name: 'Daftar Gaji', href: route('hr.penggajian.index'), activeRoute: 'hr.penggajian.index' },
        { name: 'Input Absensi', href: route('hr.absensi.index'), activeRoute: 'hr.absensi.index' },
        { name: 'Rekap Absensi', href: route('hr.absensi.rekap'), activeRoute: 'hr.absensi.rekap' },
        { name: 'Rekap Output', href: route('hr.output.rekap'), activeRoute: 'hr.output.rekap' },
    ];

    return (
        <div className="flex gap-1 mt-0 bg-line/20 p-1 rounded-xl w-fit">
            {navs.map((nav) => {
                const isActive = route().current(nav.activeRoute);
                return (
                    <Link
                        key={nav.name}
                        href={nav.href}
                        className={`relative px-4 py-2 text-[13px] font-sans font-medium rounded-lg transition-all duration-200 ${
                            isActive
                                ? 'bg-panel text-ink shadow-sm'
                                : 'text-ink-soft hover:text-ink hover:bg-line/30'
                        }`}
                    >
                        {nav.name}
                    </Link>
                );
            })}
        </div>
    );
}
