import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

export default function OrderProgress({ currentStatus, statusLabels }) {
    // Array of all possible statuses in order
    const statuses = [
        'draft',
        'desain',
        'procurement',
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
                <div className="absolute top-3 sm:top-4 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0">
                    <div
                        className="h-full bg-brand-500 transition-all duration-1000 ease-out"
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
                                            ? 'bg-brand-600 text-white shadow-md shadow-brand-200' 
                                            : 'bg-white border-2 border-gray-300 text-gray-400'
                                        }
                                        ${isCurrent ? 'ring-4 ring-brand-100' : ''}
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
                                        absolute text-[10px] sm:text-[11px] font-medium text-center w-16 sm:w-20 leading-tight
                                        ${isCurrent ? 'text-brand-700 font-bold' : isCompleted ? 'text-gray-800' : 'text-gray-400'}
                                        ${isEven ? 'top-8 sm:top-10' : 'bottom-8 sm:bottom-10'}
                                    `}
                                >
                                    {statusLabels[status] || status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
