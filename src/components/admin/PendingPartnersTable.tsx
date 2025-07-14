
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, UserCheck } from 'lucide-react';
import type { PartnerData } from '@/lib/types';
import { format } from 'date-fns';

interface PendingPartnersTableProps {
  partners: PartnerData[];
  onApprove: (partnerId: string) => void;
  processingState: { id: string; type: 'delete' | 'status' | 'approve' } | null;
}

const getBusinessModelDisplay = (model?: 'referral' | 'dsa' | 'merchant'): string => {
    switch(model) {
        case 'dsa': return 'DSA';
        case 'merchant': return 'Merchant';
        case 'referral': return 'Referral';
        default: return 'N/A';
    }
}

export function PendingPartnersTable({ partners, onApprove, processingState }: PendingPartnersTableProps) {
  if (partners.length === 0) {
    return (
      <div className="text-center py-12 px-6 border-2 border-dashed rounded-lg bg-secondary/50">
        <div className="flex justify-center mb-4">
            <div className="bg-primary/10 text-primary rounded-full p-4">
                <UserCheck className="w-10 h-10" />
            </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground">No Pending Partners</h3>
        <p className="text-muted-foreground mt-2">There are no new partner registrations to approve at this time.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden sm:table-cell">Mobile</TableHead>
            <TableHead>Business Model</TableHead>
            <TableHead className="hidden lg:table-cell">Registered On</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell className="font-medium">{partner.fullName}</TableCell>
              <TableCell>{partner.email}</TableCell>
              <TableCell className="hidden sm:table-cell">{partner.mobileNumber}</TableCell>
              <TableCell>
                  <Badge variant="outline">{getBusinessModelDisplay(partner.businessModel)}</Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell">{format(new Date(partner.createdAt), 'PPp')}</TableCell>
              <TableCell className="text-right">
                <Button 
                    size="sm" 
                    onClick={() => onApprove(partner.id)} 
                    disabled={!!processingState}
                    variant="success"
                >
                  {processingState?.id === partner.id && processingState?.type === 'approve' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
