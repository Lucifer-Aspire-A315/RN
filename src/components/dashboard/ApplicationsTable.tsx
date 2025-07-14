
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { UserApplication } from '@/lib/types';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Edit, PlusCircle, FileText, MoreHorizontal, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { updateApplicationStatus, archiveApplicationAction } from '@/app/actions/adminActions';
import { useToast } from '@/hooks/use-toast';


interface ApplicationsTableProps {
  applications: UserApplication[];
  isPartner?: boolean;
}

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

const getCategoryDisplay = (category: UserApplication['serviceCategory']): string => {
    switch (category) {
        case 'loan': return 'Loan Application';
        case 'caService': return 'CA Service';
        case 'governmentScheme': return 'Government Scheme';
        default: return 'Application';
    }
}

const availableStatuses = ['Submitted', 'In Review', 'Approved', 'Rejected'];

export function ApplicationsTable({ applications, isPartner = false }: ApplicationsTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedApp, setSelectedApp] = useState<UserApplication | null>(null);

  const handleUpdateStatus = async (app: UserApplication, newStatus: string) => {
    setIsUpdating(app.id);
    const result = await updateApplicationStatus(app.id, app.serviceCategory, newStatus);
    if (result.success) {
        toast({ title: 'Status Updated', description: result.message });
        router.refresh(); // Refresh server components
    } else {
        toast({ variant: 'destructive', title: 'Update Failed', description: result.message });
    }
    setIsUpdating(null);
  };
  
  const confirmArchive = async () => {
    if (!selectedApp) return;
    setIsDeleting(selectedApp.id);
    setShowDeleteAlert(false);
    const result = await archiveApplicationAction(selectedApp.id, selectedApp.serviceCategory);
     if (result.success) {
        toast({ title: 'Application Archived', description: result.message });
        router.refresh();
    } else {
        toast({ variant: 'destructive', title: 'Archive Failed', description: result.message });
    }
    setIsDeleting(null);
    setSelectedApp(null);
  };

  const openDeleteDialog = (e: React.MouseEvent, app: UserApplication) => {
    e.stopPropagation();
    setSelectedApp(app);
    setShowDeleteAlert(true);
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 px-6 border-2 border-dashed rounded-lg bg-secondary/50">
        <div className="flex justify-center mb-4">
            <div className="bg-primary/10 text-primary rounded-full p-4">
                <FileText className="w-10 h-10" />
            </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground">No Applications Yet</h3>
        <p className="text-muted-foreground mt-2 mb-6">
          {isPartner 
            ? "You haven't submitted any applications for clients yet."
            : "You haven't submitted any applications yet. Let's get started!"}
        </p>
        <Button asChild>
          <Link href={isPartner ? "/dashboard/new-application" : "/#services"}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {isPartner ? "Submit New Application" : "Start New Application"}
          </Link>
        </Button>
      </div>
    );
  }

  const handleViewClick = (app: UserApplication) => {
    router.push(`/dashboard/application/${app.id}?category=${app.serviceCategory}`);
  };
  
  const handleEditClick = (e: React.MouseEvent, app: UserApplication) => {
    e.stopPropagation(); // Prevent row click event from firing
    router.push(`/dashboard/application/${app.id}/edit?category=${app.serviceCategory}`);
  };


  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Application Type</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Submitted On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id} onClick={() => handleViewClick(app)} className="cursor-pointer">
                <TableCell className="font-medium">
                  <div>{app.applicantDetails?.fullName || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground">{app.applicantDetails?.email || 'N/A'}</div>
                </TableCell>
                <TableCell>{app.applicationType}</TableCell>
                <TableCell className="hidden sm:table-cell">{getCategoryDisplay(app.serviceCategory)}</TableCell>
                <TableCell className="hidden md:table-cell">{format(new Date(app.createdAt), 'PP')}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(app.status)} className="capitalize">
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    <Button variant="ghost" size="icon" onClick={(e) => handleEditClick(e, app)} title="Edit Application">
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {isPartner && (
                      <>
                        <Button variant="ghost" size="icon" onClick={(e) => openDeleteDialog(e, app)} title="Delete Application" className="text-destructive hover:text-destructive" disabled={isDeleting === app.id}>
                           {isDeleting === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()} disabled={isUpdating === app.id}>
                              {isUpdating === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                            {availableStatuses.map(status => (
                              <DropdownMenuItem 
                                key={status} 
                                onClick={() => handleUpdateStatus(app, status)}
                                disabled={app.status === status}
                              >
                                {status}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
       <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently archive the application and delete all associated files. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmArchive} variant="destructive">
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
