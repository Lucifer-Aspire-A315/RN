
'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getPartnerClients, type PartnerClient } from '@/app/actions/partnerActions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { UserX, Search } from 'lucide-react';
import { Input } from '../ui/input';


const TableSkeleton = () => (
    <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
    </div>
);

export function PartnerClientsView() {
    const { toast } = useToast();
    const [isLoading, startTransition] = useTransition();
    const [clients, setClients] = useState<PartnerClient[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const partnerClients = await getPartnerClients();
                setClients(partnerClients);
            } catch (error: any) {
                toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch client list. ' + error.message });
            }
        };

        startTransition(() => {
            fetchClients();
        });
    }, [toast]);

    const filteredClients = useMemo(() => {
        if (!searchTerm) return clients;
        return clients.filter(c =>
            c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [clients, searchTerm]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Clients</CardTitle>
                <CardDescription>A list of all users who have registered under you.</CardDescription>
                <div className="relative pt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by client name or email..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? <TableSkeleton /> : (
                    filteredClients.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Client Name</TableHead>
                                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                                        <TableHead className="text-right">Joined On</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredClients.map(client => (
                                        <TableRow key={client.id}>
                                            <TableCell className="font-medium">{client.fullName}</TableCell>
                                            <TableCell className="hidden sm:table-cell">{client.email}</TableCell>
                                            <TableCell className="text-right">{format(new Date(client.createdAt), 'PP')}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-12 px-6 border-2 border-dashed rounded-lg bg-secondary/50">
                            <div className="flex justify-center mb-4">
                                <div className="bg-primary/10 text-primary rounded-full p-4">
                                    <UserX className="w-10 h-10" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">No Clients Found</h3>
                            <p className="text-muted-foreground mt-2">When users select you during sign-up, they will appear here.</p>
                        </div>
                    )
                )}
            </CardContent>
        </Card>
    );
}
