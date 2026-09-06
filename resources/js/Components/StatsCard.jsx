import Card from './Card';
import { Link } from '@inertiajs/react';

export default function StatsCard({ title, value, caption, status = 'accent', actionLink, actionLabel }) {
    const stitchClasses = {
        accent: 'kpi-stitch-accent',
        teal: 'kpi-stitch-accent',
        gold: 'kpi-stitch-gold',
        warning: 'kpi-stitch-gold',
        danger: 'kpi-stitch-danger',
        error: 'kpi-stitch-danger',
        neutral: 'kpi-stitch',
    };

    const activeStitch = stitchClasses[status] || 'kpi-stitch';

    return (
        <div className={`panel kpi-stitch ${activeStitch} p-4 flex flex-col justify-between h-full`}>
            <div>
                <p className="text-[11px] text-ink-soft font-sans uppercase tracking-wider">{title}</p>
                <p className="text-[28px] sm:text-[32px] font-oswald font-semibold text-ink mt-1 leading-tight">{value}</p>
                
                {caption && (
                    <p className="mt-1 text-[11px] text-ink-soft font-sans">{caption}</p>
                )}
            </div>
            
            {actionLink && actionLabel && (
                <div className="mt-4 pt-3 border-t border-line/50">
                    <Link href={actionLink} className="text-[11.5px] font-medium text-navy hover:text-accent flex items-center gap-1 transition-colors">
                        {actionLabel}
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            )}
        </div>
    );
}
