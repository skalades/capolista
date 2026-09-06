import { Link } from '@inertiajs/react';

export default function EmptyState({ title, description, action, icon: Icon }) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-10 px-4">
            {Icon && (
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-line/30 mb-3 text-ink-soft">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
            )}
            <h3 className="text-[14px] font-semibold text-ink font-sans">{title}</h3>
            {description && (
                <p className="mt-1 text-[12.5px] text-ink-soft font-sans max-w-sm mx-auto leading-relaxed">{description}</p>
            )}
            {action && (
                <div className="mt-5">
                    {action.href ? (
                        <Link
                            href={action.href}
                            className="inline-flex items-center justify-center rounded bg-navy px-3 py-1.5 text-[12.5px] font-medium text-white hover:bg-navy/90 transition-colors"
                        >
                            {action.label}
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={action.onClick}
                            className="inline-flex items-center justify-center rounded bg-navy px-3 py-1.5 text-[12.5px] font-medium text-white hover:bg-navy/90 transition-colors"
                        >
                            {action.label}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
