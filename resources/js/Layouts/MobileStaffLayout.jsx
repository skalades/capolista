import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function MobileStaffLayout({ children, title, activeTab, setActiveTab, tabs }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-200 flex justify-center font-sans">
            <Head title={title} />

            {/* Mobile Container */}
            <div className="w-full max-w-md bg-gray-50 min-h-screen relative shadow-2xl flex flex-col">
                
                {/* Top App Bar */}
                <div className="bg-white px-5 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                    <div>
                        <h1 className="font-bold text-gray-800 text-lg">CAPOLISTA</h1>
                        <p className="text-xs text-gray-500">{auth?.user?.name || 'Staf Produksi'}</p>
                    </div>
                    <Link 
                        href={route('logout')} 
                        method="post" 
                        as="button"
                        className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors flex items-center"
                    >
                        <ArrowRightOnRectangleIcon className="w-6 h-6" />
                    </Link>
                </div>
                
                {/* Content Area */}
                <div className="p-4 flex-1 overflow-y-auto pb-24">
                    {children}
                </div>

                {/* Bottom Navigation (Sticky) */}
                {tabs && tabs.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const Icon = isActive ? tab.activeIcon : tab.icon;
                            return (
                                <button 
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)} 
                                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? tab.activeColorClass : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <Icon className="w-6 h-6" />
                                    <span className="text-[10px] font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
