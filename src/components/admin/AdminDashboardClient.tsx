
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
import { AnalyticsCharts } from './AnalyticsCharts';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultTab = searchParams.get('tab') || 'applications';

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
  
  const filteredApplications = useMemo(() => {
    if (!searchTerm) return applications;
    return applications.filter(app => 
        app.applicantDetails?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantDetails?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [applications, searchTerm]);

  const pendingApplications = useMemo(() => {
    const appsToFilter = searchTerm ? filteredApplications : applications;
    return appsToFilter.filter(app => 
      app.status.toLowerCase() === 'submitted' || 
      app.status.toLowerCase() === 'in review'
    );
  }, [applications, filteredApplications, searchTerm]);

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
      <Tabs defaultValue={defaultTab} className="space-y-4" onValueChange={(value) => router.push(`/admin/dashboard?tab=${value}`)}>
        <div className="relative">
          <ScrollArea className="w-full whitespace-nowrap">
              <TabsList>
              <TabsTrigger value="applications">All Applications ({isLoading ? '...' : applications.length})</TabsTrigger>
              <TabsTrigger value="pending_applications">Pending Applications ({isLoading ? '...' : pendingApplications.length})</TabsTrigger>
              <TabsTrigger value="pending_partners">Pending Partners ({isLoading ? '...' : pendingPartners.length})</TabsTrigger>
              <TabsTrigger value="all_partners">All Partners ({isLoading ? '...' : allPartners.length})</TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>All Submitted Applications</CardTitle>
                <CardDescription>A list of all applications submitted across the platform.</CardDescription>
                <div className="relative pt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by name, email, or ID..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
              </CardHeader>
              <CardContent>
                  {isLoading ? (
                      <TableSkeleton />
                  ) : (
                      <AdminApplicationsTable 
                          applications={filteredApplications} 
                          onUpdateStatus={handleUpdateStatus}
                          onArchive={handleArchiveApplication}
                          processingState={processingState}
                      />
                  )}
              </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="pending_applications">
           <Card>
              <CardHeader>
                <CardTitle>Pending Applications</CardTitle>
                <CardDescription>Review and process applications that require action.</CardDescription>
                 <div className="relative pt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by name, email, or ID..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
              </CardHeader>
              <CardContent>
                  {isLoading ? (
                      <TableSkeleton />
                  ) : (
                      <AdminApplicationsTable 
                          applications={pendingApplications} 
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
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Platform Analytics</h2>
        <p className="text-muted-foreground mb-6">A visual overview of platform activity.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsCharts applications={applications} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
}
