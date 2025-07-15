
'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getPartnerClients, disassociateClientAction, type PartnerClient } from '@/app/actions/partnerActions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { UserX, Search, Trash2, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Button } from '../ui/button';

const TableSkeleton = () => (
    <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
    </div>
);

export function PartnerClientsView() {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, startDataTransition] = useTransition();
    const [isRemoving, startRemoveTransition] = useTransition();
    const [clients, setClients] = useState<PartnerClient[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [clientToDisassociate, setClientToDisassociate] = useState<PartnerClient | null>(null);

    React.useEffect(() => {
        const fetchClients = async () => {
            try {
                const partnerClients = await getPartnerClients();
                setClients(partnerClients);
            } catch (error: any) {
                toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch client list. ' + error.message });
            }
        };

        startDataTransition(() => {
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

    const handleDisassociate = async () => {
        if (!clientToDisassociate) return;

        startRemoveTransition(async () => {
            const result = await disassociateClientAction(clientToDisassociate.id);
            if (result.success) {
                toast({ title: "Client Disassociated", description: result.message });
                setClients(currentClients => currentClients.filter(c => c.id !== clientToDisassociate.id));
            } else {
                toast({ variant: 'destructive', title: 'Action Failed', description: result.message });
            }
            setClientToDisassociate(null);
        });
    };
    
    const handleRowClick = (clientId: string) => {
        router.push(`/dashboard/client/${clientId}`);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>My Clients</CardTitle>
                    <CardDescription>A list of all users who have registered under you. Click a row to view details.</CardDescription>
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
                                            <TableHead className="hidden md:table-cell text-right">Joined On</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
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
                                                <TableCell className="hidden md:table-cell text-right">{format(new Date(client.createdAt), 'PP')}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={(e) => { e.stopPropagation(); setClientToDisassociate(client); }}
                                                        disabled={isRemoving && clientToDisassociate?.id === client.id}
                                                    >
                                                        {isRemoving && clientToDisassociate?.id === client.id 
                                                            ? <Loader2 className="h-4 w-4 animate-spin" /> 
                                                            : <Trash2 className="h-4 w-4" />
                                                        }
                                                        <span className="sr-only">Disassociate Client</span>
                                                    </Button>
                                                </TableCell>
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

            <AlertDialog open={!!clientToDisassociate} onOpenChange={(open) => !open && setClientToDisassociate(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will disassociate <span className="font-bold">{clientToDisassociate?.fullName}</span> from your account. You will no longer manage their applications, but their account will not be deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setClientToDisassociate(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDisassociate} variant="destructive" disabled={isRemoving}>
                            {isRemoving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Disassociate'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
