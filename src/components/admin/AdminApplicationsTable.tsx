
"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { UserApplication } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Loader2, Eye, Edit, Trash2, Inbox } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


interface AdminApplicationsTableProps {
  applications: UserApplication[];
  onUpdateStatus: (applicationId: string, serviceCategory: UserApplication['serviceCategory'], newStatus: string) => void;
  onArchive: (applicationId: string, serviceCategory: UserApplication['serviceCategory']) => Promise<void>;
  processingState: { id: string; type: 'delete' | 'status' | 'approve' } | null;
}

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "success" => {
  switch (status.toLowerCase()) {
    case 'submitted': return 'default';
    case 'in review': return 'secondary';
    case 'approved': return 'success';
    case 'rejected': return 'destructive';
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

export function AdminApplicationsTable({ applications, onUpdateStatus, onArchive, processingState }: AdminApplicationsTableProps) {
  const router = useRouter();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedAppForArchive, setSelectedAppForArchive] = useState<UserApplication | null>(null);

  const handleViewClick = (app: UserApplication) => {
    router.push(`/admin/application/${app.id}?category=${app.serviceCategory}`);
  };
  
  const handleEditClick = (app: UserApplication) => {
    router.push(`/admin/application/${app.id}/edit?category=${app.serviceCategory}`);
  };
  
  const openArchiveDialog = (app: UserApplication) => {
    setSelectedAppForArchive(app);
    setIsAlertOpen(true);
  };

  const confirmArchive = async () => {
    if (selectedAppForArchive) {
      await onArchive(selectedAppForArchive.id, selectedAppForArchive.serviceCategory);
    }
    setIsAlertOpen(false);
    setSelectedAppForArchive(null);
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 px-6 border-2 border-dashed rounded-lg bg-secondary/50">
        <div className="flex justify-center mb-4">
            <div className="bg-primary/10 text-primary rounded-full p-4">
                <Inbox className="w-10 h-10" />
            </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground">No Applications Found</h3>
        <p className="text-muted-foreground mt-2">There are currently no applications in this view.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Application Type</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Submitted On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow 
                key={app.id}
              >
                <TableCell className="font-medium cursor-pointer" onClick={() => handleViewClick(app)}>
                  <div className="truncate w-32 md:w-auto">{app.applicantDetails?.fullName || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground truncate w-32 md:w-auto">{app.applicantDetails?.email || 'N/A'}</div>
                </TableCell>
                <TableCell className="cursor-pointer" onClick={() => handleViewClick(app)}>{app.applicationType}</TableCell>
                <TableCell className="hidden md:table-cell cursor-pointer" onClick={() => handleViewClick(app)}>{getCategoryDisplay(app.serviceCategory)}</TableCell>
                <TableCell className="hidden lg:table-cell cursor-pointer" onClick={() => handleViewClick(app)}>{format(new Date(app.createdAt), 'PPp')}</TableCell>
                <TableCell className="cursor-pointer" onClick={() => handleViewClick(app)}>
                  <Badge variant={getStatusVariant(app.status)} className="capitalize">
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 md:gap-2">
                     <Button variant="ghost" size="icon" onClick={() => handleViewClick(app)} title="View Application" disabled={!!processingState}>
                        <Eye className="h-4 w-4" />
                     </Button>
                     <Button variant="ghost" size="icon" onClick={() => handleEditClick(app)} title="Edit Application" disabled={!!processingState}>
                        <Edit className="h-4 w-4" />
                     </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => openArchiveDialog(app)} title="Delete Application" disabled={!!processingState}>
                        {processingState?.id === app.id && processingState?.type === 'delete' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                     </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={!!processingState}>
                            {processingState?.id === app.id && processingState?.type === 'status' ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                            <span className="sr-only">More actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuLabel>Set Status</DropdownMenuLabel>
                          {availableStatuses.map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => onUpdateStatus(app.id, app.serviceCategory, status)}
                              disabled={app.status.toLowerCase() === status.toLowerCase()}
                            >
                              {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </div>
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
            <AlertDialogAction onClick={confirmArchive} variant="destructive" disabled={!!processingState}>
              {processingState?.id === selectedAppForArchive?.id && processingState?.type === 'delete' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Yes, Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
