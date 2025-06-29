
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PageView, SetPageView } from '@/app/page';

interface HeroSliderProps {
  setCurrentPage: SetPageView;
}

const slides = [
  {
    title: 'Home Loans',
    description: 'Build your dream home with our flexible and affordable home loans.',
    imageSrc: 'https://placehold.co/600x400.png',
    dataAiHint: 'happy family home',
    targetPage: 'homeLoan' as PageView,
  },
  {
    title: 'Personal Loans',
    description: 'Fulfill your personal aspirations, from travel to weddings, with our quick loans.',
    imageSrc: 'https://placehold.co/600x400.png',
    dataAiHint: 'person traveling',
    targetPage: 'personalLoan' as PageView,
  },
  {
    title: 'Business Loans',
    description: 'Expand your business and fuel your growth with our tailored financial solutions.',
    imageSrc: 'https://placehold.co/600x400.png',
    dataAiHint: 'business owner office',
    targetPage: 'businessLoan' as PageView,
  },
];

export function HeroSlider({ setCurrentPage }: HeroSliderProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleNext = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <div className="relative w-full h-full max-w-2xl mx-auto">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            'absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out',
            index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          )}
        >
          <div className="relative bg-background/50 rounded-2xl shadow-2xl w-full h-full p-4 border border-primary/10 backdrop-blur-sm">
            <Image
              src={slide.imageSrc}
              alt={slide.title}
              width={600}
              height={400}
              data-ai-hint={slide.dataAiHint}
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-xl" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h3 className="text-2xl font-bold">{slide.title}</h3>
              <p className="mt-1 text-white/90">{slide.description}</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setCurrentPage(slide.targetPage)}
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              index === activeSlide ? 'w-6 bg-primary' : 'bg-muted-foreground/50'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
