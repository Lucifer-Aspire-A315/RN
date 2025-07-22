
"use client";

import React, { useState, useMemo } from 'react';
import type { AdminClientData } from '@/app/actions/adminActions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, UserX } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface AllClientsTableProps {
    clients: AdminClientData[];
}

export function AllClientsTable({ clients }: AllClientsTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const filteredClients = useMemo(() => {
        if (!searchTerm) return clients;
        return clients.filter(c => 
            c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.partnerName && c.partnerName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [clients, searchTerm]);
    
    if (clients.length === 0) {
        return (
             <div className="text-center py-12 px-6 border-2 border-dashed rounded-lg bg-secondary/50">
                <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 text-primary rounded-full p-4">
                        <UserX className="w-10 h-10" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground">No Clients Found</h3>
                <p className="text-muted-foreground mt-2">There are no registered clients on the platform yet.</p>
            </div>
        );
    }

    const handleRowClick = (clientId: string) => {
        router.push(`/admin/client/${clientId}`);
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by client name, email, or partner name..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client Name</TableHead>
                            <TableHead className="hidden sm:table-cell">Email</TableHead>
                            <TableHead>Associated Partner</TableHead>
                            <TableHead className="hidden lg:table-cell text-right">Registered On</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClients.map(client => (
                            <TableRow 
                                key={client.id}
                                onClick={() => handleRowClick(client.id)}
                                className="cursor-pointer"
                            >
                                <TableCell className="font-medium">{client.fullName}</TableCell>
                                <TableCell className="hidden sm:table-cell">{client.email}</TableCell>
                                <TableCell>
                                    {client.partnerName === 'Unassigned' ? (
                                        <Badge variant="outline">Unassigned</Badge>
                                    ) : (
                                        <Badge variant="secondary">{client.partnerName}</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell text-right">{format(new Date(client.createdAt), 'PP')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
