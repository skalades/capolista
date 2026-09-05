import React from 'react';

export default function KanbanColumn({ title, count, color = 'gray', children }) {
    const colorClasses = {
        gray: 'border-gray-400 text-gray-700',
        blue: 'border-blue-500 text-blue-700',
        yellow: 'border-yellow-400 text-yellow-700',
        green: 'border-green-500 text-green-700',
        red: 'border-red-400 text-red-700',
        indigo: 'border-indigo-500 text-indigo-700',
    };

    const borderClass = colorClasses[color] || colorClasses.gray;

    return (
        <div className="flex-shrink-0 w-80 flex flex-col">
            <div className={`flex justify-between items-center mb-3 pb-2 border-b-4 border-dotted ${borderClass}`}>
                <h3 className="font-semibold text-sm">{title}</h3>
                <span className="text-sm font-medium">{count || 0}</span>
            </div>
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
