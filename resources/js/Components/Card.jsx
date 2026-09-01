export default function Card({ children, className = '', title, actions, loading = false }) {
    return (
        <div className={`bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden ${className}`}>
            {title && (
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">{title}</h3>
                    {actions && <div>{actions}</div>}
                </div>
            )}
            <div className={title ? "px-6 py-5" : "p-6"}>
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
}
