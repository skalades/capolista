import React from 'react';
import Badge from '../Badge';

export default function KanbanCard({ order, imagePlaceholder, badgeText, badgeStatus = 'neutral', onClick }) {
    return (
        <div 
            onClick={onClick}
            className="panel p-4 cursor-pointer hover:border-accent hover:shadow-soft transition-all duration-200"
        >
            {imagePlaceholder && (
                <div className="bg-bg rounded h-24 w-full flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-line" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            )}
            
            <div className="font-mono text-[11.5px] text-ink-soft mb-1">{order.no_order}</div>
            <h4 className="font-semibold font-sans text-ink text-[13px] mb-1 line-clamp-1">{order.customer?.nama || 'Tanpa Customer'}</h4>
            <div className="text-[12px] text-ink-soft mb-3 line-clamp-1 font-sans">
                {order.jenis_produk} &bull; {order.jumlah} pcs
            </div>
            
            <div className="flex justify-between items-center mt-2 border-t border-line/50 pt-2">
                {badgeText ? (
                    <Badge status={badgeStatus} dot={false}>
                        {badgeText}
                    </Badge>
                ) : (
                    <div></div>
                )}
                
                <div className="text-[11px] text-ink-soft font-sans font-medium">
                    {new Date(order.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </div>
            </div>
        </div>
    );
}
