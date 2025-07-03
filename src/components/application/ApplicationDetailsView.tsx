

'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ArrowLeft, Loader2, FileText, Edit, Trash2, User, FileClock, Check, CircleX, Briefcase, Building, HandCoins, Info } from 'lucide-react';
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
  // Special handling for specific keys to make them more readable
  const keyMappings: { [key: string]: string } = {
    dob: "Date of Birth",
    pan: "PAN Number",
    aadhaar: "Aadhaar Number",
    pincode: "Pincode",
    isPermanentAddressSame: "Permanent Address Same as Current?",
    emiAmount: "EMI Amount",
    bankName: "Bank Name(s)",
    outstandingAmount: "Outstanding Amount",
    applicantDetailsGov: "Applicant Details",
    addressInformationGov: "Address Information",
    businessInformationGov: "Business Information",
    loanDetailsGov: "Loan Details",
    documentUploadsGov: "Document Uploads",
    currentInvestmentsTypes: "Current Investment Types",
  };

  if (keyMappings[key]) {
    return keyMappings[key];
  }

  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/Gov$/, ' (Govt. Scheme)')
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
  
  // Prevent rendering of objects by renderValue
  if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
    return null;
  }

  if (value === null || value === undefined || value === '') {
    return <span className="text-muted-foreground">N/A</span>;
  }
  return String(value);
};

// Recursive component to render key-value pairs, including nested objects.
const DetailItem = ({ itemKey, itemValue }: { itemKey: string; itemValue: any }) => {
    if (!hasVisibleContent(itemValue)) {
        return null;
    }
    
    // If the value is a non-array, non-special object, render its contents recursively.
    if (typeof itemValue === 'object' && !Array.isArray(itemValue) && !(itemValue instanceof Date) && itemValue !== null && !(itemValue instanceof File)) {
        return (
            <div className="md:col-span-2 space-y-4">
                <p className="font-semibold text-md text-foreground">{formatKey(itemKey)}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 border-l-2 pl-4 ml-1 border-primary/20">
                    {Object.entries(itemValue).map(([key, value]) => (
                        <DetailItem key={key} itemKey={key} itemValue={value} />
                    ))}
                </div>
            </div>
        );
    }
    
    // Original rendering for primitive values
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

const getCategoryIcon = (category: UserApplication['serviceCategory']) => {
    switch (category) {
        case 'loan': return <HandCoins className="w-12 h-12 text-primary" />;
        case 'caService': return <Briefcase className="w-12 h-12 text-primary" />;
        case 'governmentScheme': return <Building className="w-12 h-12 text-primary" />;
        default: return <Info className="w-12 h-12 text-primary" />;
    }
}

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

    // Prepare data for rendering by destructuring and cleaning it up.
    const { formData, submittedBy, createdAt, updatedAt } = applicationData;
    const applicationTypeInfo = applicationData.schemeNameForDisplay || applicationData.applicationType;

    // Isolate the applicant info, which can be under different keys inside formData
    const applicantInfoFromForm = formData.applicantDetails || formData.applicantDetailsGov || formData.applicantFounderDetails;
    
    // Get the display name, checking for `fullName` or `name` as a fallback.
    const applicantDisplayName = applicationData.applicantDetails?.fullName || applicantInfoFromForm?.fullName || applicantInfoFromForm?.name || 'N/A';
    
    // Create a new object for the rest of the form data to avoid mutating the original
    const otherFormData = {...formData};
    delete otherFormData.applicantDetails;
    delete otherFormData.applicantDetailsGov;
    delete otherFormData.applicantFounderDetails;


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
                         {getCategoryIcon(serviceCategory)}
                         <CardTitle className="text-xl">{applicationTypeInfo}</CardTitle>
                         <CardDescription>{applicationData.id}</CardDescription>
                         <Badge variant={getStatusVariant(currentStatus)} className="capitalize text-sm mt-2">{currentStatus}</Badge>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                         <div>
                            <p className="font-semibold text-foreground">Applicant:</p>
                            <p className="text-muted-foreground">{applicantDisplayName}</p>
                         </div>
                         <div>
                            <p className="font-semibold text-foreground">Submitted By:</p>
                            <p className="text-muted-foreground">{submittedBy?.userName || 'N/A'}</p>
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
                
                {/* Applicant & Submitter Info Card */}
                {(applicantInfoFromForm || submittedBy) && (
                     <Card className="shadow-sm">
                        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5"/> Applicant & Submitter Info</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-0">
                             {applicantInfoFromForm && Object.entries(applicantInfoFromForm).map(([key, value]) => (<DetailItem key={key} itemKey={key} itemValue={value} />))}
                             {submittedBy && Object.entries(submittedBy).map(([key, value]) => (<DetailItem key={`submitter_${key}`} itemKey={`Submitter ${formatKey(key)}`} itemValue={value} />))}
                        </CardContent>
                    </Card>
                )}
                
                {/* Dynamically created cards for other sections of the form */}
                {Object.entries(otherFormData).map(([sectionKey, sectionValue]) => {
                    if (typeof sectionValue === 'object' && sectionValue !== null && hasVisibleContent(sectionValue)) {
                        return (
                            <Card key={sectionKey} className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileClock className="w-5 h-5" />
                                        {formatKey(sectionKey)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-0">
                                    {Object.entries(sectionValue).map(([key, value]) => (
                                        <DetailItem key={key} itemKey={key} itemValue={value} />
                                    ))}
                                </CardContent>
                            </Card>
                        );
                    }
                    return null;
                })}
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
