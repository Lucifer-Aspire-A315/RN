
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { UserApplication } from '@/lib/types';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';

interface ApplicationsTableProps {
  applications: UserApplication[];
}

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "success" => {
  switch (status.toLowerCase()) {
    case 'submitted':
      return 'default';
    case 'in review':
      return 'secondary';
    case 'approved':
      return 'success';
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

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const router = useRouter();

  if (applications.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium text-muted-foreground">No Applications Found</h3>
        <p className="text-sm text-muted-foreground mt-1">You have not submitted any applications yet.</p>
      </div>
    );
  }

  const handleViewClick = (app: UserApplication) => {
    router.push(`/dashboard/application/${app.id}?category=${app.serviceCategory}`);
  };
  
  const handleEditClick = (app: UserApplication) => {
    router.push(`/dashboard/application/${app.id}/edit?category=${app.serviceCategory}`);
  };


  return (
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
            <TableRow key={app.id}>
              <TableCell className="font-medium cursor-pointer" onClick={() => handleViewClick(app)}>
                <div>{app.applicantDetails?.fullName || 'N/A'}</div>
                <div className="text-xs text-muted-foreground">{app.applicantDetails?.email || 'N/A'}</div>
              </TableCell>
              <TableCell className="cursor-pointer" onClick={() => handleViewClick(app)}>{app.applicationType}</TableCell>
              <TableCell className="cursor-pointer" onClick={() => handleViewClick(app)}>{getCategoryDisplay(app.serviceCategory)}</TableCell>
              <TableCell className="cursor-pointer" onClick={() => handleViewClick(app)}>{format(new Date(app.createdAt), 'PPp')}</TableCell>
              <TableCell className="cursor-pointer" onClick={() => handleViewClick(app)}>
                <Badge variant={getStatusVariant(app.status)} className="capitalize">
                  {app.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => handleEditClick(app)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
