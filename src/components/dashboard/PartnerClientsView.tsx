
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getPartnerClients, type PartnerClient } from '@/app/actions/partnerActions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { UserX } from 'lucide-react';


const TableSkeleton = () => (
    <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
    </div>
);

export function PartnerClientsView() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [clients, setClients] = useState<PartnerClient[]>([]);

    useEffect(() => {
        const fetchClients = async () => {
            setIsLoading(true);
            try {
                const partnerClients = await getPartnerClients();
                setClients(partnerClients);
            } catch (error: any) {
                toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch client list. ' + error.message });
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, [toast]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Clients</CardTitle>
                <CardDescription>A list of all users who have registered under you.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <TableSkeleton /> : (
                    clients.length > 0 ? (
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
                                    {clients.map(client => (
                                        <TableRow key={client.id}>
                                            <TableCell className="font-medium">{client.userName || client.fullName}</TableCell>
                                            <TableCell className="hidden sm:table-cell">{client.userEmail || client.email}</TableCell>
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
