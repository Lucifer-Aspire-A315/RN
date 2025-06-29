
'use client';

import { useMemo } from 'react';
import type { UserData, UserApplication } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Handshake, UserPlus, Store, PlusCircle, FolderKanban, Clock, CheckCircle2 } from 'lucide-react';
import { PartnerNewApplicationPortal } from './PartnerNewApplicationPortal';
import { ApplicationsTable } from './ApplicationsTable';
import { Skeleton } from '../ui/skeleton';
import { StatCard } from '../admin/StatCard';

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

const NewApplicationButton = ({ buttonText }: { buttonText: string }) => (
    <Dialog>
        <DialogTrigger asChild>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                {buttonText}
            </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>New Application Portal</DialogTitle>
                <DialogDescription>
                    Select a service below to start a new application for your client.
                </DialogDescription>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto -mx-6 px-6">
                 <PartnerNewApplicationPortal />
            </div>
        </DialogContent>
    </Dialog>
);


const DashboardContent = ({ user, applications, isLoading }: PartnerDashboardViewProps) => {
    const analyticsData = useMemo(() => {
        const totalApplications = applications.length;
        const pendingApplications = applications.filter(app => app.status === 'Submitted' || app.status === 'In Review').length;
        const approvedApplications = applications.filter(app => app.status === 'Approved').length;
        return { totalApplications, pendingApplications, approvedApplications };
    }, [applications]);

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
                <NewApplicationButton buttonText={buttonText} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard 
                    title="Total Submissions" 
                    value={isLoading ? '...' : analyticsData.totalApplications}
                    icon={FolderKanban}
                />
                <StatCard 
                    title="Pending Approval" 
                    value={isLoading ? '...' : analyticsData.pendingApplications}
                    icon={Clock}
                />
                <StatCard 
                    title="Approved Applications" 
                    value={isLoading ? '...' : analyticsData.approvedApplications}
                    icon={CheckCircle2}
                />
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
    
    return <DashboardContent user={user} applications={applications} isLoading={isLoading} />;
}
