import { CheckIcon, ClockIcon, TruckIcon, DocumentTextIcon, PencilSquareIcon, CogIcon, PrinterIcon, WrenchScrewdriverIcon, ArchiveBoxIcon } from '@heroicons/react/20/solid';

// Format tanggal ke bahasa Indonesia tanpa library eksternal
function formatTanggal(dateStr) {
    if (!dateStr) return '-';
    try {
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        }).format(new Date(dateStr));
    } catch {
        return dateStr;
    }
}

const getStatusConfig = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('draft')) return { icon: DocumentTextIcon, bg: 'bg-gray-500' };
    if (s.includes('desain')) return { icon: PencilSquareIcon, bg: 'bg-blue-500' };
    if (s.includes('procurement')) return { icon: ArchiveBoxIcon, bg: 'bg-yellow-500' };
    if (s.includes('produksi')) return { icon: CogIcon, bg: 'bg-orange-500' };
    if (s.includes('printing')) return { icon: PrinterIcon, bg: 'bg-purple-500' };
    if (s.includes('pemasangan')) return { icon: WrenchScrewdriverIcon, bg: 'bg-pink-500' };
    if (s.includes('packing')) return { icon: ArchiveBoxIcon, bg: 'bg-teal-500' };
    if (s.includes('dikirim')) return { icon: TruckIcon, bg: 'bg-brand-500' };
    if (s.includes('selesai')) return { icon: CheckIcon, bg: 'bg-green-500' };
    
    return { icon: ClockIcon, bg: 'bg-gray-400' };
};

export default function StatusTimeline({ logs = [] }) {
    if (!logs || logs.length === 0) {
        return <p className="text-sm text-gray-500 italic">Belum ada riwayat status.</p>;
    }

    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">
                {logs.map((log, logIdx) => {
                    const config = getStatusConfig(log.status_baru);
                    const Icon = config.icon;
                    return (
                        <li key={log.id || logIdx}>
                            <div className="relative pb-8">
                                {logIdx !== logs.length - 1 ? (
                                    <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                ) : null}
                                <div className="relative flex space-x-3">
                                    <div>
                                        <span className={`h-8 w-8 rounded-full ${config.bg} flex items-center justify-center ring-8 ring-white`}>
                                            <Icon className="h-4 w-4 text-white" aria-hidden="true" />
                                        </span>
                                    </div>
                                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Status diubah menjadi{' '}
                                                <span className="font-medium text-gray-900">{log.status_baru}</span>
                                                {' oleh '}
                                                <span className="font-medium text-gray-900">{log.user?.name || 'Sistem'}</span>
                                            </p>
                                            {log.catatan && (
                                                <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200 shadow-sm">
                                                    {log.catatan}
                                                </p>
                                            )}
                                        </div>
                                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                            {formatTanggal(log.created_at)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
