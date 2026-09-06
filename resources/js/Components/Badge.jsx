export default function Badge({ status = 'neutral', dot = true, children, className = '' }) {
    // Map abstract colors to our Semantic/Status tailwind classes
    const statusMap = {
        accent: 'badge-accent',
        teal: 'badge-accent',
        success: 'badge-accent',
        gold: 'badge-gold',
        warning: 'badge-gold',
        danger: 'badge-danger',
        error: 'badge-danger',
        neutral: 'badge-neutral',
        gray: 'badge-neutral'
    };

    const dotColors = {
        accent: 'bg-accent',
        teal: 'bg-accent',
        success: 'bg-accent',
        gold: 'bg-gold',
        warning: 'bg-gold',
        danger: 'bg-danger',
        error: 'bg-danger',
        neutral: 'bg-ink-soft',
        gray: 'bg-ink-soft'
    };

    const mappedStatus = statusMap[status] || 'badge-neutral';
    const mappedDot = dotColors[status] || 'bg-ink-soft';

    return (
        <span className={`badge ${mappedStatus} ${className}`}>
            {dot && (
                <span className={`h-1.5 w-1.5 rounded-full ${mappedDot}`} aria-hidden="true" />
            )}
            {children}
        </span>
    );
}
