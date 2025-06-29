
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import type { SetPageView } from '@/app/page';
import { HeroSlider } from './HeroSlider';

interface HeroSectionProps {
  setCurrentPage: SetPageView;
}

export function HeroSection({ setCurrentPage }: HeroSectionProps) {

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

            {/* Right Column: Image Slider */}
            <div className="relative flex justify-center items-center h-80 md:h-96 lg:h-[28rem]">
               <div className="absolute -bottom-4 w-4/5 h-8 bg-black/50 rounded-full blur-2xl animate-shadow-float" />
               <div className="animate-float">
                <HeroSlider setCurrentPage={setCurrentPage} />
               </div>
            </div>
        </div>
      </div>
    </section>
  );
}
