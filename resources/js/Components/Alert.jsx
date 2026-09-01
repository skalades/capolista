import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';

export default function Alert({ type = 'info', message, onClose }) {
    const types = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: CheckCircleIcon,
            iconColor: 'text-green-500',
            btnHover: 'hover:bg-green-100',
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: XCircleIcon,
            iconColor: 'text-red-500',
            btnHover: 'hover:bg-red-100',
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-800',
            icon: ExclamationTriangleIcon,
            iconColor: 'text-yellow-500',
            btnHover: 'hover:bg-yellow-100',
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: InformationCircleIcon,
            iconColor: 'text-blue-500',
            btnHover: 'hover:bg-blue-100',
        },
    };

    const config = types[type] || types.info;
    const Icon = config.icon;

    if (!message) return null;

    return (
        <div className={`rounded-lg border p-4 shadow-sm ${config.bg} ${config.border} animate-in fade-in slide-in-from-top-2 duration-300`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${config.iconColor}`} aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <p className={`text-sm font-medium ${config.text}`}>{message}</p>
                </div>
                {onClose && (
                    <div className="ml-auto pl-3">
                        <div className="-mx-1.5 -my-1.5">
                            <button
                                type="button"
                                onClick={onClose}
                                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${config.bg.split('-')[1]}-50 transition-colors ${config.bg} ${config.text} ${config.btnHover}`}
                            >
                                <span className="sr-only">Dismiss</span>
                                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
