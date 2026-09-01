import { Link } from '@inertiajs/react';

export default function EmptyState({ title, description, action, icon: Icon }) {
    return (
        <div className="text-center py-16 px-4 sm:px-6 lg:px-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            {Icon && (
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 mb-4">
                    <Icon className="h-6 w-6 text-brand-600" aria-hidden="true" />
                </div>
            )}
            <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
            {description && (
                <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">{description}</p>
            )}
            {action && (
                <div className="mt-6">
                    {action.href ? (
                        <Link
                            href={action.href}
                            className="inline-flex items-center justify-center rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                        >
                            {action.label}
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={action.onClick}
                            className="inline-flex items-center justify-center rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                        >
                            {action.label}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
