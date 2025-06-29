
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  FilePlus2,
  CheckCircle2,
  UploadCloud,
  UserPlus,
  LayoutDashboard,
  ShieldCheck,
  Handshake,
  TrendingUp,
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
      title: 'Sign Up Fast',
      description: 'A quick sign-up gives you access to all our financial services.',
      color: 'blue',
    },
    {
      icon: Search,
      title: 'Apply Online',
      description: 'Choose your desired service and fill out a simple, secure online form.',
      color: 'teal',
    },
    {
      icon: UploadCloud,
      title: 'Submit Documents',
      description: 'Upload the required documents easily through our encrypted portal.',
      color: 'indigo',
    },
    {
      icon: LineChart,
      title: 'Track Your Status',
      description: 'Monitor your application’s real-time status from your dashboard.',
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
      title: 'Register as Partner',
      description: 'Choose your model and complete the simple registration to join our network.',
      color: 'blue',
    },
    {
      icon: ShieldCheck,
      title: 'Quick Verification',
      description: 'Our team will review your application to ensure quality and trust.',
      color: 'teal',
    },
    {
      icon: LayoutDashboard,
      title: 'Access Dashboard',
      description: 'Get a powerful dashboard to manage your clients and track earnings.',
      color: 'indigo',
    },
    {
      icon: FilePlus2,
      title: 'Submit Applications',
      description: 'Use your portal to easily submit and manage applications for your clients.',
      color: 'amber',
    },
    {
      icon: TrendingUp,
      title: 'Track & Succeed',
      description: 'Monitor progress, see your earnings, and grow your business with us.',
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
        {/* Central line for desktop */}
        <div className="absolute left-1/2 top-4 hidden h-full w-0.5 -translate-x-1/2 bg-border md:block" />
        
        <div className="space-y-16">
            {steps.map((step, index) => {
                const isTextLeft = index % 2 === 0;
                const Icon = step.icon;
                const colors = colorVariants[step.color];

                return (
                    <div key={index} className="relative">
                        {/* Desktop Layout */}
                        <div className="hidden md:grid md:grid-cols-2 md:gap-x-16 items-center">
                            {/* Text Block */}
                            <div className={cn('space-y-2', isTextLeft ? 'text-right' : 'order-last text-left')}>
                                <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </div>
                            {/* Icon Card Block */}
                            <div className={cn('flex', isTextLeft ? 'justify-start' : 'order-first justify-end')}>
                                 <div className="flex items-center bg-card rounded-2xl shadow-lg h-20 w-56 overflow-hidden">
                                    <div className={cn("relative flex items-center justify-center w-20 h-full", colors.bg)}>
                                        <div className="absolute top-0 right-0 w-10 h-10 bg-card/20 rounded-full -translate-y-1/3 translate-x-1/3 z-0" />
                                        <span className={cn("text-3xl font-bold z-10", colors.text)}>
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center">
                                        <Icon className={cn("h-8 w-8", colors.text)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Dot (Desktop) */}
                        <div className={cn("hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-secondary", colors.dot)} />
                        
                        {/* Mobile Layout */}
                        <div className="md:hidden flex items-start gap-4">
                            {/* Dot and Line for Mobile */}
                            <div className="relative pt-1">
                                <div className={cn("w-4 h-4 rounded-full border-4 border-secondary", colors.dot)} />
                                {index < steps.length - 1 && <div className="absolute top-4 left-1/2 w-0.5 h-full bg-border -translate-x-1/2" />}
                            </div>
                            
                            {/* Content for Mobile */}
                            <div className="flex-1 space-y-4">
                                 <div className="flex items-center bg-card rounded-2xl shadow-lg h-20 w-56 overflow-hidden">
                                    <div className={cn("relative flex items-center justify-center w-20 h-full", colors.bg)}>
                                        <div className="absolute top-0 right-0 w-10 h-10 bg-card/20 rounded-full -translate-y-1/3 translate-x-1/3 z-0" />
                                        <span className={cn("text-3xl font-bold z-10", colors.text)}>
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center">
                                        <Icon className={cn("h-8 w-8", colors.text)} />
                                    </div>
                                </div>
                                 <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </div>
                            </div>
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
