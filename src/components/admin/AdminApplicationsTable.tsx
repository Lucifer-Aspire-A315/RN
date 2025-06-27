
"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { UserApplication } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Loader2, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


interface AdminApplicationsTableProps {
  applications: UserApplication[];
  onUpdateStatus: (applicationId: string, serviceCategory: UserApplication['serviceCategory'], newStatus: string) => void;
  onArchive: (applicationId: string, serviceCategory: UserApplication['serviceCategory']) => void;
  isUpdating: boolean;
}

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
  switch (status.toLowerCase()) {
    case 'submitted':
      return 'default';
    case 'in review':
      return 'secondary';
    case 'approved':
      return 'secondary';
    case 'rejected':
      return 'destructive';
    default:
      return 'default';
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

export function AdminApplicationsTable({ applications, onUpdateStatus, onArchive, isUpdating }: AdminApplicationsTableProps) {
  const router = useRouter();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedAppForArchive, setSelectedAppForArchive] = useState<UserApplication | null>(null);

  const handleRowClick = (app: UserApplication) => {
    router.push(`/admin/application/${app.id}?category=${app.serviceCategory}`);
  };
  
  const handleEditClick = (app: UserApplication) => {
    router.push(`/admin/application/${app.id}/edit?category=${app.serviceCategory}`);
  };
  
  const openArchiveDialog = (app: UserApplication) => {
    setSelectedAppForArchive(app);
    setIsAlertOpen(true);
  };

  const confirmArchive = () => {
    if (selectedAppForArchive) {
      onArchive(selectedAppForArchive.id, selectedAppForArchive.serviceCategory);
    }
    setIsAlertOpen(false);
    setSelectedAppForArchive(null);
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium text-muted-foreground">No Applications Found</h3>
        <p className="text-sm text-muted-foreground mt-1">There are no applications submitted on the platform yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Application Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Submitted On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow 
                key={app.id} 
                className="cursor-pointer"
              >
                <TableCell className="font-medium" onClick={() => handleRowClick(app)}>
                  <div>{app.applicantDetails?.fullName || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground">{app.applicantDetails?.email || 'N/A'}</div>
                </TableCell>
                <TableCell onClick={() => handleRowClick(app)}>{app.applicationType}</TableCell>
                <TableCell onClick={() => handleRowClick(app)}>{getCategoryDisplay(app.serviceCategory)}</TableCell>
                <TableCell onClick={() => handleRowClick(app)}>{format(new Date(app.createdAt), 'PPp')}</TableCell>
                <TableCell onClick={() => handleRowClick(app)}>
                  <Badge variant={getStatusVariant(app.status)} className="capitalize">
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isUpdating}>
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRowClick(app)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => handleEditClick(app)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Application
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {availableStatuses.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => onUpdateStatus(app.id, app.serviceCategory, status)}
                          disabled={app.status.toLowerCase() === status.toLowerCase() || isUpdating}
                        >
                          Set as {status}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => openArchiveDialog(app)}>
                         <Trash2 className="mr-2 h-4 w-4" />
                         <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

       <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this application?</AlertDialogTitle>
            <AlertDialogDescription>
              This will archive the application record and permanently delete all associated documents from storage. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmArchive} className="bg-destructive hover:bg-destructive/90">
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Yes, Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
