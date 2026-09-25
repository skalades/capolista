import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function MobileStaffLayout({ children, title, headerSubtitle, headerLabel, activeTab, setActiveTab, tabs }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-stone-100 flex justify-center font-sans">
            <Head title={title} />

            {/* Mobile Container */}
            <div className="w-full max-w-md bg-stone-100 min-h-screen relative shadow-2xl flex flex-col">
                
                {/* Unified Dark Header */}
                <div className="bg-[#2C3E50] text-white p-6 rounded-b-3xl shadow-md relative z-10 shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-xl font-bold">{title}</h1>
                            {headerSubtitle && <p className="text-sm mt-1 text-gray-300">{headerSubtitle}</p>}
                        </div>
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button"
                            className="text-gray-300 hover:text-white p-1 rounded-full transition-colors flex items-center"
                        >
                            <ArrowRightOnRectangleIcon className="w-6 h-6" />
                        </Link>
                    </div>
                    {headerLabel && (
                        <div className="inline-flex mt-3 px-3 py-1 bg-[#1A252F] text-xs rounded-full items-center space-x-2 w-max">
                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                            <span>{headerLabel}</span>
                        </div>
                    )}
                </div>
                
                {/* Content Area */}
                <div className="flex-1 overflow-y-auto pb-24 px-4 pt-6">
                    {children}
                </div>

                {/* Bottom Navigation (Sticky) */}
                {tabs && tabs.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const Icon = isActive ? tab.activeIcon : tab.icon;
                            
                            const TabContent = (
                                <>
                                    <Icon className="w-6 h-6" />
                                    <span className="text-[10px] font-medium">{tab.label}</span>
                                </>
                            );

                            const className = `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? tab.activeColorClass : 'text-gray-400 hover:text-gray-600'}`;

                            return tab.href ? (
                                <Link key={tab.id} href={tab.href} className={className}>
                                    {TabContent}
                                </Link>
                            ) : (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={className}>
                                    {TabContent}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
