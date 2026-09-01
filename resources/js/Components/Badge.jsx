export default function Badge({ color = 'gray', dot = false, size = 'md', children, className = '' }) {
    const colorClasses = {
        gray: 'bg-gray-100 text-gray-700 ring-gray-500/10',
        red: 'bg-red-50 text-red-700 ring-red-600/10',
        yellow: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
        green: 'bg-green-50 text-green-700 ring-green-600/20',
        blue: 'bg-blue-50 text-blue-700 ring-blue-700/10',
        indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-700/10',
        purple: 'bg-purple-50 text-purple-700 ring-purple-700/10',
        pink: 'bg-pink-50 text-pink-700 ring-pink-700/10',
        teal: 'bg-teal-50 text-teal-700 ring-teal-700/10',
        orange: 'bg-orange-50 text-orange-700 ring-orange-600/10',
    };
    
    const dotColors = {
        gray: 'fill-gray-500', red: 'fill-red-500', yellow: 'fill-yellow-500',
        green: 'fill-green-500', blue: 'fill-blue-500', indigo: 'fill-indigo-500',
        purple: 'fill-purple-500', pink: 'fill-pink-500', teal: 'fill-teal-500', orange: 'fill-orange-500',
    };

    const sizeClasses = {
        sm: 'px-1.5 py-0.5 text-xs',
        md: 'px-2 py-1 text-xs',
        lg: 'px-2.5 py-1 text-sm',
    };

    return (
        <span className={`inline-flex items-center rounded-md font-medium ring-1 ring-inset ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
            {dot && (
                <svg className={`mr-1.5 h-1.5 w-1.5 ${dotColors[color]}`} viewBox="0 0 6 6" aria-hidden="true">
                    <circle cx="3" cy="3" r="3" />
                </svg>
            )}
            {children}
        </span>
    );
}
