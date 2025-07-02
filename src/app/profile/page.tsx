
import { redirect } from 'next/navigation';
import { getUserProfileDetails, type UserProfileData } from '@/app/actions/profileActions';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Shield, BadgeCheck, Building, Briefcase, Handshake, Phone, Globe, Bank, Hash, Calendar, MapPin, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import type { PartnerSignUpFormData } from '@/lib/schemas';

const InfoRow = ({ icon, label, value, isSensitive = false }: { icon: React.ReactNode, label: string, value: string | undefined | React.ReactNode, isSensitive?: boolean }) => {
    if (!value) return null;
    return (
        <div className="flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 hover:bg-primary/5">
            <div className={cn("flex-shrink-0 p-3 rounded-full bg-primary/10 text-primary", isSensitive && "bg-destructive/20 text-destructive")}>
            {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">{label}</p>
                <div className="font-semibold text-foreground text-base break-words">{value}</div>
            </div>
        </div>
    )
};

const DetailSection = ({ title, icon: Icon, children, delay = 500 }: { title: string, icon: React.ElementType, children: React.ReactNode, delay?: number }) => (
    <Card className="shadow-xl rounded-2xl animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
        <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
                <Icon className="w-6 h-6 text-primary" />
                <span>{title}</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {children}
        </CardContent>
    </Card>
);

const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => {
    if (!value && typeof value !== 'number' && typeof value !== 'boolean') return null;
    if (typeof value === 'boolean') {
        value = value ? "Yes" : "No";
    }
    return (
        <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="font-semibold text-foreground text-base break-words">{value}</div>
        </div>
    );
};

const renderFileLink = (file: any, label: string) => {
    if (typeof file === 'string' && file.startsWith('http')) {
        return (
            <a href={file} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-2">
                <FileText size={16} /> View {label}
            </a>
        );
    }
    return <span className="text-muted-foreground">Not uploaded</span>;
};


export default async function ProfilePage() {
  const userProfile = await getUserProfileDetails();

  if (!userProfile) {
    redirect('/login');
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1 && names[0] && names[names.length - 1]) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name ? name.substring(0, 2).toUpperCase() : '??';
  };

  let userTypeDisplay: string;
  let UserTypeIcon = User;
  const fullName = userProfile.fullName || 'User';
  const email = (userProfile as any).personalDetails?.email || userProfile.email;

  if (userProfile.type === 'partner') {
    switch (userProfile.businessModel) {
      case 'dsa': userTypeDisplay = 'DSA Partner'; UserTypeIcon = Briefcase; break;
      case 'merchant': userTypeDisplay = 'Merchant Partner'; UserTypeIcon = Building; break;
      case 'referral': userTypeDisplay = 'Referral Partner'; UserTypeIcon = Handshake; break;
      default: userTypeDisplay = 'Partner'; UserTypeIcon = Handshake;
    }
  } else {
    userTypeDisplay = 'User';
  }

  const partnerProfile = userProfile as PartnerSignUpFormData;

  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
       <Header />
       <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-8">
                <Card className="shadow-2xl rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="bg-gradient-to-br from-primary/80 to-accent/80 p-6 text-center">
                         <Avatar className="w-28 h-28 mx-auto mb-4 border-4 border-background/50 shadow-lg">
                            <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${fullName}`} alt={fullName} />
                            <AvatarFallback className="text-4xl">{getInitials(fullName)}</AvatarFallback>
                        </Avatar>
                        <h1 className="text-2xl font-bold text-primary-foreground">{fullName}</h1>
                        <p className="text-sm text-primary-foreground/80">{email}</p>
                    </div>
                     <CardContent className="p-6 bg-card">
                         <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-secondary">
                            <UserTypeIcon className="w-5 h-5 text-secondary-foreground" />
                            <p className="font-semibold text-secondary-foreground">{userProfile.isAdmin ? 'Administrator' : userTypeDisplay}</p>
                         </div>
                     </CardContent>
                </Card>
            </div>

            {/* Right Column: Details */}
             <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-xl rounded-2xl animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Account Overview</CardTitle>
                        <CardDescription>Your primary account information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <InfoRow icon={<User className="w-6 h-6"/>} label="Full Name" value={fullName} />
                        <InfoRow icon={<Mail className="w-6 h-6"/>} label="Email Address" value={email} />
                        <InfoRow icon={<Phone className="w-6 h-6"/>} label="Mobile Number" value={userProfile.type === 'partner' ? partnerProfile.personalDetails?.mobileNumber : userProfile.mobileNumber} />
                        <InfoRow icon={<BadgeCheck className="w-6 h-6"/>} label="Account Type" value={userProfile.isAdmin ? 'Administrator' : userTypeDisplay} />
                        {userProfile.isAdmin && (
                            <InfoRow 
                                icon={<Shield className="w-6 h-6"/>} 
                                label="Admin Status" 
                                value="You have full administrator privileges." 
                                isSensitive
                            />
                        )}
                    </CardContent>
                </Card>
                
                {userProfile.type === 'partner' && partnerProfile.personalDetails && (
                    <DetailSection title="Personal & KYC Details" icon={User} delay={500}>
                        <DetailItem label="Father's / Husband's Name" value={partnerProfile.personalDetails.fatherOrHusbandName} />
                        <DetailItem label="Date of Birth" value={new Date(partnerProfile.personalDetails.dob).toLocaleDateString('en-GB')} />
                        <DetailItem label="Gender" value={partnerProfile.personalDetails.gender?.charAt(0).toUpperCase() + partnerProfile.personalDetails.gender?.slice(1)} />
                        <DetailItem label="PAN Number" value={partnerProfile.personalDetails.panNumber} />
                        <DetailItem label="Aadhaar Number" value={partnerProfile.personalDetails.aadhaarNumber} />
                        <DetailItem label="Current Address" value={partnerProfile.personalDetails.currentAddress} />
                        {partnerProfile.personalDetails.isPermanentAddressSame === 'no' && (
                            <DetailItem label="Permanent Address" value={partnerProfile.personalDetails.permanentAddress} />
                        )}
                    </DetailSection>
                )}

                {userProfile.type === 'partner' && partnerProfile.businessModel === 'dsa' && partnerProfile.professionalFinancial && (
                    <DetailSection title="Professional & Financial" icon={Briefcase} delay={600}>
                        <DetailItem label="Highest Qualification" value={partnerProfile.professionalFinancial.highestQualification} />
                        <DetailItem label="Present Occupation" value={partnerProfile.professionalFinancial.presentOccupation} />
                        <DetailItem label="Years in Occupation" value={`${partnerProfile.professionalFinancial.yearsInOccupation} years`} />
                        <DetailItem label="Annual Income" value={`₹ ${partnerProfile.professionalFinancial.annualIncome?.toLocaleString('en-IN')}`} />
                        <DetailItem label="Bank Name" value={partnerProfile.professionalFinancial.bankName} />
                        <DetailItem label="Bank Account Number" value={partnerProfile.professionalFinancial.bankAccountNumber} />
                        <DetailItem label="Bank IFSC Code" value={partnerProfile.professionalFinancial.bankIfscCode} />
                    </DetailSection>
                )}

                {userProfile.type === 'partner' && partnerProfile.businessModel === 'dsa' && partnerProfile.businessScope && (
                    <DetailSection title="Business Scope" icon={Globe} delay={700}>
                        <DetailItem label="Constitution" value={partnerProfile.businessScope.constitution?.charAt(0).toUpperCase() + partnerProfile.businessScope.constitution?.slice(1)} />
                        <DetailItem label="Operating Location" value={partnerProfile.businessScope.operatingLocation} />
                        <DetailItem 
                            label="Products of Interest" 
                            value={
                                Object.entries(partnerProfile.businessScope.productsOfInterest)
                                .filter(([,v]) => v)
                                .map(([k]) => k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))
                                .join(', ') || 'None'
                            } 
                        />
                    </DetailSection>
                )}

                {userProfile.type === 'partner' && partnerProfile.businessModel === 'merchant' && partnerProfile.businessInformation && (
                    <DetailSection title="Business Information" icon={Building} delay={500}>
                        <DetailItem label="Legal Business Name" value={partnerProfile.businessInformation.legalBusinessName} />
                        <DetailItem label="Business Type" value={partnerProfile.businessInformation.businessType} />
                        <DetailItem label="Industry" value={partnerProfile.businessInformation.industry} />
                        <DetailItem label="GST Number" value={partnerProfile.businessInformation.gstNumber} />
                        <DetailItem label="Business Address" value={partnerProfile.businessInformation.businessAddress} />
                    </DetailSection>
                )}
                 
                 {userProfile.type === 'partner' && (
                     <DetailSection title="Uploaded Documents" icon={FileText} delay={800}>
                        {partnerProfile.businessModel === 'dsa' && partnerProfile.dsaDocumentUploads && (
                            <>
                                <DetailItem label="PAN Card" value={renderFileLink(partnerProfile.dsaDocumentUploads.panCard, "PAN Card")} />
                                <DetailItem label="Aadhaar Card" value={renderFileLink(partnerProfile.dsaDocumentUploads.aadhaarCard, "Aadhaar")} />
                                <DetailItem label="Photograph" value={renderFileLink(partnerProfile.dsaDocumentUploads.photograph, "Photo")} />
                                <DetailItem label="Bank Statement" value={renderFileLink(partnerProfile.dsaDocumentUploads.bankStatement, "Statement")} />
                            </>
                        )}
                        {partnerProfile.businessModel === 'merchant' && partnerProfile.merchantDocumentUploads && (
                            <>
                                <DetailItem label="GST Certificate" value={renderFileLink(partnerProfile.merchantDocumentUploads.gstCertificate, "GST Cert.")} />
                                <DetailItem label="Business Registration" value={renderFileLink(partnerProfile.merchantDocumentUploads.businessRegistration, "Registration")} />
                                <DetailItem label="Owner's PAN Card" value={renderFileLink(partnerProfile.merchantDocumentUploads.ownerPanCard, "PAN Card")} />
                            </>
                        )}
                     </DetailSection>
                 )}
             </div>
        </div>
      </main>
    </div>
  );
}
