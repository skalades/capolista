import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import StatsCard from '@/Components/StatsCard';
import Card from '@/Components/Card';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, totalUsers, activeUsers, totalRoles, totalDivisi }) {
    return (
        <AppLayout title="Superadmin Dashboard">
            <div className="max-w-7xl mx-auto space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatsCard 
                        title="Total User" 
                        value={totalUsers} 
                        status="neutral" 
                    />
                    <StatsCard 
                        title="User Aktif" 
                        value={activeUsers} 
                        status="accent" 
                    />
                    <StatsCard 
                        title="Total Role" 
                        value={totalRoles} 
                        status="neutral" 
                    />
                    <StatsCard 
                        title="Total Divisi" 
                        value={totalDivisi} 
                        status="gold" 
                    />
                </div>

                <Card>
                    <h3 className="text-[18px] font-oswald font-bold text-ink mb-4">Quick Links</h3>
                    <div className="flex flex-wrap gap-3">
                        <PrimaryButton asChild>
                            <Link href={route('superadmin.roles')}>
                                Kelola Roles
                            </Link>
                        </PrimaryButton>
                        <SecondaryButton asChild>
                            <Link href={route('superadmin.sistem')}>
                                Informasi Sistem
                            </Link>
                        </SecondaryButton>
                        <SecondaryButton asChild>
                            <Link href={route('superadmin.settings')}>
                                Pengaturan Sistem
                            </Link>
                        </SecondaryButton>
                    </div>
                </Card>

            </div>
        </AppLayout>
    );
}
