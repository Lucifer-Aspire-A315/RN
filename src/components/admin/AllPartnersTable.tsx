
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { PartnerData } from '@/lib/types';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface AllPartnersTableProps {
  partners: PartnerData[];
}

const getBusinessModelDisplay = (model?: 'referral' | 'dsa' | 'merchant'): string => {
    switch(model) {
        case 'dsa': return 'DSA';
        case 'merchant': return 'Merchant';
        case 'referral': return 'Referral';
        default: return 'N/A';
    }
}

export function AllPartnersTable({ partners }: AllPartnersTableProps) {
  const router = useRouter();

  const handlePartnerClick = (partnerId: string) => {
    router.push(`/admin/partner/${partnerId}`);
  };

  if (partners.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium text-muted-foreground">No Approved Partners Found</h3>
        <p className="text-sm text-muted-foreground mt-1">There are no approved partners on the platform yet.</p>
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow 
              key={partner.id} 
              onClick={() => handlePartnerClick(partner.id)}
              className="cursor-pointer"
            >
              <TableCell className="font-medium">{partner.fullName}</TableCell>
              <TableCell>{partner.email}</TableCell>
              <TableCell className="hidden sm:table-cell">{partner.mobileNumber}</TableCell>
              <TableCell>
                  <Badge variant="secondary">{getBusinessModelDisplay(partner.businessModel)}</Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell">{format(new Date(partner.createdAt), 'PPp')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
