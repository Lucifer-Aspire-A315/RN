
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import type { SetPageView } from '@/app/page';
import Image from 'next/image';
import { NewsTicker, type NewsTickerItem } from '@/components/shared/NewsTicker';
import { Banknote, Factory, Users, LandPlot, Building } from 'lucide-react';

interface HeroSectionProps {
  setCurrentPage: SetPageView;
}

const governmentSchemes: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  imageSrc: string;
  dataAiHint: string;
  gradient: string;
  textColor: string;
}[] = [
  {
    icon: <Banknote className="w-8 h-8" />,
    title: "PM Mudra Yojana (PMMY)",
    description: "Financial support for non-corporate, non-farm small/micro enterprises with loans up to ₹10 lakh.",
    imageSrc: "https://placehold.co/128x128.png",
    dataAiHint: "small business owner",
    gradient: "from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-950/50",
    textColor: "text-blue-900 dark:text-blue-100"
  },
  {
    icon: <Factory className="w-8 h-8" />,
    title: "PMEGP (Khadi Board)",
    description: "Credit-linked subsidies for new self-employment ventures and projects in the non-farm sector.",
    imageSrc: "https://placehold.co/128x128.png",
    dataAiHint: "local artisan workshop",
    gradient: "from-teal-100 to-green-200 dark:from-teal-900/50 dark:to-green-950/50",
    textColor: "text-teal-900 dark:text-teal-100"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Stand-Up India",
    description: "Promoting entrepreneurship among women and SC/ST communities with bank loans from ₹10 lakh to ₹1 Crore.",
    imageSrc: "https://placehold.co/128x128.png",
    dataAiHint: "woman entrepreneur",
    gradient: "from-indigo-100 to-purple-200 dark:from-indigo-900/50 dark:to-purple-950/50",
    textColor: "text-indigo-900 dark:text-indigo-100"
  }
];

const tickerItems: NewsTickerItem[] = governmentSchemes.map(scheme => ({
  text: (
    <div className={`bg-gradient-to-br ${scheme.gradient} ${scheme.textColor} p-6 grid grid-cols-1 md:grid-cols-3 items-center gap-4 h-full`}>
      <div className="md:col-span-2">
        <div className={`mb-2 inline-block p-2 bg-white/50 rounded-full`}>
          {React.cloneElement(scheme.icon, { className: 'w-8 h-8' })}
        </div>
        <h4 className="text-xl font-bold">{scheme.title}</h4>
        <p className="mt-1 text-sm opacity-90">{scheme.description}</p>
      </div>
      <div className="md:col-span-1 flex justify-center md:justify-end">
        <div className="w-32 h-32 overflow-hidden rounded-full border-4 border-white/50 shadow-lg">
          <Image 
            src={scheme.imageSrc} 
            alt={scheme.title} 
            width={128} 
            height={128} 
            data-ai-hint={scheme.dataAiHint}
            className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>
      </div>
    </div>
  )
}));

export function HeroSection({ setCurrentPage }: HeroSectionProps) {

  const handleSchemesClick = () => {
    setCurrentPage('governmentSchemes');
  };

  return (
    <section
      id="home"
      className="relative bg-gradient-to-b from-primary/5 via-background to-background pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden"
    >
      <div className="absolute inset-0 animate-[float_12s_ease-in-out_infinite] bg-accent/5 rounded-full blur-3xl w-96 h-96 top-20 left-10"></div>
      <div className="absolute inset-0 animate-[float-delay_10s_ease-in-out_infinite] bg-primary/5 rounded-full blur-3xl w-80 h-80 bottom-0 right-10"></div>
      
      <div className="container mx-auto px-6 z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Column: Text Content */}
            <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight">
                Your Trusted Partner for <span className="text-primary">Financial</span> Success
                </h1>
                <p className="mt-6 text-lg text-muted-foreground max-w-lg mx-auto md:mx-0">
                Empowering your dreams with transparent, technology-driven financial services. From personal loans to business solutions, we're here to help you grow.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                    <Button
                        size="lg"
                        className="cta-button"
                        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Explore Services
                    </Button>
                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                        How It Works
                    </Button>
                </div>
            </div>

            {/* Right Column: Image */}
            <div className="relative flex justify-center items-center">
                <div className="relative">
                    <Image
                        src="/right-side.png"
                        alt="Financial advisor with a family"
                        width={550}
                        height={450}
                        priority
                        className="object-contain animate-float z-10 relative"
                        data-ai-hint="family financial advisor"
                    />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-black/20 rounded-full animate-shadow-float z-0" />
                </div>
            </div>
        </div>
        
        {/* Government Schemes Showcase */}
        <div className="mt-16 md:mt-24">
            <h3 className="text-center text-2xl font-bold text-foreground mb-2">Explore Government Schemes</h3>
            <p className="text-center text-muted-foreground mb-6">We provide expert assistance for various government loan schemes.</p>
            <div className="max-w-4xl mx-auto">
                 <NewsTicker items={tickerItems} duration={5000} onContainerClick={handleSchemesClick} />
            </div>
            <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">Or explore our specialized services directly:</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setCurrentPage('governmentSchemes')}
                        className="font-semibold"
                    >
                        <LandPlot className="mr-2 h-5 w-5" />
                        All Government Schemes
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setCurrentPage('caServices')}
                        className="font-semibold"
                    >
                        <Building className="mr-2 h-5 w-5" />
                        CA Services
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
