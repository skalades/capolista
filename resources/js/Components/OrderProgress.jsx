import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

export default function OrderProgress({ currentStatus, statusLabels }) {
    // Array of all possible statuses in order
    const statuses = [
        'draft',
        'desain',
        'procurement',
        'cutting',
        'jahit',
        'produksi',
        'printing',
        'pemasangan',
        'packing',
        'dikirim',
        'selesai'
    ];

    const currentIndex = statuses.indexOf(currentStatus);

    return (
        <div className="py-8 sm:py-12 px-2">
            <h4 className="sr-only">Status Progress</h4>
            <div className="relative">
                {/* Background Line */}
                <div className="absolute top-3 sm:top-4 left-0 w-full h-1 bg-line -translate-y-1/2 z-0">
                    <div
                        className="h-full bg-navy transition-all duration-1000 ease-out"
                        style={{ width: `${currentIndex === -1 ? 0 : Math.max(0, (currentIndex / (statuses.length - 1)) * 100)}%` }}
                    />
                </div>
                
                <div className="flex justify-between items-center relative z-10 w-full">
                    {statuses.map((status, index) => {
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;
                        const isEven = index % 2 === 0;
                        
                        return (
                            <div key={status} className="flex flex-col items-center relative flex-1">
                                <div 
                                    className={`
                                        w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-medium z-10 transition-colors duration-500
                                        ${isCompleted 
                                            ? 'bg-navy text-white shadow-md shadow-navy/20' 
                                            : 'bg-panel border-2 border-line text-ink-soft'
                                        }
                                        ${isCurrent ? 'ring-4 ring-navy/20' : ''}
                                    `}
                                >
                                    {isCompleted && status !== 'selesai' && !isCurrent ? (
                                        <CheckIcon className="w-3 h-3 sm:w-5 sm:h-5" />
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                </div>
                                <span 
                                    className={`
                                        absolute text-[10px] sm:text-[10px] font-medium text-center w-14 sm:w-16 leading-tight
                                        ${isCurrent ? 'text-navy font-bold' : isCompleted ? 'text-ink' : 'text-ink-soft'}
                                        ${isEven ? 'top-8 sm:top-10' : 'bottom-8 sm:bottom-10'}
                                    `}
                                >
                                    {statusLabels && statusLabels[status] ? statusLabels[status] : (status.charAt(0).toUpperCase() + status.slice(1))}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
