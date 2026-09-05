import React from 'react';

export default function SidePanel({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="flex-shrink-0 w-96 lg:w-[32rem] bg-gray-50 border-l border-gray-200 overflow-y-auto rounded-xl shadow-sm p-6 ml-6 relative">
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            {children}
        </div>
    );
}
