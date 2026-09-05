import React from 'react';

export default function KanbanCard({ order, imagePlaceholder, badgeText, badgeColor, onClick }) {
    const badgeColors = {
        gray: 'bg-gray-100 text-gray-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        green: 'bg-green-100 text-green-800',
    };
    
    return (
        <div 
            onClick={onClick}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all duration-200"
        >
            {imagePlaceholder && (
                <div className="bg-gray-100 rounded-md h-24 w-full flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            )}
            
            <div className="text-xs text-gray-500 mb-1">{order.no_order}</div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{order.customer?.nama || 'Tanpa Customer'}</h4>
            <div className="text-xs text-gray-600 mb-3 line-clamp-1">
                {order.jenis_produk} • {order.jumlah} pcs
            </div>
            
            <div className="flex justify-between items-center mt-2">
                {badgeText ? (
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${badgeColors[badgeColor] || badgeColors.gray}`}>
                        {badgeText}
                    </span>
                ) : (
                    <div></div>
                )}
                
                <div className="text-[10px] text-gray-500 font-medium">
                    {new Date(order.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </div>
            </div>
        </div>
    );
}
