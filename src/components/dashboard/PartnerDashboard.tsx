
'use client';

import type { UserData, UserApplication } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ApplicationsTable } from './ApplicationsTable';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';

interface PartnerDashboardViewProps {
    user: UserData;
    applications: UserApplication[];
    isLoading: boolean;
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

export function PartnerDashboard({ user, applications, isLoading }: PartnerDashboardViewProps) {
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
            
            <Card>
                <CardHeader>
                    <CardTitle>Submitted Applications</CardTitle>
                    <CardDescription>A list of all applications you have submitted for clients.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <ApplicationsTableSkeleton /> : <ApplicationsTable applications={applications} />}
                </CardContent>
            </Card>
        </div>
    );
};
