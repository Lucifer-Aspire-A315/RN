'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { getPartnerDetails, getApplicationsByPartner, removePartnerAction } from '@/app/actions/adminActions';
import type { PartnerData, UserApplication } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Shield, BadgeCheck, Phone, Briefcase, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import { ApplicationsTable } from '@/components/dashboard/ApplicationsTable';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface PartnerDetailsViewProps {
  partnerId: string;
}

const PartnerProfileSkeleton = () => (
    <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="text-center">
            <Skeleton className="w-24 h-24 mx-auto mb-4 rounded-full" />
            <Skeleton className="h-8 w-1/2 mx-auto" />
            <Skeleton className="h-6 w-1/3 mx-auto mt-2" />
        </CardHeader>
        <CardContent className="mt-6 space-y-6">
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </CardContent>
    </Card>
);

export function PartnerDetailsView({ partnerId }: PartnerDetailsViewProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [partner, setPartner] = useState<PartnerData | null>(null);
    const [applications, setApplications] = useState<UserApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRemoving, startRemoveTransition] = useTransition();
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [partnerData, partnerApps] = await Promise.all([
                    getPartnerDetails(partnerId),
                    getApplicationsByPartner(partnerId)
                ]);
                
                if (partnerData) {
                    setPartner(partnerData);
                } else {
                     toast({ variant: "destructive", title: "Error", description: "Partner not found." });
                }
                setApplications(partnerApps);

            } catch (error: any) {
                toast({ variant: "destructive", title: "Error", description: error.message || "Failed to load partner data." });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [partnerId, toast]);

    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1 && names[0] && names[names.length - 1]) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    let partnerTypeDisplay: string;
    if (partner?.businessModel) {
        switch (partner.businessModel) {
            case 'dsa': partnerTypeDisplay = 'DSA Partner'; break;
            case 'merchant': partnerTypeDisplay = 'Merchant Partner'; break;
            case 'referral': partnerTypeDisplay = 'Referral Partner'; break;
            default: partnerTypeDisplay = 'Partner';
        }
    } else {
        partnerTypeDisplay = 'Partner';
    }

    const handleRemovePartner = () => {
        startRemoveTransition(async () => {
            const result = await removePartnerAction(partnerId);
            if (result.success) {
                toast({ title: "Partner Removed", description: result.message });
                router.push('/admin/dashboard');
            } else {
                toast({ variant: "destructive", title: "Removal Failed", description: result.message });
            }
            setIsAlertOpen(false);
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-8">
                <PartnerProfileSkeleton />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/3" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (!partner) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Partner Not Found</CardTitle>
                    <CardDescription>The requested partner could not be found.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.push('/admin/dashboard')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <div className="space-y-8">
            <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
                        <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${partner.fullName}`} alt={partner.fullName} />
                        <AvatarFallback className="text-3xl">{getInitials(partner.fullName)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-3xl">{partner.fullName}</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                        {partnerTypeDisplay} Profile
                    </CardDescription>
                </CardHeader>
                <CardContent className="mt-6 space-y-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-background">
                            <User className="w-6 h-6 text-primary" />
                            <div><p className="text-sm text-muted-foreground">Full Name</p><p className="font-medium text-foreground">{partner.fullName}</p></div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-background">
                            <Mail className="w-6 h-6 text-primary" />
                            <div><p className="text-sm text-muted-foreground">Email Address</p><p className="font-medium text-foreground">{partner.email}</p></div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-background">
                            <Phone className="w-6 h-6 text-primary" />
                            <div><p className="text-sm text-muted-foreground">Mobile</p><p className="font-medium text-foreground">{partner.mobileNumber}</p></div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-background">
                            <BadgeCheck className="w-6 h-6 text-primary" />
                            <div><p className="text-sm text-muted-foreground">Account Type</p><p className="font-medium text-foreground">{partnerTypeDisplay}</p></div>
                        </div>
                    </div>
                     <div className="border-t pt-6 flex justify-end">
                        <Button variant="destructive" onClick={() => setIsAlertOpen(true)} disabled={isRemoving}>
                            {isRemoving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            Remove Partner
                        </Button>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Applications Submitted by {partner.fullName}</CardTitle>
                    <CardDescription>A list of all applications submitted by this partner.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ApplicationsTable applications={applications} />
                </CardContent>
            </Card>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to remove this partner?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will permanently delete the partner's account. Their previously submitted applications will remain but they will no longer be able to log in. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemovePartner} className="bg-destructive hover:bg-destructive/90" disabled={isRemoving}>
                      {isRemoving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Yes, Remove Partner'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
        </div>
    );
}
