import React from 'react';
import {
    ScissorsIcon,
    WrenchScrewdriverIcon,
    PrinterIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/solid';

const DIVISI_CONFIG = {
    cutting: {
        label: 'Cutting',
        icon: ScissorsIcon,
        color: 'lime',
        bg: 'bg-lime-50',
        border: 'border-lime-200',
        text: 'text-lime-700',
        iconBg: 'bg-lime-100',
    },
    jahit: {
        label: 'Jahit',
        icon: WrenchScrewdriverIcon,
        color: 'cyan',
        bg: 'bg-cyan-50',
        border: 'border-cyan-200',
        text: 'text-cyan-700',
        iconBg: 'bg-cyan-100',
    },
    printing: {
        label: 'Printing',
        icon: PrinterIcon,
        color: 'purple',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        iconBg: 'bg-purple-100',
    },
    pemasangan: {
        label: 'Pemasangan',
        icon: SparklesIcon,
        color: 'pink',
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        text: 'text-pink-700',
        iconBg: 'bg-pink-100',
    },
};

function ProgressBar({ value, max, colorClass = 'bg-green-500' }) {
    const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
    return (
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div
                className={`${colorClass} h-1.5 rounded-full transition-all duration-500`}
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}

export default function StatsBar({ statsPerDivisi }) {
    const divisis = ['cutting', 'jahit', 'printing', 'pemasangan'];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {divisis.map((divisi) => {
                const stat   = statsPerDivisi?.[divisi] ?? {};
                const config = DIVISI_CONFIG[divisi];
                const Icon   = config.icon;

                const pctProgress = stat.target_pcs > 0 && stat.output_hari_ini != null
                    ? Math.min(100, Math.round((stat.output_hari_ini / stat.target_pcs) * 100))
                    : null;

                return (
                    <div
                        key={divisi}
                        className={`${config.bg} ${config.border} border rounded-xl p-3 flex flex-col gap-1`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`${config.iconBg} p-1.5 rounded-lg`}>
                                    <Icon className={`w-4 h-4 ${config.text}`} />
                                </div>
                                <span className={`text-sm font-semibold ${config.text}`}>
                                    {config.label}
                                </span>
                            </div>
                            {/* Alert icons */}
                            <div className="flex gap-1">
                                {stat.bottleneck_count > 0 && (
                                    <span
                                        title={`${stat.bottleneck_count} bottleneck`}
                                        className="flex items-center gap-0.5 text-red-600 text-[10px] font-semibold"
                                    >
                                        <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                                        {stat.bottleneck_count}
                                    </span>
                                )}
                                {stat.overdue_count > 0 && (
                                    <span
                                        title={`${stat.overdue_count} overdue`}
                                        className="flex items-center gap-0.5 text-orange-600 text-[10px] font-semibold"
                                    >
                                        <ClockIcon className="w-3.5 h-3.5" />
                                        {stat.overdue_count}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-between items-end mt-1">
                            <div>
                                <div className="text-xl font-bold text-gray-800 leading-none">
                                    {stat.order_count ?? 0}
                                </div>
                                <div className="text-[10px] text-gray-500">order aktif</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-semibold text-gray-700">
                                    {(stat.total_pcs ?? 0).toLocaleString('id-ID')} pcs
                                </div>
                                {stat.target_pcs > 0 && (
                                    <div className="text-[10px] text-gray-500">
                                        target: {stat.target_pcs.toLocaleString('id-ID')} pcs/hari
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Progress bar (hanya jahit yang punya tracking output) */}
                        {pctProgress !== null && (
                            <div>
                                <ProgressBar
                                    value={stat.output_hari_ini}
                                    max={stat.target_pcs}
                                    colorClass={
                                        pctProgress >= 100 ? 'bg-green-500' :
                                        pctProgress >= 50  ? 'bg-yellow-400' :
                                                             'bg-red-400'
                                    }
                                />
                                <div className="text-[10px] text-gray-500 mt-0.5 text-right">
                                    {stat.output_hari_ini} / {stat.target_pcs} pcs hari ini ({pctProgress}%)
                                </div>
                            </div>
                        )}

                        {/* Threshold info */}
                        <div className="text-[10px] text-gray-400 mt-0.5">
                            Bottleneck jika &gt; {stat.threshold_hari} hari
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
