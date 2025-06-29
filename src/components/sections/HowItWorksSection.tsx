
"use client";

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
      title: 'Create Your Account',
      description: 'A quick sign-up gives you access to all our services in just a few clicks.',
      color: 'blue',
    },
    {
      icon: Search,
      title: 'Explore & Apply',
      description: 'Browse our services, choose what you need, and fill out a simple online application.',
      color: 'teal',
    },
    {
      icon: UploadCloud,
      title: 'Upload Documents',
      description: 'Securely upload the required documents through our encrypted portal. It’s fast and safe.',
      color: 'indigo',
    },
    {
      icon: LineChart,
      title: 'Track Your Status',
      description: 'Easily monitor the real-time status of your application from your personal dashboard.',
      color: 'amber',
    },
    {
      icon: CheckCircle2,
      title: 'Get Approved',
      description: 'Receive your loan disbursal or service confirmation promptly upon approval.',
      color: 'emerald',
    },
  ];

  const partnerSteps: Step[] = [
    {
      icon: Handshake,
      title: 'Register as a Partner',
      description: 'Choose your partnership model and complete the simple, guided registration process.',
      color: 'blue',
    },
    {
      icon: ShieldCheck,
      title: 'Verification Process',
      description: 'Our team will review your application to ensure our quality and trust standards are met.',
      color: 'teal',
    },
    {
      icon: LayoutDashboard,
      title: 'Access Your Dashboard',
      description: 'Once approved, get access to a powerful partner dashboard to manage all your activities.',
      color: 'indigo',
    },
    {
      icon: FilePlus2,
      title: 'Submit Client Apps',
      description: 'Use your dedicated portal to easily submit and manage applications for your clients.',
      color: 'amber',
    },
    {
      icon: TrendingUp,
      title: 'Track & Succeed',
      description: 'Monitor application progress, track your earnings, and grow your business with our support.',
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
    <div className="relative mt-12 space-y-8 md:space-y-0 md:-my-8">
      {/* Central timeline line for desktop */}
      <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-border md:block" aria-hidden="true" />

      {steps.map((step, index) => {
        const Icon = step.icon;
        const isRightContent = index % 2 !== 0;
        const colors = colorVariants[step.color] ?? colorVariants.blue;

        return (
          <div key={index} className="relative md:my-8">
            {/* Timeline Dot (Desktop) */}
            <div className="absolute left-1/2 top-14 hidden -translate-x-1/2 md:block">
              <div className={cn('h-3 w-3 rounded-full', colors.dot)} />
            </div>

            <div className="grid grid-cols-1 items-center gap-y-4 md:grid-cols-2 md:gap-x-16">
              {/* Text Content */}
              <div className={cn(
                "text-center md:text-left",
                isRightContent && 'md:order-2 md:text-right'
              )}>
                <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
              </div>

              {/* Icon Box */}
              <div className={cn(
                  "flex justify-center",
                  isRightContent ? "md:order-1 md:justify-end" : "md:justify-start"
              )}>
                 <div className={cn(
                      "flex items-center rounded-2xl bg-card shadow-lg w-full max-w-xs md:w-auto transition-transform duration-300 hover:scale-105 hover:shadow-xl",
                      colors.bg
                    )}>
                    <div className="px-5 py-6">
                      <span className={cn('text-4xl font-bold opacity-60', colors.text)}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex-grow flex items-center justify-center bg-card rounded-r-2xl p-5 h-full">
                      <Icon className={cn('h-10 w-10', colors.text)} />
                    </div>
                  </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-secondary/50">
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
          
          <TabsContent value="customers" className="pt-4">
            {renderTimeline(customerSteps)}
          </TabsContent>
          
          <TabsContent value="partners" className="pt-4">
            {renderTimeline(partnerSteps)}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
