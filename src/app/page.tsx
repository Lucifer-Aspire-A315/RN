
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSlider } from '@/components/sections/HeroSlider';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { EMICalculatorSection } from '@/components/sections/EMICalculatorSection';
import { Skeleton } from '@/components/ui/skeleton'; 
import { useAuth } from '@/contexts/AuthContext';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { PartnerBanksSection } from '@/components/sections/PartnerBanksSection';
import { GovernmentSchemeHighlights } from '@/components/sections/GovernmentSchemeHighlights';


export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const { isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    setIsClient(true);

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#home' || hash === '#services' || hash === '#calculator' || hash === '#how-it-works') {
        setTimeout(() => {
          const element = document.getElementById(hash.substring(1));
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange, false);
    if (window.location.hash) {
       setTimeout(() => {
        const elementId = window.location.hash.substring(1);
        const element = document.getElementById(elementId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
       }, 100);
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange, false);
    };
  }, []);


  if (!isClient || isAuthLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Skeleton className="h-16 w-full" />
        <main className="flex-grow container mx-auto px-6 py-8 space-y-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </main>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
          <HeroSlider />
          <PartnerBanksSection />
          <GovernmentSchemeHighlights />
          <ServicesSection />
          <HowItWorksSection />
          <EMICalculatorSection />
      </main>
      <Footer />
    </div>
  );
}
