export default function Card({ children, className = '', title, caption, actions, loading = false }) {
    return (
        <div className={`panel flex flex-col ${className}`}>
            {(title || caption || actions) && (
                <div className="px-4 py-3 border-b border-line flex items-center justify-between">
                    <h2 className="text-[15px] font-semibold font-oswald text-ink">{title}</h2>
                    <div className="flex items-center gap-3">
                        {caption && <span className="text-[11px] text-ink-soft font-sans">{caption}</span>}
                        {actions && <div>{actions}</div>}
                    </div>
                </div>
            )}
            <div className="p-4 flex-1">
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-line rounded w-3/4"></div>
                        <div className="h-4 bg-line rounded w-1/2"></div>
                        <div className="h-4 bg-line rounded w-5/6"></div>
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
}
