import React from 'react';

export default function ProgressBar({ target, selesai, reject }) {
    // Calculate percentages
    const percentSelesai = Math.min((selesai / target) * 100, 100);
    const percentReject = Math.min((reject / target) * 100, 100);

    return (
        <div className="w-full flex h-2.5 rounded-full overflow-hidden bg-gray-200">
            {percentReject > 0 && (
                <div 
                    style={{ width: `${percentReject}%` }} 
                    className="bg-red-700 flex-shrink-0" 
                    title={`${reject} reject`}
                />
            )}
            {percentSelesai > 0 && (
                <div 
                    style={{ width: `${percentSelesai}%` }} 
                    className={`${selesai > target ? 'bg-yellow-500' : 'bg-emerald-700'} flex-shrink-0`} 
                    title={`${selesai} selesai`}
                />
            )}
            {percentSelesai < 100 && (
                 <div 
                    style={{ width: `${100 - percentSelesai - percentReject}%` }} 
                    className="bg-stone-300 flex-shrink-0" 
                />
            )}
        </div>
    );
}
