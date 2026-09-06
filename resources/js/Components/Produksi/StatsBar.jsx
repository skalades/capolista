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
    },
    jahit: {
        label: 'Jahit',
        icon: WrenchScrewdriverIcon,
    },
    printing: {
        label: 'Printing',
        icon: PrinterIcon,
    },
    pemasangan: {
        label: 'Pemasangan',
        icon: SparklesIcon,
    },
};

function ProgressBar({ value, max, colorClass = 'bg-accent' }) {
    const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
    return (
        <div className="mt-2 w-full bg-line/50 rounded-full h-1.5 overflow-hidden">
            <div
                className={`${colorClass} h-full transition-all duration-500`}
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}

export default function StatsBar({ statsPerDivisi }) {
    const divisis = ['cutting', 'jahit', 'printing', 'pemasangan'];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {divisis.map((divisi) => {
                const stat   = statsPerDivisi?.[divisi] ?? {};
                const config = DIVISI_CONFIG[divisi];
                const Icon   = config.icon;

                const pctProgress = stat.target_pcs > 0 && stat.output_hari_ini != null
                    ? Math.min(100, Math.round((stat.output_hari_ini / stat.target_pcs) * 100))
                    : null;
                
                // Determine stitch color based on alerts
                const stitchClass = stat.bottleneck_count > 0 ? 'kpi-stitch-danger' : (stat.overdue_count > 0 ? 'kpi-stitch-gold' : 'kpi-stitch');

                return (
                    <div
                        key={divisi}
                        className={`panel kpi-stitch ${stitchClass} p-4 flex flex-col justify-between h-full`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="bg-line/20 p-1.5 rounded text-ink-soft">
                                    <Icon className="w-4 h-4" />
                                </div>
                                <span className="text-[12px] font-sans font-medium text-ink-soft uppercase tracking-wider">
                                    {config.label}
                                </span>
                            </div>
                            {/* Alert icons */}
                            <div className="flex gap-1.5">
                                {stat.bottleneck_count > 0 && (
                                    <span
                                        title={`${stat.bottleneck_count} bottleneck`}
                                        className="flex items-center gap-0.5 text-danger text-[11px] font-semibold"
                                    >
                                        <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                                        {stat.bottleneck_count}
                                    </span>
                                )}
                                {stat.overdue_count > 0 && (
                                    <span
                                        title={`${stat.overdue_count} overdue`}
                                        className="flex items-center gap-0.5 text-gold text-[11px] font-semibold"
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
                                <div className="text-[28px] font-bold font-oswald text-ink leading-none">
                                    {stat.order_count ?? 0}
                                </div>
                                <div className="text-[11px] text-ink-soft font-sans mt-1">order aktif</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[14px] font-semibold text-ink font-sans">
                                    {(stat.total_pcs ?? 0).toLocaleString('id-ID')} pcs
                                </div>
                                {stat.target_pcs > 0 && (
                                    <div className="text-[11px] text-ink-soft mt-0.5">
                                        target: {stat.target_pcs.toLocaleString('id-ID')}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Progress bar */}
                        {pctProgress !== null && (
                            <div className="mt-2">
                                <ProgressBar
                                    value={stat.output_hari_ini}
                                    max={stat.target_pcs}
                                    colorClass={
                                        pctProgress >= 100 ? 'bg-accent' :
                                        pctProgress >= 50  ? 'bg-gold' :
                                                             'bg-danger'
                                    }
                                />
                                <div className="text-[10px] text-ink-soft mt-1 text-right">
                                    {stat.output_hari_ini} / {stat.target_pcs} pcs ({pctProgress}%)
                                </div>
                            </div>
                        )}

                        {/* Threshold info */}
                        <div className="text-[10px] text-ink-soft/70 mt-2 border-t border-line/30 pt-2">
                            Bottleneck jika &gt; {stat.threshold_hari} hari
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
