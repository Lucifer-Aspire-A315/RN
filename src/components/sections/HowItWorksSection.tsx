
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  CheckCircle2,
  UploadCloud,
  UserPlus,
  LayoutDashboard,
  ShieldCheck,
  Handshake,
  Users,
  TrendingUp,
  FilePlus2,
  Search,
  LineChart,
} from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

const customerSteps = [
  {
    icon: UserPlus,
    title: '1. Create Your Account',
    description: 'A quick and easy sign-up gives you access to all our services in just a few clicks.',
    color: 'text-blue-500',
    bg: 'bg-blue-500',
  },
  {
    icon: Search,
    title: '2. Explore Services',
    description: 'Browse our wide range of loan products, CA services, and government schemes to find what you need.',
    color: 'text-teal-500',
    bg: 'bg-teal-500',
  },
  {
    icon: FileText,
    title: '3. Fill Application',
    description: 'Select a service and fill out our simple, guided online application form with your details.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500',
  },
  {
    icon: UploadCloud,
    title: '4. Upload Documents',
    description: 'Securely upload the required documents through our encrypted portal. It’s fast and safe.',
     color: 'text-sky-500',
    bg: 'bg-sky-500',
  },
   {
    icon: LineChart,
    title: '5. Track Progress',
    description: 'Once submitted, you can easily monitor the real-time status of your application from your personal dashboard.',
     color: 'text-amber-500',
    bg: 'bg-amber-500',
  },
  {
    icon: CheckCircle2,
    title: '6. Goal Achieved',
    description: 'Receive your loan disbursal, credit card, or service confirmation promptly upon approval.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500',
  },
];

const partnerSteps = [
  {
    icon: Handshake,
    title: '1. Register as a Partner',
    description: 'Choose your partnership model (DSA, Merchant, or Referral) and complete the registration form.',
    color: 'text-blue-500',
    bg: 'bg-blue-500',
  },
  {
    icon: FilePlus2,
    title: '2. Submit Your Details',
    description: 'Provide your business or personal information and upload the necessary verification documents.',
    color: 'text-teal-500',
    bg: 'bg-teal-500',
  },
  {
    icon: ShieldCheck,
    title: '3. Admin Verification',
    description: 'Our expert team will review your application. We ensure all our partners meet our standards of trust.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500',
  },
  {
    icon: LayoutDashboard,
    title: '4. Access Your Dashboard',
    description: 'Once approved, you gain full access to your powerful partner dashboard to manage your activities.',
    color: 'text-sky-500',
    bg: 'bg-sky-500',
  },
  {
    icon: Users,
    title: '5. Submit Client Applications',
    description: 'Use your dedicated portal to easily submit and manage loan and service applications for your clients.',
     color: 'text-amber-500',
    bg: 'bg-amber-500',
  },
  {
    icon: TrendingUp,
    title: '6. Track & Succeed',
    description: 'Monitor application progress in real-time, track your earnings, and grow your business with us.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500',
  },
];


interface TimelineStepProps {
  step: (typeof customerSteps)[0];
  index: number;
}

const TimelineStep: React.FC<TimelineStepProps> = ({ step, index }) => {
  const isEven = index % 2 === 0;
  const Icon = step.icon;

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
      {/* Left Content */}
      <div className={cn('text-right', { 'sm:order-3 text-left': isEven })}>
        <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
        <p className="mt-1 text-muted-foreground">{step.description}</p>
      </div>

      {/* Timeline Separator */}
      <div className="flex flex-col items-center h-full sm:order-2">
        <div className={cn("w-4 h-4 rounded-full", step.bg)}></div>
        <div className="w-0.5 h-full bg-border"></div>
      </div>
      
      {/* Right Card */}
      <div className={cn('sm:order-1', { 'sm:order-1': isEven })}>
        <div className="flex items-center rounded-2xl bg-card shadow-lg p-2 max-w-[200px]">
          <div className={cn("p-3 rounded-xl bg-gradient-to-br from-white/20", step.bg)}>
            <p className="font-bold text-2xl text-white opacity-80">{String(index + 1).padStart(2, '0')}</p>
          </div>
          <div className="flex-1 flex justify-center items-center p-3">
             <Icon className={cn("w-8 h-8", step.color)} />
          </div>
        </div>
      </div>
    </div>
  );
};


const Timeline: React.FC<{ steps: typeof customerSteps }> = ({ steps }) => {
  return (
    <div className="relative mt-12 space-y-4">
      {steps.map((step, index) => (
        <TimelineStep key={index} step={step} index={index} />
      ))}
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-secondary/50">
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
            <Timeline steps={customerSteps} />
          </TabsContent>
          <TabsContent value="partners">
            <Timeline steps={partnerSteps} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
