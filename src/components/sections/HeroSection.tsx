"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import type { SetPageView } from '@/app/page';
import Image from 'next/image';
import { NewsTicker, type NewsTickerItem } from '@/components/shared/NewsTicker';
import { Banknote, Factory, Users } from 'lucide-react';

interface HeroSectionProps {
  setCurrentPage: SetPageView;
}

const governmentSchemes: { icon: React.ReactNode; title: string; description: string; }[] = [
  {
    icon: <Banknote className="w-6 h-6 text-primary" />,
    title: "PM Mudra Yojana (PMMY)",
    description: "Financial support for non-corporate, non-farm small/micro enterprises with loans up to ₹10 lakh."
  },
  {
    icon: <Factory className="w-6 h-6 text-teal-500" />,
    title: "PMEGP (Khadi Board)",
    description: "Credit-linked subsidies for new self-employment ventures and projects in the non-farm sector."
  },
  {
    icon: <Users className="w-6 h-6 text-indigo-500" />,
    title: "Stand-Up India",
    description: "Promoting entrepreneurship among women and SC/ST communities with bank loans from ₹10 lakh to ₹1 Crore."
  }
];

const tickerItems: NewsTickerItem[] = governmentSchemes.map(scheme => ({
  text: (
    <div className="flex items-center gap-4 text-left">
      <div className="flex-shrink-0">{scheme.icon}</div>
      <div>
        <h4 className="font-bold text-foreground">{scheme.title}</h4>
        <p className="text-sm text-muted-foreground">{scheme.description}</p>
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
                 <Image
                    src="/right-side.png"
                    alt="Financial advisor with a family"
                    width={550}
                    height={450}
                    priority
                    className="object-contain"
                    data-ai-hint="family financial advisor"
                />
            </div>
        </div>
        
        {/* Government Schemes Showcase */}
        <div className="mt-16 md:mt-24">
            <h3 className="text-center text-2xl font-bold text-foreground mb-2">Explore Government Schemes</h3>
            <p className="text-center text-muted-foreground mb-6">We provide expert assistance for various government loan schemes.</p>
            <div className="max-w-2xl mx-auto">
                 <NewsTicker items={tickerItems} duration={5000} onContainerClick={handleSchemesClick} />
            </div>
        </div>
      </div>
    </section>
  );
}
