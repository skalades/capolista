import React from 'react';

export default function ProgressBar({ target, selesai, reject }) {
    // Calculate percentages
    const percentSelesai = Math.min((selesai / target) * 100, 100);
    const percentReject = Math.min((reject / target) * 100, 100);

    return (
        <div className="w-full flex h-2 rounded-full overflow-hidden bg-line/40 border border-line/20 group-hover:h-3 hover:h-3 transition-all duration-200 cursor-help" title={`Selesai: ${selesai} | Reject: ${reject} | Sisa: ${Math.max(0, target - selesai - reject)}`}>
            {percentReject > 0 && (
                <div 
                    style={{ width: `${percentReject}%` }} 
                    className="bg-danger flex-shrink-0 hover:opacity-80 transition-opacity" 
                />
            )}
            {percentSelesai > 0 && (
                <div 
                    style={{ width: `${percentSelesai}%` }} 
                    className={`${selesai > target ? 'bg-gold' : 'bg-accent'} flex-shrink-0 hover:opacity-80 transition-opacity`} 
                />
            )}
            {percentSelesai < 100 && (
                 <div 
                    style={{ width: `${100 - percentSelesai - percentReject}%` }} 
                    className="bg-line/60 flex-shrink-0 hover:bg-line transition-colors" 
                />
            )}
        </div>
    );
}
