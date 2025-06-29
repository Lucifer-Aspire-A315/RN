
"use client"

import React, { useRef, useEffect } from 'react';
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

type Step = {
  icon: React.ElementType;
  title: string;
  description: string;
};

const customerSteps: Step[] = [
    {
      icon: UserPlus,
      title: 'Sign Up Fast',
      description: 'A quick sign-up gives you access to all our financial services.',
    },
    {
      icon: Search,
      title: 'Apply Online',
      description: 'Choose your desired service and fill out a simple, secure online form.',
    },
    {
      icon: UploadCloud,
      title: 'Submit Documents',
      description: 'Upload the required documents easily through our encrypted portal.',
    },
    {
      icon: LineChart,
      title: 'Track Your Status',
      description: 'Monitor your application’s real-time status from your dashboard.',
    },
    {
      icon: CheckCircle2,
      title: 'Get Approved',
      description: 'Receive your loan or service confirmation promptly upon approval.',
    },
  ];

  const partnerSteps: Step[] = [
    {
      icon: Handshake,
      title: 'Register as Partner',
      description: 'Choose your model and complete the simple registration to join our network.',
    },
    {
      icon: ShieldCheck,
      title: 'Quick Verification',
      description: 'Our team will review your application to ensure quality and trust.',
    },
    {
      icon: LayoutDashboard,
      title: 'Access Dashboard',
      description: 'Get a powerful dashboard to manage your clients and track earnings.',
    },
    {
      icon: FilePlus2,
      title: 'Submit Applications',
      description: 'Use your portal to easily submit and manage applications for your clients.',
    },
    {
      icon: TrendingUp,
      title: 'Track & Succeed',
      description: 'Monitor progress, see your earnings, and grow your business with us.',
    },
  ];
  
const colorVariants = {
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
    teal: { bg: 'bg-teal-100 dark:bg-teal-900/40', text: 'text-teal-600 dark:text-teal-400', dot: 'bg-teal-500' },
    indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-600 dark:text-indigo-400', dot: 'bg-indigo-500' },
    amber: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
};
const stepColors = ['blue', 'teal', 'indigo', 'amber', 'emerald'] as const;

function Timeline({ steps }: { steps: Step[] }) {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const currentRef = timelineRef.current;
    if (currentRef) {
      const items = currentRef.querySelectorAll('.timeline-step');
      items.forEach((item) => {
        observer.observe(item);
      });
    }

    return () => {
      if (currentRef) {
        const items = currentRef.querySelectorAll('.timeline-step');
        items.forEach((item) => {
          observer.unobserve(item);
        });
      }
    };
  }, [steps]);


  return (
    <div ref={timelineRef} className="relative mt-12 space-y-20">
      {/* Central line for desktop */}
      <div className="absolute left-1/2 top-8 hidden h-full w-0.5 -translate-x-1/2 bg-border md:block" />

      {steps.map((step, index) => {
        const isLeft = index % 2 === 0;
        const Icon = step.icon;
        const colorKey = stepColors[index % stepColors.length];
        const colors = colorVariants[colorKey];

        return (
          <div
            key={index}
            className="timeline-step relative flex items-center justify-center transition-all duration-700 ease-out opacity-0 translate-y-10 md:grid md:grid-cols-2 md:gap-x-16"
          >
            {/* Desktop and Mobile: Text Block */}
            <div className={cn(
              'w-full max-w-sm md:max-w-none',
              isLeft ? 'md:order-1 md:text-right' : 'md:order-2 md:text-left',
              'md:block hidden' // Hidden on mobile initially
            )}>
              <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
              <p className="mt-1 text-muted-foreground">{step.description}</p>
            </div>
            
            {/* Desktop: Icon Block */}
            <div className={cn('hidden md:flex', isLeft ? 'md:order-2 md:justify-start' : 'md:order-1 md:justify-end')}>
                 <div className="flex items-center bg-card rounded-2xl shadow-lg h-24 w-24 overflow-hidden border">
                    <div className={cn("relative flex h-full w-10 items-center justify-center bg-cover bg-no-repeat", colors.bg)}>
                        <div className={cn("absolute inset-0 bg-gradient-to-br from-transparent to-black/10")} />
                        <span className={cn("z-10 -rotate-90 text-xl font-bold tracking-wider", colors.text)}>
                            {String(index + 1).padStart(2, '0')}
                        </span>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                         <Icon className={cn("h-8 w-8", colors.text)} />
                    </div>
                </div>
            </div>

            {/* Mobile: Combined Block */}
            <div className="md:hidden flex items-start gap-4 w-full">
               <div className="flex-shrink-0 flex flex-col items-center">
                 <div className="flex items-center bg-card rounded-2xl shadow-lg h-24 w-24 overflow-hidden border">
                    <div className={cn("relative flex h-full w-10 items-center justify-center bg-cover bg-no-repeat", colors.bg)}>
                        <div className={cn("absolute inset-0 bg-gradient-to-br from-transparent to-black/10")} />
                        <span className={cn("z-10 -rotate-90 text-xl font-bold tracking-wider", colors.text)}>
                            {String(index + 1).padStart(2, '0')}
                        </span>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                         <Icon className={cn("h-8 w-8", colors.text)} />
                    </div>
                 </div>
               </div>
               <div className="pt-2">
                    <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                    <p className="mt-1 text-muted-foreground">{step.description}</p>
               </div>
            </div>

            {/* Timeline Dot (Desktop) */}
            <div className={cn("hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-secondary", colors.dot)} />
          </div>
        );
      })}
    </div>
  );
}


export function HowItWorksSection() {
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
            <Timeline steps={customerSteps} />
          </TabsContent>
          
          <TabsContent value="partners" className="pt-8">
            <Timeline steps={partnerSteps} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
