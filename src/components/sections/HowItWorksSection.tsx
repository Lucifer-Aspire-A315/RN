import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, CheckCircle2, Zap, UserPlus, Handshake, ShieldCheck, Users, TrendingUp } from 'lucide-react';

const userSteps = [
  {
    icon: <UserPlus className="w-10 h-10 text-primary" />,
    title: '1. Create Your Account',
    description: 'A quick and easy sign-up gives you access to all our services in just a few clicks.',
  },
  {
    icon: <FileText className="w-10 h-10 text-accent" />,
    title: '2. Select & Apply',
    description: 'Browse our services, choose what you need, and fill out our simple online application form.',
  },
  {
    icon: <Zap className="w-10 h-10 text-yellow-500" />,
    title: '3. Quick Processing',
    description: 'Our expert team and advanced technology work together to review your application swiftly.',
  },
  {
    icon: <CheckCircle2 className="w-10 h-10 text-green-500" />,
    title: '4. Goal Achieved',
    description: 'Receive your loan disbursal, credit card, or service confirmation promptly upon approval.',
  },
];

const partnerSteps = [
  {
    icon: <Handshake className="w-10 h-10 text-primary" />,
    title: '1. Register as a Partner',
    description: 'Choose your partnership model (DSA, Merchant, or Referral) and complete the registration form.',
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-accent" />,
    title: '2. Admin Approval',
    description: 'Our team will verify your details. Once approved, you gain full access to your partner dashboard.',
  },
  {
    icon: <Users className="w-10 h-10 text-yellow-500" />,
    title: '3. Submit Client Applications',
    description: 'Use your dedicated dashboard to easily submit and manage applications for your clients.',
  },
  {
    icon: <TrendingUp className="w-10 h-10 text-green-500" />,
    title: '4. Track & Succeed',
    description: 'Monitor application progress in real-time and grow your business and earnings with us.',
  },
];


export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground">A Clear Path to Your Financial Goals</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          We've streamlined the entire process to be transparent, fast, and hassle-free for everyone.
        </p>
        
        <Tabs defaultValue="customers" className="max-w-4xl mx-auto mt-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customers">For Our Customers</TabsTrigger>
            <TabsTrigger value="partners">For Our Partners</TabsTrigger>
          </TabsList>
          <TabsContent value="customers">
             <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {userSteps.map((step) => (
                <Card key={step.title} className="bg-card text-center card-hover-effect border-2 border-transparent hover:border-primary h-full flex flex-col">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                    <p className="text-muted-foreground text-sm flex-grow">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="partners">
             <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {partnerSteps.map((step) => (
                <Card key={step.title} className="bg-card text-center card-hover-effect border-2 border-transparent hover:border-primary h-full flex flex-col">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                    <p className="text-muted-foreground text-sm flex-grow">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
