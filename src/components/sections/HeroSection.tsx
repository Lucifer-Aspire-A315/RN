
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import type { SetPageView } from '@/app/page';
import Image from 'next/image';

interface HeroSectionProps {
  setCurrentPage: SetPageView;
}

export function HeroSection({ setCurrentPage }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative bg-gradient-to-b from-primary/5 via-background to-background pt-16 pb-8 md:pt-24 md:pb-12 overflow-hidden"
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
      </div>
    </section>
  );
}
