
"use client";

import React, { useState, useTransition, useEffect } from 'react';
import type { UserApplication, PartnerData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminApplicationsTable } from './AdminApplicationsTable';
import { PendingPartnersTable } from './PendingPartnersTable';
import { approvePartner, updateApplicationStatus, getAllApplications, getPendingPartners, archiveApplicationAction } from '@/app/actions/adminActions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

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
  const [isPending, startTransition] = useTransition();
  const [processingState, setProcessingState] = useState<{ id: string; type: 'delete' | 'status' | 'approve' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
        try {
            const [apps, partners] = await Promise.all([
                getAllApplications(),
                getPendingPartners()
            ]);
            setApplications(apps);
            setPendingPartners(partners);
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

  const handleApprovePartner = (partnerId: string) => {
    startTransition(async () => {
        setProcessingState({ id: partnerId, type: 'approve' });
        const result = await approvePartner(partnerId);
        if (result.success) {
            toast({
                title: "Partner Approved",
                description: result.message,
            });
            // Optimistically update the UI
            setPendingPartners(currentPartners => currentPartners.filter(p => p.id !== partnerId));
        } else {
             toast({
                variant: "destructive",
                title: "Approval Failed",
                description: result.message,
            });
        }
        setProcessingState(null);
    });
  };

  const handleUpdateStatus = (applicationId: string, serviceCategory: UserApplication['serviceCategory'], newStatus: string) => {
    startTransition(async () => {
        setProcessingState({ id: applicationId, type: 'status' });
        const result = await updateApplicationStatus(applicationId, serviceCategory, newStatus);
        if (result.success) {
            toast({
                title: "Status Updated",
                description: result.message,
            });
            // Optimistically update the UI to reflect the change
            setApplications(currentApps => 
                currentApps.map(app => 
                    app.id === applicationId ? { ...app, status: newStatus } : app
                )
            );
        } else {
             toast({
                variant: "destructive",
                title: "Update Failed",
                description: result.message,
            });
        }
        setProcessingState(null);
    });
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
    <Tabs defaultValue="partners" className="space-y-4">
      <TabsList>
        <TabsTrigger value="partners">Pending Partners ({isLoading ? '...' : pendingPartners.length})</TabsTrigger>
        <TabsTrigger value="applications">All Applications ({isLoading ? '...' : applications.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="partners">
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
    </Tabs>
  );
}
