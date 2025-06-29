"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  FileText,
  CheckCircle2,
  UploadCloud,
  UserPlus,
  LayoutDashboard,
  ShieldCheck,
  Handshake,
  TrendingUp,
  FilePlus2,
  Search,
  LineChart,
} from 'lucide-react';
import React from 'react';

// Common step type
type Step = {
  icon: React.ElementType;
  title: string;
  description: string;
  color: keyof typeof colorVariants;
};

const customerSteps: Step[] = [
    {
      icon: UserPlus,
      title: 'Create an Account',
      description: 'A quick sign-up gives you access to all our services.',
      color: 'blue',
    },
    {
      icon: Search,
      title: 'Find Your Service',
      description: 'Browse our services and fill out a simple online application.',
      color: 'teal',
    },
    {
      icon: UploadCloud,
      title: 'Upload Documents',
      description: 'Securely upload the required documents through our encrypted portal.',
      color: 'indigo',
    },
    {
      icon: LineChart,
      title: 'Track Your Status',
      description: 'Monitor the real-time status of your application from your personal dashboard.',
      color: 'amber',
    },
    {
      icon: CheckCircle2,
      title: 'Get Approved',
      description: 'Receive your loan or service confirmation promptly upon approval.',
      color: 'emerald',
    },
  ];

  const partnerSteps: Step[] = [
    {
      icon: Handshake,
      title: 'Register as a Partner',
      description: 'Choose your partnership model and complete the simple registration.',
      color: 'blue',
    },
    {
      icon: ShieldCheck,
      title: 'Verification Process',
      description: 'Our team will review your application to ensure quality and trust.',
      color: 'teal',
    },
    {
      icon: LayoutDashboard,
      title: 'Access Your Dashboard',
      description: 'Get access to a powerful dashboard to manage all your activities.',
      color: 'indigo',
    },
    {
      icon: FilePlus2,
      title: 'Submit Client Apps',
      description: 'Use your dedicated portal to easily submit and manage client applications.',
      color: 'amber',
    },
    {
      icon: TrendingUp,
      title: 'Track & Succeed',
      description: 'Monitor application progress, track earnings, and grow your business.',
      color: 'emerald',
    },
  ];
  
const colorVariants = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    text: 'text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  teal: {
    bg: 'bg-teal-100 dark:bg-teal-900/40',
    text: 'text-teal-600 dark:text-teal-400',
    dot: 'bg-teal-500',
  },
  indigo: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/40',
    text: 'text-indigo-600 dark:text-indigo-400',
    dot: 'bg-indigo-500',
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    text: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  emerald: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    text: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
};


export function HowItWorksSection() {
    
  const renderTimeline = (steps: Step[]) => (
    <div className="relative mt-12">
      {/* Central timeline line - for desktop */}
      <div className="absolute left-1/2 top-4 hidden h-full w-0.5 -translate-x-1/2 bg-border md:block" aria-hidden="true" />
      {/* Mobile timeline line */}
      <div className="absolute left-8 top-4 h-full w-0.5 -translate-x-1/2 bg-border md:hidden" aria-hidden="true" />

      <div className="flex flex-col gap-y-20">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isRightContent = index % 2 !== 0;
          const colors = colorVariants[step.color] ?? colorVariants.blue;

          return (
            <div key={index} className="relative w-full">
              {/* Desktop layout */}
              <div className="hidden md:flex items-center">
                {/* Left-side Content */}
                { !isRightContent ? (
                  <div className="w-5/12 text-right pr-12">
                     <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                     <p className="mt-2 text-muted-foreground">{step.description}</p>
                  </div>
                ) : <div className="w-5/12"></div> }

                {/* Icon Card in the middle */}
                <div className="relative z-10 w-2/12 flex justify-center">
                   <div className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-4 border-secondary bg-primary"></div>
                   <div className={cn(
                    "flex w-40 items-center overflow-hidden rounded-lg bg-card shadow-lg",
                    colors.bg
                  )}>
                    <div className={cn("flex h-full items-center justify-center p-4", colors.text)}>
                      <span className="text-3xl font-bold">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="flex flex-grow items-center justify-center bg-card p-4 h-full">
                      <Icon className={cn('h-8 w-8', colors.text)} />
                    </div>
                  </div>
                </div>

                {/* Right-side Content */}
                { isRightContent ? (
                    <div className="w-5/12 text-left pl-12">
                        <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                        <p className="mt-2 text-muted-foreground">{step.description}</p>
                    </div>
                ) : <div className="w-5/12"></div> }
              </div>

              {/* Mobile layout */}
              <div className="ml-16 md:hidden">
                <div className="absolute left-8 top-0 -translate-x-1/2 z-10">
                  <div className="h-4 w-4 rounded-full border-4 border-secondary bg-primary" />
                </div>
                 <div className={cn(
                  "flex w-40 items-center overflow-hidden rounded-lg bg-card shadow-lg mb-2",
                   colors.bg
                 )}>
                   <div className={cn("flex h-full items-center justify-center p-4", colors.text)}>
                     <span className="text-3xl font-bold">{String(index + 1).padStart(2, '0')}</span>
                   </div>
                   <div className="flex flex-grow items-center justify-center bg-card p-4 h-full">
                     <Icon className={cn('h-8 w-8', colors.text)} />
                   </div>
                 </div>
                 <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                 <p className="mt-2 text-muted-foreground">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-secondary/50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">A Clear Path to Your Financial Goals</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              We've streamlined the entire process to be transparent, fast, and hassle-free for everyone.
            </p>
        </div>

        <Tabs defaultValue="customers" className="max-w-4xl mx-auto mt-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customers">For Our Customers</TabsTrigger>
            <TabsTrigger value="partners">For Our Partners</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customers" className="pt-8">
            {renderTimeline(customerSteps)}
          </TabsContent>
          
          <TabsContent value="partners" className="pt-8">
            {renderTimeline(partnerSteps)}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
