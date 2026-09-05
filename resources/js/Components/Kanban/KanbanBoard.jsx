import React from 'react';

export default function KanbanBoard({ children }) {
    return (
        <div className="flex h-full min-h-[500px] gap-6 overflow-x-auto pb-4">
            {children}
        </div>
    );
}
