
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
  Users,
  TrendingUp,
  FilePlus2,
  Search,
  LineChart,
} from 'lucide-react';
import React from 'react';

const customerSteps = [
  {
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'A quick and easy sign-up gives you access to all our services in just a few clicks.',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    icon: Search,
    title: 'Explore Services',
    description: 'Browse our wide range of loan products and CA services to find exactly what you need.',
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-100 dark:bg-teal-900/30',
  },
  {
    icon: FileText,
    title: 'Fill Application',
    description: 'Select a service and fill out our simple, guided online application form with your details.',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  {
    icon: UploadCloud,
    title: 'Upload Documents',
    description: 'Securely upload the required documents through our encrypted portal. It’s fast and safe.',
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-100 dark:bg-sky-900/30',
  },
  {
    icon: LineChart,
    title: 'Track Progress',
    description: 'Once submitted, easily monitor the real-time status of your application from your personal dashboard.',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  {
    icon: CheckCircle2,
    title: 'Goal Achieved',
    description: 'Receive your loan disbursal, credit card, or service confirmation promptly upon approval.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
];

const partnerSteps = [
  {
    icon: Handshake,
    title: 'Register as Partner',
    description: 'Choose your partnership model (DSA, Merchant, or Referral) and complete the registration.',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    icon: FilePlus2,
    title: 'Submit Your Details',
    description: 'Provide your business or personal information and upload the necessary verification documents.',
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-100 dark:bg-teal-900/30',
  },
  {
    icon: ShieldCheck,
    title: 'Admin Verification',
    description: 'Our expert team will review your application. We ensure all our partners meet our trust standards.',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  {
    icon: LayoutDashboard,
    title: 'Access Your Dashboard',
    description: 'Once approved, you gain full access to your powerful partner dashboard to manage your activities.',
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-100 dark:bg-sky-900/30',
  },
  {
    icon: Users,
    title: 'Submit Client Apps',
    description: 'Use your dedicated portal to easily submit and manage loan and service applications for your clients.',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  {
    icon: TrendingUp,
    title: 'Track & Succeed',
    description: 'Monitor application progress in real-time, track your earnings, and grow your business with us.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
];


export function HowItWorksSection() {

  const renderTimeline = (steps: typeof customerSteps | typeof partnerSteps) => (
    <div className="mt-10">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={index} className="flex">
            {/* Timeline graphics */}
            <div className="flex flex-col items-center mr-6">
              <div
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-full z-10',
                  step.bg
                )}
              >
                <Icon className={cn('h-7 w-7', step.color)} />
              </div>
              {index < steps.length - 1 && (
                <div className="h-full w-px bg-border -mt-1" />
              )}
            </div>
            {/* Content */}
            <div className={cn("pb-12 pt-2 transform transition-all duration-300 hover:scale-[1.02]", index < steps.length - 1 ? "-mt-2" : "")}>
              <p className="mb-1 text-sm font-semibold text-primary">
                STEP {index + 1}
              </p>
              <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">
                {step.description}
              </p>
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

        <Tabs defaultValue="customers" className="max-w-3xl mx-auto mt-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customers">For Our Customers</TabsTrigger>
            <TabsTrigger value="partners">For Our Partners</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customers">
            {renderTimeline(customerSteps)}
          </TabsContent>
          
          <TabsContent value="partners">
            {renderTimeline(partnerSteps)}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
