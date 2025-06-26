
'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ArrowLeft, Loader2, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateApplicationStatus } from '@/app/actions/adminActions';
import { getApplicationDetails } from '@/app/actions/applicationActions';
import { useToast } from '@/hooks/use-toast';
import type { UserApplication } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '../ui/skeleton';

// Helper to check for visible content in nested objects
const hasVisibleContent = (value: any): boolean => {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  // Check if it's a plain object to recurse into
  if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date) && !(value instanceof File)) {
     if (Object.keys(value).length === 0) return false; // Handle empty objects {}
     return Object.values(value).some(hasVisibleContent);
  }
  // It's a primitive with a value or a File/Date object
  return true;
};

// Helper to format keys for display (e.g., 'fullName' -> 'Full Name')
const formatKey = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1') // insert a space before all caps
    .replace(/^./, (str) => str.toUpperCase()); // uppercase the first character
};

// Helper to render different value types
const renderValue = (value: any) => {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('data:'))) {
    const isFileLink = value.includes('firebasestorage.googleapis.com');
    const fileName = isFileLink ? decodeURIComponent(value.split('/').pop()?.split('?')[0] ?? 'Download').split('-').slice(1).join('-') : 'View Document';
    return (
      <Link
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline font-medium break-all flex items-center gap-1.5"
      >
        <FileText size={16} />
        <span>{fileName || "View Uploaded File"}</span>
      </Link>
    );
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      try {
          return format(new Date(value), 'PPp');
      } catch {
          return value;
      }
  }
  if (value && typeof value.seconds === 'number' && typeof value.nanoseconds === 'number') {
    try {
      const date = new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
      return format(date, 'PPp');
    } catch {
      return 'Invalid Date';
    }
  }

  if (value === null || value === undefined || value === '') {
    return <span className="text-muted-foreground">N/A</span>;
  }
  return String(value);
};

// Recursive component to render nested objects and values
const DetailItem = ({ itemKey, itemValue }: { itemKey: string; itemValue: any }) => {
  // A Firestore-like timestamp object should be treated as a value, not a section.
  const isTimestampObject = itemValue && typeof itemValue.seconds === 'number' && typeof itemValue.nanoseconds === 'number';

  // Section rendering (for nested objects that are not timestamps)
  if (typeof itemValue === 'object' && itemValue !== null && !Array.isArray(itemValue) && !(itemValue instanceof Date) && !(itemValue instanceof File) && !isTimestampObject) {
    // Hide entire section if it has no visible content
    if (!hasVisibleContent(itemValue)) {
        return null;
    }
    return (
      <div className="md:col-span-2">
        <h3 className="text-lg font-semibold text-primary mt-6 mb-4 border-b border-primary/20 pb-2">{formatKey(itemKey)}</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {Object.entries(itemValue)
            .filter(([, value]) => hasVisibleContent(value))
            .map(([key, value]) => (
            <DetailItem key={key} itemKey={key} itemValue={value} />
          ))}
        </dl>
      </div>
    );
  }

  // Simple key-value pair rendering
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

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
  switch (status?.toLowerCase()) {
    case 'submitted': return 'default';
    case 'in review': return 'secondary';
    case 'approved': return 'secondary'; // Consider a 'success' variant in the theme
    case 'rejected': return 'destructive';
    default: return 'default';
  }
};

const ApplicationDetailsSkeleton = () => (
    <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-muted/30">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-6 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="p-6 space-y-6">
            <div className="p-4 bg-background rounded-lg border space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-5 w-3/4" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-5 w-3/4" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-5 w-3/4" /></div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-5 w-3/4" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-5 w-3/4" /></div>
                <div className="md:col-span-2 space-y-4">
                    <Skeleton className="h-7 w-1/4 mt-4" />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-5 w-3/4" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-5 w-3/4" /></div>
                     </div>
                </div>
            </div>
        </CardContent>
    </Card>
);


export function ApplicationDetailsView({ applicationId, serviceCategory, title, subtitle, isAdmin = false }: ApplicationDetailsViewProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isUpdatingStatus, startUpdateTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);
    const [applicationData, setApplicationData] = useState<any | null>(null);

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
            const result = await updateApplicationStatus(
                applicationId, 
                applicationData.serviceCategory as UserApplication['serviceCategory'], 
                selectedStatus
            );
            if (result.success) {
                toast({
                    title: "Status Updated",
                    description: result.message,
                });
                setCurrentStatus(selectedStatus);
            } else {
                 toast({
                    variant: "destructive",
                    title: "Update Failed",
                    description: result.message,
                });
            }
        });
    };

    // Prepare data for rendering
    const {
      status,
      applicationType,
      formData,
      submittedBy,
      createdAt,
      updatedAt,
      ...restOfData
    } = applicationData;

    const displayData = { ...restOfData };
    if (formData) {
        Object.assign(displayData, formData);
    }
    
    delete displayData.id;
    delete displayData.partnerId;
    delete displayData.serviceCategory;
    delete displayData.schemeNameForDisplay;

    // Define the desired display order of sections. Keys are from various form schemas.
    const sectionOrder = [
        // Applicant/Personal Details
        'applicantDetails',
        'applicantDetailsGov',
        'applicantFounderDetails',
        'personalDetails',
        
        // Address Details
        'addressDetails',
        'addressInformationGov',

        // Business Details
        'businessDetails',
        'businessInformation',
        'businessInformationGov',
        'companyDetails',
        
        // Employment/Professional Details
        'employmentIncome',
        'professionalFinancial',

        // Loan/Service/Preferences Details
        'loanDetails',
        'loanPropertyDetails',
        'machineryLoanDetails',
        'creditCardPreferences',
        'loanDetailsGov',
        'gstServiceRequired',
        'incomeSourceType',
        'servicesRequired',
        'advisoryServicesRequired',
        'optionalServices',
        'businessScope',
        'directorsPartners',
        'currentFinancialOverview',

        // Existing Loans
        'existingLoans',

        // Documents
        'documentUploads',
        'documentUploadsGov',
        'dsaDocumentUploads',
        'merchantDocumentUploads',

        // Declaration
        'declaration'
    ];

    // Get all keys from the data and sort them according to the defined order.
    // Keys not in the order will be placed at the end.
    const sortedDataKeys = Object.keys(displayData).sort((a, b) => {
        const indexA = sectionOrder.indexOf(a);
        const indexB = sectionOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return 0; // Both not in order, keep original
        if (indexA === -1) return 1;  // a is not in order, move to end
        if (indexB === -1) return -1; // b is not in order, move to end
        return indexA - indexB;
    });

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-muted/30">
         <Button onClick={() => router.back()} variant="ghost" className="self-start -ml-4 mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
        </Button>
        <div className="pt-2">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        {isAdmin && (
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <h4 className="text-md font-semibold text-foreground mb-3">Admin Actions</h4>
                <div className="flex items-center space-x-4">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableStatuses.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleUpdateStatus} disabled={isUpdatingStatus || selectedStatus === currentStatus}>
                        {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Status
                    </Button>
                </div>
            </div>
        )}

        {/* Application Summary */}
        <div className="p-4 bg-background rounded-lg border">
            <h3 className="text-lg font-semibold text-primary mb-4">Application Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col space-y-1.5">
                    <dt className="text-sm font-medium text-muted-foreground">Application Type</dt>
                    <dd className="text-base text-foreground">{applicationData.schemeNameForDisplay || applicationType}</dd>
                </div>
                 <div className="flex flex-col space-y-1.5">
                    <dt className="text-sm font-medium text-muted-foreground">Service Category</dt>
                    <dd className="text-base text-foreground">{applicationData.serviceCategory}</dd>
                </div>
                 <div className="flex flex-col space-y-1.5">
                    <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                    <dd className="text-base text-foreground">
                        <Badge variant={getStatusVariant(currentStatus)} className="capitalize text-sm">{currentStatus}</Badge>
                    </dd>
                </div>
            </div>
        </div>

        {/* Render all other form data */}
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {sortedDataKeys.map((key) => (
                <DetailItem key={key} itemKey={key} itemValue={displayData[key]} />
            ))}
        </dl>
        
        {/* Submission Info Section at the bottom */}
        {(submittedBy || createdAt || updatedAt) && (
            <div className="mt-8 pt-6 border-t">
                <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-primary mb-4 border-b border-primary/20 pb-2">Submission Info</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {submittedBy && <DetailItem itemKey="Submitted By" itemValue={submittedBy} />}
                        {createdAt && <DetailItem itemKey="Created At" itemValue={createdAt} />}
                        {updatedAt && <DetailItem itemKey="Last Updated At" itemValue={updatedAt} />}
                    </dl>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
