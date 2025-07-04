
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { getPartnerDetails, getApplicationsByPartner, removePartnerAction } from '@/app/actions/adminActions';
import type { PartnerData, UserApplication } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Shield, BadgeCheck, Phone, Briefcase, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import { ApplicationsTable } from '@/components/dashboard/ApplicationsTable';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PartnerDetailsViewProps {
  partnerId: string;
}

const PartnerProfileSkeleton = () => (
    <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
            <Card className="shadow-lg">
                <CardHeader className="items-center text-center">
                    <Skeleton className="w-24 h-24 rounded-full mb-4" />
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-5 w-24 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-10 w-full mt-4" />
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
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
    </div>
);

const PartnerInfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-background border">
        <Icon className="w-5 h-5 text-muted-foreground mt-1" />
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="font-semibold text-foreground break-all">{value}</p>
        </div>
    </div>
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
                toast({ title: "Partner Deactivated", description: result.message });
                router.push('/admin/dashboard');
            } else {
                toast({ variant: "destructive", title: "Deactivation Failed", description: result.message });
            }
            setIsAlertOpen(false);
        });
    };

    if (isLoading) {
        return <PartnerProfileSkeleton />;
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
        <>
            <div className="flex items-center justify-between gap-4 mb-6">
                <Button onClick={() => router.back()} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                 <Button variant="destructive" onClick={() => setIsAlertOpen(true)} disabled={isRemoving}>
                    {isRemoving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Deactivate
                </Button>
            </div>
            <div className="lg:grid lg:grid-cols-3 lg:gap-6 items-start">
                <div className="lg:col-span-1 space-y-6 mb-6 lg:mb-0">
                    <Card className="shadow-lg">
                        <CardHeader className="items-center text-center pb-4">
                            <Avatar className="w-24 h-24 mb-4 border-4 border-primary">
                                <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${partner.fullName}`} alt={partner.fullName} />
                                <AvatarFallback className="text-3xl">{getInitials(partner.fullName)}</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-2xl">{partner.fullName}</CardTitle>
                            <CardDescription className="text-base text-muted-foreground">
                                <Badge variant="secondary" className="mt-1">{partnerTypeDisplay}</Badge>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           <PartnerInfoItem icon={Mail} label="Email Address" value={partner.email} />
                           <PartnerInfoItem icon={Phone} label="Mobile Number" value={partner.mobileNumber} />
                           <PartnerInfoItem icon={Briefcase} label="Business Model" value={partnerTypeDisplay} />
                        </CardContent>
                    </Card>
                </div>
                
                <div className="lg:col-span-2">
                    <Card className="h-[450px] flex flex-col shadow-lg">
                        <CardHeader>
                            <CardTitle>Applications Submitted by {partner.fullName}</CardTitle>
                            <CardDescription>A list of all applications submitted by this partner.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow overflow-hidden">
                           <ScrollArea className="h-full">
                             <ApplicationsTable applications={applications} />
                           </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to deactivate this partner?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will revoke the partner's access and move them to the pending list. They will not be able to log in until approved again. Their data will be preserved.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemovePartner} variant="destructive" disabled={isRemoving}>
                          {isRemoving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Yes, Deactivate'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
            </div>
        </>
    );
}
