import { Link } from '@inertiajs/react';

export default function Pagination({ links, from, to, total }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 bg-white border-t border-gray-100 sm:px-6">
            <div className="w-full sm:w-auto text-center sm:text-left">
                <p className="text-sm text-gray-700">
                    Menampilkan <span className="font-semibold text-gray-900">{from || 0}</span> - <span className="font-semibold text-gray-900">{to || 0}</span> dari <span className="font-semibold text-gray-900">{total || 0}</span> data
                </p>
            </div>
            <div className="w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    {links.map((link, index) => {
                        const isActive = link.active;
                        const isFirst = index === 0;
                        const isLast = index === links.length - 1;
                        let roundedClass = '';
                        if (isFirst) roundedClass = 'rounded-l-md';
                        if (isLast) roundedClass = 'rounded-r-md';

                        if (!link.url) {
                            return (
                                <span
                                    key={index}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-200 bg-gray-50 text-sm font-medium text-gray-400 ${roundedClass}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                ></span>
                            );
                        }

                        return (
                            <Link
                                key={index}
                                href={link.url}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'z-10 bg-brand-50 border-brand-500 text-brand-600'
                                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                } ${roundedClass}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
