
"use client";

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApplicationsTable } from './ApplicationsTable';
import type { UserApplication, UserData } from '@/lib/types';
import { PartnerDashboard } from './PartnerDashboard';
import { getUserApplications } from '@/app/actions/dashboardActions';
import { getPartnerAnalytics } from '@/app/actions/partnerActions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { DashboardStats, type Stat } from './DashboardStats';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PartnerClientsView } from './PartnerClientsView';


interface DashboardClientProps {
  user: UserData;
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

export function DashboardClient({ user }: DashboardClientProps) {
    const [applications, setApplications] = useState<UserApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const router = useRouter();

    const defaultTab = searchParams.get('tab') || 'dashboard';

    const handleTabChange = (value: string) => {
        router.push(`/dashboard?tab=${value}`);
    };
    
    useEffect(() => {
        const fetchDashboardData = () => {
          startTransition(async () => {
            setIsLoading(true);
            try {
                let userApps: UserApplication[] = [];
                if (user.type === 'partner') {
                    const partnerData = await getPartnerAnalytics();
                    userApps = partnerData.applications;
                } else {
                    userApps = await getUserApplications();
                }
                setApplications(userApps);
            } catch (error) {
                console.error("Failed to load dashboard applications:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not load your applications."
                })
            } finally {
                setIsLoading(false);
            }
          });
        }

        fetchDashboardData();
    }, [toast, user.type]);
    
    const dashboardStats: Stat[] = useMemo(() => {
        const total = applications.length;
        const approved = applications.filter(app => app.status.toLowerCase() === 'approved').length;
        const inReview = applications.filter(app => app.status.toLowerCase() === 'in review' || app.status.toLowerCase() === 'submitted').length;
        const rejected = applications.filter(app => app.status.toLowerCase() === 'rejected').length;

        return [
            { label: 'Total Applications', value: total, type: 'total' },
            { label: 'Approved', value: approved, type: 'approved' },
            { label: 'In Review', value: inReview, type: 'inReview' },
            { label: 'Rejected', value: rejected, type: 'rejected' },
        ];
    }, [applications]);


  if (user.type === 'partner') {
    return (
        <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="space-y-4">
            <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="my_clients">My Clients</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
                 <PartnerDashboard user={user} applications={applications} isLoading={isLoading || isPending} stats={dashboardStats} />
            </TabsContent>
            <TabsContent value="my_clients">
                <PartnerClientsView />
            </TabsContent>
        </Tabs>
    );
  }

  // Fallback to the normal user dashboard
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {user.fullName}!</h1>
            <p className="text-muted-foreground">Here's a summary of your recent activity and applications.</p>
        </div>
         <Button asChild>
            <Link href="/#services">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Application
            </Link>
        </Button>
      </div>

      <DashboardStats stats={dashboardStats} isLoading={isLoading || isPending} />

      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>A list of all your submitted applications.</CardDescription>
        </CardHeader>
        <CardContent>
          {(isLoading || isPending) ? <ApplicationsTableSkeleton /> : <ApplicationsTable applications={applications} />}
        </CardContent>
      </Card>
    </div>
  );
}
