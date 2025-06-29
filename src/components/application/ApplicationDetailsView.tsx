

'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ArrowLeft, Loader2, FileText, Edit, Trash2, User, FileClock, Check, CircleX } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateApplicationStatus, archiveApplicationAction } from '@/app/actions/adminActions';
import { getApplicationDetails } from '@/app/actions/applicationActions';
import { useToast } from '@/hooks/use-toast';
import type { UserApplication } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '../ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


// Helper to check for visible content in nested objects
const hasVisibleContent = (value: any): boolean => {
  if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
    return false;
  }
  if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date) && !(value instanceof File)) {
     if (Object.keys(value).length === 0) return false;
     return Object.values(value).some(hasVisibleContent);
  }
  return true;
};

// Helper to format keys for display (e.g., 'fullName' -> 'Full Name')
const formatKey = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

// Helper to render different value types
const renderValue = (value: any) => {
  if (typeof value === 'boolean') {
    return value ? <Check className="text-success w-5 h-5" /> : <CircleX className="text-destructive w-5 h-5" />;
  }
  if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('data:'))) {
    const isFileLink = value.includes('firebasestorage.googleapis.com');
    const fileName = isFileLink ? decodeURIComponent(value.split('/').pop()?.split('?')[0] ?? 'Download').split('-').slice(2).join('-') : 'View Document';
    return (
      <Button asChild variant="outline" size="sm">
        <Link href={value} target="_blank" rel="noopener noreferrer" className="font-medium break-all">
            <FileText size={16} className="mr-2"/>
            <span>{fileName || "View Uploaded File"}</span>
        </Link>
      </Button>
    );
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      try { return format(new Date(value), 'PPp'); } catch { return value; }
  }
  if (value && typeof value.seconds === 'number' && typeof value.nanoseconds === 'number') {
    try {
      const date = new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
      return format(date, 'PPp');
    } catch { return 'Invalid Date'; }
  }

  if (value === null || value === undefined || value === '') {
    return <span className="text-muted-foreground">N/A</span>;
  }
  return String(value);
};

// Recursive component to render nested objects and values
const DetailItem = ({ itemKey, itemValue }: { itemKey: string; itemValue: any }) => {
  const isTimestampObject = itemValue && typeof itemValue.seconds === 'number' && typeof itemValue.nanoseconds === 'number';

  if (typeof itemValue === 'object' && itemValue !== null && !Array.isArray(itemValue) && !(itemValue instanceof Date) && !(itemValue instanceof File) && !isTimestampObject) {
    if (!hasVisibleContent(itemValue)) return null;
    return (
      <Card className="col-span-1 md:col-span-2 shadow-sm">
        <CardHeader><CardTitle className="text-lg">{formatKey(itemKey)}</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-0">
          {Object.entries(itemValue).map(([key, value]) => (
            <DetailItem key={key} itemKey={key} itemValue={value} />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col space-y-1.5">
      <dt className="text-sm font-medium text-muted-foreground">{formatKey(itemKey)}</dt>
      <dd className="text-base text-foreground break-words">{renderValue(itemValue)}</dd>
    </div>
  );
};

interface ApplicationDetailsViewProps {
  applicationId: string;
  serviceCategory: UserApplication['serviceCategory'];
  title: string;
  subtitle: string;
  isAdmin: boolean;
}

const availableStatuses = ['Submitted', 'In Review', 'Approved', 'Rejected'];

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "success" => {
  switch (status?.toLowerCase()) {
    case 'submitted': return 'default';
    case 'in review': return 'secondary';
    case 'approved': return 'success';
    case 'rejected': return 'destructive';
    case 'archived': return 'destructive';
    default: return 'default';
  }
};

const ApplicationDetailsSkeleton = () => (
    <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-5 w-1/2" /></CardContent></Card>
             <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
            <Card><CardHeader><Skeleton className="h-7 w-1/4" /></CardHeader><CardContent className="grid md:grid-cols-2 gap-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></CardContent></Card>
             <Card><CardHeader><Skeleton className="h-7 w-1/4" /></CardHeader><CardContent className="grid md:grid-cols-2 gap-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></CardContent></Card>
        </div>
    </div>
);


export function ApplicationDetailsView({ applicationId, serviceCategory, title, subtitle, isAdmin = false }: ApplicationDetailsViewProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isUpdating, startUpdateTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);
    const [applicationData, setApplicationData] = useState<any | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const [currentStatus, setCurrentStatus] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const data = await getApplicationDetails(applicationId, serviceCategory);
                setApplicationData(data);
                if (data) {
                    setCurrentStatus(data.status);
                    setSelectedStatus(data.status);
                }
            } catch (error: any) {
                toast({ variant: "destructive", title: "Error", description: error.message });
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [applicationId, serviceCategory, toast]);

    if (isLoading) {
        return <ApplicationDetailsSkeleton />;
    }

    if (!applicationData) {
        return (
             <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Application Not Found</CardTitle>
                    <CardDescription>The requested application could not be found or you don't have permission to view it.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const handleUpdateStatus = () => {
        if (!selectedStatus || selectedStatus === currentStatus) return;

        startUpdateTransition(async () => {
            const result = await updateApplicationStatus(applicationId, serviceCategory, selectedStatus);
            if (result.success) {
                toast({ title: "Status Updated", description: result.message });
                setCurrentStatus(selectedStatus);
            } else {
                 toast({ variant: "destructive", title: "Update Failed", description: result.message });
            }
        });
    };
    
    const confirmArchive = () => {
        startUpdateTransition(async () => {
            const result = await archiveApplicationAction(applicationId, serviceCategory as UserApplication['serviceCategory']);
            if (result.success) {
                toast({ title: "Application Archived", description: result.message });
                router.push(isAdmin ? '/admin/dashboard' : '/dashboard');
            } else {
                toast({ variant: "destructive", title: "Archive Failed", description: result.message });
            }
        });
        setIsAlertOpen(false);
    };

    // Prepare data for rendering
    const { status, applicationType, formData, submittedBy, createdAt, updatedAt, ...restOfData } = applicationData;

    const displayData = { ...restOfData, ...formData };
    
    delete displayData.id;
    delete displayData.partnerId;
    delete displayData.serviceCategory;
    delete displayData.schemeNameForDisplay;

    const applicantInfo = displayData.applicantDetails || displayData.applicantDetailsGov || displayData.applicantFounderDetails;
    const submitterInfo = submittedBy;
    const applicationTypeInfo = applicationData.schemeNameForDisplay || applicationType;
    
    delete displayData.applicantDetails;
    delete displayData.applicantDetailsGov;
    delete displayData.applicantFounderDetails;
    

  return (
    <>
        <div className="flex items-center justify-between mb-6">
            <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
            <div className="flex items-center gap-2">
                 {isAdmin ? (
                    <>
                        <Button asChild variant="outline">
                            <Link href={`/admin/application/${applicationId}/edit?category=${serviceCategory}`}><Edit className="mr-2 h-4 w-4" /> Edit</Link>
                        </Button>
                         <Button variant="destructive" onClick={() => setIsAlertOpen(true)} disabled={isUpdating}>
                            {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />} Delete
                        </Button>
                    </>
                ) : (
                    <Button asChild variant="outline">
                        <Link href={`/dashboard/application/${applicationId}/edit?category=${serviceCategory}`}><Edit className="mr-2 h-4 w-4" /> Edit Application</Link>
                    </Button>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column - Summary & Actions */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
                <Card className="shadow-lg">
                    <CardHeader className="text-center items-center">
                         <FileClock className="w-12 h-12 text-primary" />
                         <CardTitle className="text-xl">{applicationTypeInfo}</CardTitle>
                         <CardDescription>{applicationData.id}</CardDescription>
                         <Badge variant={getStatusVariant(currentStatus)} className="capitalize text-sm mt-2">{currentStatus}</Badge>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                         <div>
                            <p className="font-semibold text-foreground">Applicant:</p>
                            <p className="text-muted-foreground">{applicantInfo?.fullName || 'N/A'}</p>
                         </div>
                         <div>
                            <p className="font-semibold text-foreground">Submitted By:</p>
                            <p className="text-muted-foreground">{submitterInfo?.userName || 'N/A'}</p>
                         </div>
                         <div>
                            <p className="font-semibold text-foreground">Created On:</p>
                            <p className="text-muted-foreground">{renderValue(createdAt)}</p>
                         </div>
                         {updatedAt && createdAt !== updatedAt && (
                          <div>
                            <p className="font-semibold text-foreground">Last Updated:</p>
                            <p className="text-muted-foreground">{renderValue(updatedAt)}</p>
                          </div>
                         )}
                    </CardContent>
                </Card>
                 {isAdmin && (
                    <Card className="shadow-lg">
                        <CardHeader><CardTitle>Admin Actions</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger>
                                <SelectContent>
                                    {availableStatuses.map(status => (<SelectItem key={status} value={status}>{status}</SelectItem>))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleUpdateStatus} disabled={isUpdating || selectedStatus === currentStatus} className="w-full">
                                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update Status
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-sm">
                    <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5"/> Applicant & Submitter Info</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-0">
                         {applicantInfo && Object.entries(applicantInfo).map(([key, value]) => (<DetailItem key={key} itemKey={key} itemValue={value} />))}
                         {submitterInfo && Object.entries(submitterInfo).map(([key, value]) => (<DetailItem key={key} itemKey={`Submitter ${key}`} itemValue={value} />))}
                    </CardContent>
                </Card>
                
                {Object.entries(displayData).map(([key, value]) => (
                    hasVisibleContent(value) && <DetailItem key={key} itemKey={key} itemValue={value} />
                ))}
            </div>
        </div>

        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this application?</AlertDialogTitle>
                    <AlertDialogDescription>This will archive the application record and permanently delete all associated documents from storage. This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmArchive} variant="destructive">
                        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Yes, Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
