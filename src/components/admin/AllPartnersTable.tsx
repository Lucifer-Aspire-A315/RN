
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { PartnerData } from '@/lib/types';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Handshake, Search } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import React from 'react';
import { Input } from '../ui/input';

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
  const [searchTerm, setSearchTerm] = React.useState('');

  const handlePartnerClick = (partnerId: string) => {
    router.push(`/admin/partner/${partnerId}`);
  };

  const filteredPartners = React.useMemo(() => {
    if (!searchTerm) return partners;
    return partners.filter(p => 
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [partners, searchTerm]);

  if (partners.length === 0) {
    return (
       <div className="text-center py-12 px-6 border-2 border-dashed rounded-lg bg-secondary/50">
        <div className="flex justify-center mb-4">
            <div className="bg-primary/10 text-primary rounded-full p-4">
                <Handshake className="w-10 h-10" />
            </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground">No Approved Partners</h3>
        <p className="text-muted-foreground mt-2 mb-6">There are no approved partners on the platform yet.</p>
        <Button asChild variant="outline">
          <Link href="/admin/dashboard?tab=pending_partners">View Pending Approvals</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search by partner name or email..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
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
            {filteredPartners.map((partner) => (
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
    </div>
  );
}
