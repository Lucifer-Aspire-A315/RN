
import { redirect } from 'next/navigation';
import { checkSessionAction } from '@/app/actions/authActions';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Shield, BadgeCheck, Building, Briefcase, Handshake } from 'lucide-react';
import { cn } from '@/lib/utils';

const InfoRow = ({ icon, label, value, isSensitive = false }: { icon: React.ReactNode, label: string, value: string, isSensitive?: boolean }) => (
  <div className={cn(
    "flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:bg-primary/5 hover:shadow-inner",
    isSensitive && "bg-destructive/10 hover:bg-destructive/15"
  )}>
    <div className={cn("flex-shrink-0 p-3 rounded-full bg-primary/10 text-primary", isSensitive && "bg-destructive/20 text-destructive")}>
      {icon}
    </div>
    <div className="flex-1">
      <p className={cn("text-sm text-muted-foreground", isSensitive && "text-destructive/80")}>{label}</p>
      <p className={cn("font-semibold text-foreground text-lg", isSensitive && "text-destructive")}>{value}</p>
    </div>
  </div>
);


export default async function ProfilePage() {
  const user = await checkSessionAction();

  if (!user) {
    redirect('/login');
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1 && names[0] && names[names.length - 1]) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  let userTypeDisplay: string;
  let UserTypeIcon = User;

  if (user.type === 'partner') {
    switch (user.businessModel) {
      case 'dsa':
        userTypeDisplay = 'DSA Partner';
        UserTypeIcon = Briefcase;
        break;
      case 'merchant':
        userTypeDisplay = 'Merchant Partner';
        UserTypeIcon = Building;
        break;
      case 'referral':
        userTypeDisplay = 'Referral Partner';
        UserTypeIcon = Handshake;
        break;
      default:
        userTypeDisplay = 'Partner';
        UserTypeIcon = Handshake;
    }
  } else {
    userTypeDisplay = 'User';
  }

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
                            <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.fullName}`} alt={user.fullName} />
                            <AvatarFallback className="text-4xl">{getInitials(user.fullName)}</AvatarFallback>
                        </Avatar>
                        <h1 className="text-2xl font-bold text-primary-foreground">{user.fullName}</h1>
                        <p className="text-sm text-primary-foreground/80">{user.email}</p>
                    </div>
                     <CardContent className="p-6 bg-card">
                         <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-secondary">
                            <UserTypeIcon className="w-5 h-5 text-secondary-foreground" />
                            <p className="font-semibold text-secondary-foreground">{user.isAdmin ? 'Administrator' : userTypeDisplay}</p>
                         </div>
                     </CardContent>
                </Card>
            </div>

            {/* Right Column: Details */}
             <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-xl rounded-2xl animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Account Details</CardTitle>
                        <CardDescription>An overview of your account information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoRow icon={<User className="w-6 h-6"/>} label="Full Name" value={user.fullName} />
                        <InfoRow icon={<Mail className="w-6 h-6"/>} label="Email Address" value={user.email} />
                        <InfoRow icon={<BadgeCheck className="w-6 h-6"/>} label="Account Type" value={user.isAdmin ? 'Administrator' : userTypeDisplay} />
                        {user.isAdmin && (
                            <InfoRow 
                                icon={<Shield className="w-6 h-6"/>} 
                                label="Admin Status" 
                                value="You have full administrator privileges." 
                                isSensitive
                            />
                        )}
                    </CardContent>
                </Card>
             </div>
        </div>
      </main>
    </div>
  );
}
