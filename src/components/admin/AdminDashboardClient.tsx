
"use client";

import React, { useState, useTransition, useEffect, useMemo } from 'react';
import type { UserApplication, PartnerData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminApplicationsTable } from './AdminApplicationsTable';
import { PendingPartnersTable } from './PendingPartnersTable';
import { AllPartnersTable } from './AllPartnersTable';
import { approvePartner, updateApplicationStatus, getAllApplications, getPendingPartners, archiveApplicationAction, getAllPartners } from '@/app/actions/adminActions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { StatCard } from './StatCard';
import { AnalyticsCharts } from './AnalyticsCharts';
import { FolderKanban, Clock, UserPlus, Users } from 'lucide-react';

interface AdminDashboardClientProps {
    // No initial props needed, will fetch data itself
}

function TableSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
    )
}

export function AdminDashboardClient({}: AdminDashboardClientProps) {
  const [applications, setApplications] = useState<UserApplication[]>([]);
  const [pendingPartners, setPendingPartners] = useState<PartnerData[]>([]);
  const [allPartners, setAllPartners] = useState<PartnerData[]>([]);
  const [isPending, startTransition] = useTransition();
  const [processingState, setProcessingState] = useState<{ id: string; type: 'delete' | 'status' | 'approve' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
        try {
            const [apps, pending, all] = await Promise.all([
                getAllApplications(),
                getPendingPartners(),
                getAllPartners()
            ]);
            setApplications(apps);
            setPendingPartners(pending);
            setAllPartners(all);
        } catch (error) {
            console.error("Failed to fetch admin dashboard data:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load dashboard data."
            });
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [toast]);

  const analyticsData = useMemo(() => {
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(app => app.status === 'Submitted' || app.status === 'In Review').length;
    
    return {
        totalApplications,
        pendingApplications,
        pendingPartnerCount: pendingPartners.length,
        totalPartnerCount: allPartners.length,
    }
  }, [applications, pendingPartners, allPartners]);


  const handleApprovePartner = async (partnerId: string) => {
    setProcessingState({ id: partnerId, type: 'approve' });
    const result = await approvePartner(partnerId);
    if (result.success) {
        toast({
            title: "Partner Approved",
            description: result.message,
        });
        startTransition(() => {
            const approvedPartner = pendingPartners.find(p => p.id === partnerId);
            if(approvedPartner) {
                setAllPartners(currentPartners => 
                    [{ ...approvedPartner, isApproved: true }, ...currentPartners]
                    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                );
            }
            setPendingPartners(currentPartners => currentPartners.filter(p => p.id !== partnerId));
        });
    } else {
         toast({
            variant: "destructive",
            title: "Approval Failed",
            description: result.message,
        });
    }
    setProcessingState(null);
  };

  const handleUpdateStatus = async (applicationId: string, serviceCategory: UserApplication['serviceCategory'], newStatus: string) => {
    setProcessingState({ id: applicationId, type: 'status' });
    const result = await updateApplicationStatus(applicationId, serviceCategory, newStatus);
    if (result.success) {
        toast({
            title: "Status Updated",
            description: result.message,
        });
        startTransition(() => {
            setApplications(currentApps => 
                currentApps.map(app => 
                    app.id === applicationId ? { ...app, status: newStatus } : app
                )
            );
        });
    } else {
         toast({
            variant: "destructive",
            title: "Update Failed",
            description: result.message,
        });
    }
    setProcessingState(null);
  };

  const handleArchiveApplication = async (applicationId: string, serviceCategory: UserApplication['serviceCategory']) => {
    setProcessingState({ id: applicationId, type: 'delete' });
    const result = await archiveApplicationAction(applicationId, serviceCategory);
    if (result.success) {
        toast({
            title: "Application Archived",
            description: result.message,
        });
        startTransition(() => {
            setApplications(currentApps => currentApps.filter(app => app.id !== applicationId));
        });
    } else {
        toast({
            variant: "destructive",
            title: "Archive Failed",
            description: result.message,
        });
    }
    setProcessingState(null);
  };


  return (
    <>
      {/* Analytics Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Analytics Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
           <StatCard 
              title="Total Applications" 
              value={isLoading ? '...' : analyticsData.totalApplications}
              icon={FolderKanban}
              description="All applications across the platform"
           />
           <StatCard 
              title="Pending Applications" 
              value={isLoading ? '...' : analyticsData.pendingApplications}
              icon={Clock}
              description="Applications needing review"
            />
            <StatCard 
              title="Pending Partners" 
              value={isLoading ? '...' : analyticsData.pendingPartnerCount}
              icon={UserPlus}
              description="Partners awaiting approval"
            />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {isLoading ? (
                <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><Skeleton className="h-[250px] w-full" /></CardContent></Card>
            ) : (
                <AnalyticsCharts applications={applications} />
            )}
             <Card>
                <CardHeader>
                    <CardTitle>Partner Network</CardTitle>
                    <CardDescription>An overview of your partner ecosystem.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-secondary rounded-full">
                                <Users className="h-6 w-6 text-secondary-foreground" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Approved Partners</p>
                                <p className="text-2xl font-bold">{isLoading ? '...' : analyticsData.totalPartnerCount}</p>
                            </div>
                        </div>
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                             <div className="p-3 bg-secondary rounded-full">
                                <UserPlus className="h-6 w-6 text-secondary-foreground" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Pending Partner Approvals</p>
                                <p className="text-2xl font-bold">{isLoading ? '...' : analyticsData.pendingPartnerCount}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      <Tabs defaultValue="applications" className="space-y-4 mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applications">All Applications ({isLoading ? '...' : applications.length})</TabsTrigger>
          <TabsTrigger value="pending_partners">Pending Partners ({isLoading ? '...' : pendingPartners.length})</TabsTrigger>
          <TabsTrigger value="all_partners">All Partners ({isLoading ? '...' : allPartners.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>All Submitted Applications</CardTitle>
                <CardDescription>A list of all applications submitted across the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                  {isLoading ? (
                      <TableSkeleton />
                  ) : (
                      <AdminApplicationsTable 
                          applications={applications} 
                          onUpdateStatus={handleUpdateStatus}
                          onArchive={handleArchiveApplication}
                          processingState={processingState}
                      />
                  )}
              </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="pending_partners">
           <Card>
              <CardHeader>
                <CardTitle>Pending Partner Approvals</CardTitle>
                <CardDescription>Review and approve new partner registrations.</CardDescription>
              </CardHeader>
              <CardContent>
                  {isLoading ? (
                      <TableSkeleton />
                  ) : (
                      <PendingPartnersTable 
                          partners={pendingPartners}
                          onApprove={handleApprovePartner}
                          processingState={processingState}
                      />
                  )}
              </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="all_partners">
           <Card>
              <CardHeader>
                <CardTitle>All Approved Partners</CardTitle>
                <CardDescription>A list of all active partners on the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                  {isLoading ? (
                      <TableSkeleton />
                  ) : (
                      <AllPartnersTable partners={allPartners} />
                  )}
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
