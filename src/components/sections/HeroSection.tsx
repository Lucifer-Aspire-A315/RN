
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import type { SetPageView } from '@/app/page';
import { NewsTicker } from '@/components/shared/NewsTicker';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

interface HeroSectionProps {
  setCurrentPage: SetPageView;
}

const governmentSchemes = [
  { 
    text: "PM Mudra Yojana (PMMY)",
    bgColor: 'bg-primary/5',
    textColor: 'text-primary',
  },
  { 
    text: "Stand-Up India Scheme",
    bgColor: 'bg-accent/5',
    textColor: 'text-accent',
  },
  { 
    text: "PMEGP",
    bgColor: 'bg-green-600/5',
    textColor: 'text-green-800 dark:text-green-400'
  },
  { 
    text: "PM SVANidhi Scheme",
    bgColor: 'bg-orange-600/5',
    textColor: 'text-orange-800 dark:text-orange-400'
  },
  { 
    text: "PM Vishwakarma Scheme",
    bgColor: 'bg-sky-600/5',
    textColor: 'text-sky-800 dark:text-sky-400'
  }
];

export function HeroSection({ setCurrentPage }: HeroSectionProps) {
    const handleNewsTickerClick = () => {
        setCurrentPage('governmentSchemes')
    }
    
  return (
    <section
      id="home"
      className="relative bg-gradient-to-b from-primary/5 via-background to-background pt-16 pb-8 md:pt-24 md:pb-12 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-72 h-72 bg-accent/10 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50 animate-[float_8s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full translate-x-1/3 translate-y-1/3 opacity-50 animate-[float-delay_10s_ease-in-out_infinite]"></div>
      
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
                        className="text-primary hover:text-accent"
                    >
                        How It Works
                    </Button>
                </div>
            </div>

            {/* Right Column: Image */}
            <div className="relative flex justify-center items-center">
                 <div className="absolute w-full h-full bg-primary/20 rounded-full blur-3xl -z-10 animate-[float_12s_ease-in-out_infinite_2s]"></div>
                 <Image
                    src="https://storage.googleapis.com/devo-st-production-0b44b825-program-images/1721759603094_hero-image.png"
                    alt="Financial advisor with a family"
                    width={550}
                    height={450}
                    priority
                    className="object-contain"
                    data-ai-hint="family financial advisor"
                />
            </div>
        </div>

        {/* Government Schemes Ticker below */}
        <div className="mt-20 md:mt-24">
             <div
                onClick={handleNewsTickerClick}
                role="button"
                aria-label="Click to explore Government Scheme Loans"
                className="group cursor-pointer rounded-xl bg-card border border-border p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20"
                >
                <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold text-foreground">Featured Government Schemes</h3>
                </div>
                <NewsTicker items={governmentSchemes} onContainerClick={handleNewsTickerClick} />
            </div>
        </div>
      </div>
    </section>
  );
}
