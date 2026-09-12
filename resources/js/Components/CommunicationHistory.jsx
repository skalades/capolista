import React from 'react';

const TimelineItem = ({ division, person, message, timestamp, isActive, isLast }) => {
    return (
        <div className="relative pl-6 pb-4">
            {/* Garis vertikal penghubung (tidak dirender di item terakhir) */}
            {!isLast && (
                <div className="absolute top-3 left-[5px] bottom-[-10px] w-[2px] bg-gray-200"></div>
            )}
            
            {/* Titik / Dot Status */}
            <div 
                className={`absolute left-0 top-1.5 h-3 w-3 rounded-full border border-white shadow-sm z-10 ${
                    isActive ? 'bg-emerald-700' : 'bg-gray-400'
                }`}
            ></div>

            {/* Kotak Konten (Diberi border jika sedang aktif) */}
            <div 
                className={`py-2 px-3 rounded-sm -mt-1 ${
                    isActive ? 'border border-emerald-700 bg-white' : ''
                }`}
            >
                <div className="flex items-center gap-1 mb-1">
                    <span className={`font-semibold text-sm ${isActive ? 'text-emerald-800' : 'text-gray-700'}`}>
                        {division}
                    </span>
                    <span className={`text-sm ${isActive ? 'text-emerald-800 font-semibold' : 'text-gray-500'}`}>
                        - {person}
                    </span>
                </div>
                <p className="text-gray-800 text-sm mb-1.5 leading-relaxed">
                    {message}
                </p>
                <p className="text-gray-500 text-xs">
                    {timestamp}
                </p>
            </div>
        </div>
    );
};

export default function CommunicationHistory({ histories = [] }) {
    if (!histories || histories.length === 0) return null;

    return (
        <div className="w-full max-w-md bg-[#FAF9F6] p-6 rounded-lg">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">
                Riwayat Komunikasi Antar Divisi
            </h3>
            
            <div className="ml-2">
                {histories.map((history, index) => (
                    <TimelineItem
                        key={history.id || index}
                        division={history.division}
                        person={history.person}
                        message={history.message}
                        timestamp={history.timestamp}
                        isActive={history.isActive}
                        isLast={index === histories.length - 1}
                    />
                ))}
            </div>
        </div>
    );
}
