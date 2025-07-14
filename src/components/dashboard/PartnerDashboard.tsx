
'use client';

import type { UserData, UserApplication } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ApplicationsTable } from './ApplicationsTable';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';
import { DashboardStats, type Stat } from './DashboardStats';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';

interface PartnerDashboardViewProps {
    user: UserData;
    applications: UserApplication[];
    isLoading: boolean;
    stats: Stat[];
}

function ApplicationsTableSkeleton() {
  return (
    <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
    </div>
  );
}

export function PartnerDashboard({ user, applications, isLoading, stats }: PartnerDashboardViewProps) {
    if (!user.businessModel) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-destructive">Configuration Error</CardTitle>
                    <CardDescription>Business model not found for this partner account. Please contact support.</CardDescription>
                </CardHeader>
            </Card>
        );
    }
    
    const modelToTitle: Record<string, string> = {
        referral: 'Referral Partner Dashboard',
        dsa: 'DSA Partner Dashboard',
        merchant: 'Merchant Partner Dashboard',
    };
    const buttonText = user.businessModel === 'referral' ? "Start New Referral" : "New Client Application";
    const title = user.businessModel ? modelToTitle[user.businessModel] : "Partner Dashboard";

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                    <p className="text-muted-foreground">Welcome, {user.fullName}! Manage your partner activities here.</p>
                </div>
                 <Button asChild>
                    <Link href="/dashboard/new-application">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {buttonText}
                    </Link>
                </Button>
            </div>

            <DashboardStats stats={stats} isLoading={isLoading} />
            
             <div className="mt-8 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Performance Analytics</h2>
                    <p className="text-muted-foreground">A visual overview of your application activity.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnalyticsCharts applications={applications} isLoading={isLoading} />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Submitted Applications</CardTitle>
                    <CardDescription>A list of all applications you have submitted for clients.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <ApplicationsTableSkeleton /> : <ApplicationsTable applications={applications} isPartner={true} />}
                </CardContent>
            </Card>
        </div>
    );
};
