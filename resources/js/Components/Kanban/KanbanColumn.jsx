import React from 'react';

export default function KanbanColumn({ title, count, children }) {
    return (
        <div className="flex-shrink-0 w-80 flex flex-col h-full bg-panel/30 border-r border-line/50 p-2">
            <div className="flex justify-between items-center mb-3 p-2 border-b border-line">
                <h3 className="font-semibold font-oswald text-[15px] text-ink">{title}</h3>
                <span className="text-[12px] font-medium text-ink-soft bg-line/20 px-2 py-0.5 rounded-full">{count || 0}</span>
            </div>
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto px-1 scrollbar-hide pb-10">
                {children}
            </div>
        </div>
    );
}
