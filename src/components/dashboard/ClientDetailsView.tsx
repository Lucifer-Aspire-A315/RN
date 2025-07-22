
'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, ArrowLeft, Loader2, Trash2, Users } from 'lucide-react';
import { ApplicationsTable } from '@/components/dashboard/ApplicationsTable';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { UserApplication } from '@/lib/types';
import type { UserProfileData } from '@/app/actions/profileActions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { adminReassignClientAction } from '@/app/actions/adminActions';
import { Combobox } from '@/components/ui/combobox';
import Link from 'next/link';

interface ClientDetailsViewProps {
  client: UserProfileData | null;
  applications: UserApplication[];
  onDisassociate?: () => Promise<{ success: boolean; message: string }>;
  onPermanentDelete?: () => Promise<{ success: boolean; message: string }>;
  isPartnerView: boolean;
  partnersForReassignment?: { id: string; fullName: string }[];
}

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-4 p-4 rounded-lg bg-background border">
            <Icon className="w-5 h-5 text-muted-foreground mt-1" />
            <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="font-semibold text-foreground break-all">{value}</p>
            </div>
        </div>
    );
};


export function ClientDetailsView({ client, applications, onDisassociate, onPermanentDelete, isPartnerView, partnersForReassignment = [] }: ClientDetailsViewProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isProcessing, startTransition] = useTransition();
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [actionType, setActionType] = useState<'disassociate' | 'delete' | null>(null);
    const [isReassignDialogOpen, setIsReassignDialogOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState('');

    const getInitials = (name: string = '') => {
        const names = name.split(' ');
        if (names.length > 1 && names[0] && names[names.length - 1]) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name ? name.substring(0, 2).toUpperCase() : '??';
    };

    const handleActionConfirm = () => {
        startTransition(async () => {
            let result;
            if (actionType === 'disassociate' && onDisassociate) {
                result = await onDisassociate();
                 if (result.success) {
                    toast({ title: "Client Disassociated", description: result.message });
                    router.push('/dashboard?tab=my_clients');
                }
            } else if (actionType === 'delete' && onPermanentDelete) {
                 result = await onPermanentDelete();
                  if (result.success) {
                    toast({ title: "Client Deleted", description: result.message });
                    router.push('/admin/dashboard?tab=all_clients');
                }
            } else {
                result = { success: false, message: "No action defined."}
            }
            
            if (!result.success) {
                toast({ variant: "destructive", title: "Action Failed", description: result.message });
            }

            setIsAlertOpen(false);
            setActionType(null);
        });
    };

    const handleReassignConfirm = () => {
        if (!selectedPartner || !client) return;
        startTransition(async () => {
            const result = await adminReassignClientAction(client.id, selectedPartner);
            if (result.success) {
                toast({ title: 'Client Reassigned', description: result.message });
                router.refresh();
            } else {
                toast({ variant: 'destructive', title: 'Reassignment Failed', description: result.message });
            }
            setIsReassignDialogOpen(false);
            setSelectedPartner('');
        });
    }

    const openDialog = (type: 'disassociate' | 'delete') => {
        setActionType(type);
        setIsAlertOpen(true);
    }
    
    if (!client) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Client Not Found</CardTitle>
                    <CardDescription>The requested client could not be found.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const partnerOptions = partnersForReassignment.map(p => ({ label: p.fullName, value: p.id }));

    const alertConfig = {
        disassociate: {
            title: "Are you sure you want to disassociate this client?",
            description: "This will remove the client from your list. They will become an independent user and you will no longer be able to manage their applications. This action can be reversed if they re-select you as their partner."
        },
        delete: {
             title: "Are you sure you want to permanently delete this client?",
            description: "This action is irreversible. It will permanently delete the client's account and all of their associated applications and documents from the system."
        }
    }
    
    return (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <Button onClick={() => router.back()} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <div className="flex gap-2 w-full sm:w-auto">
                    {!isPartnerView && (
                        <Button asChild className="flex-grow sm:flex-grow-0">
                            <Link href="/dashboard/new-application">New Application</Link>
                        </Button>
                    )}
                    {isPartnerView && onDisassociate && (
                            <Button variant="destructive" onClick={() => openDialog('disassociate')} disabled={isProcessing} className="flex-grow sm:flex-grow-0">
                            {isProcessing && actionType === 'disassociate' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            Disassociate
                        </Button>
                    )}
                    {!isPartnerView && (
                        <>
                            <Button variant="outline" onClick={() => setIsReassignDialogOpen(true)} disabled={isProcessing} className="flex-grow sm:flex-grow-0">
                                <Users className="mr-2 h-4 w-4" /> Reassign
                            </Button>
                            {onPermanentDelete && (
                                <Button variant="destructive" onClick={() => openDialog('delete')} disabled={isProcessing} className="flex-grow sm:flex-grow-0">
                                    {isProcessing && actionType === 'delete' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                    Delete
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="lg:grid lg:grid-cols-3 lg:gap-6 items-start">
                <div className="lg:col-span-1 space-y-6 mb-6 lg:mb-0">
                    <Card className="shadow-lg">
                        <CardHeader className="items-center text-center pb-4">
                            <Avatar className="w-24 h-24 mb-4 border-4 border-primary">
                                <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${client.fullName}`} alt={client.fullName} />
                                <AvatarFallback className="text-3xl">{getInitials(client.fullName)}</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-2xl">{client.fullName}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           <InfoItem icon={Mail} label="Email Address" value={client.email} />
                           <InfoItem icon={Phone} label="Mobile Number" value={client.mobileNumber} />
                           <InfoItem icon={Calendar} label="Registered On" value={new Date(client.createdAt).toLocaleDateString()} />
                        </CardContent>
                    </Card>
                </div>
                
                <div className="lg:col-span-2">
                    <Card className="h-full flex flex-col shadow-lg">
                        <CardHeader>
                            <CardTitle>Client's Applications</CardTitle>
                            <CardDescription>A list of all applications submitted for or by this client.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow overflow-hidden">
                           <ScrollArea className="h-full max-h-[400px]">
                             <ApplicationsTable applications={applications} isPartner={isPartnerView} />
                           </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>{actionType ? alertConfig[actionType].title : ''}</AlertDialogTitle>
                    <AlertDialogDescription>{actionType ? alertConfig[actionType].description : ''}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleActionConfirm} variant="destructive" disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Yes, Confirm'}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <Dialog open={isReassignDialogOpen} onOpenChange={setIsReassignDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reassign Client to New Partner</DialogTitle>
                        <DialogDescription>
                            Select a new partner from the list to take ownership of this client.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Combobox
                            options={partnerOptions}
                            value={selectedPartner}
                            onChange={setSelectedPartner}
                            placeholder="Search and select a partner..."
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsReassignDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleReassignConfirm} disabled={!selectedPartner || isProcessing}>
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirm Reassignment'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

