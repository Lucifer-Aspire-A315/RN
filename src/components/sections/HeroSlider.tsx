
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Users, Building, Percent } from 'lucide-react';
import { useElementInView } from '@/hooks/use-element-in-view';
import type { PageView, SetPageView } from '@/app/page';
import { useRouter } from 'next/navigation';

const AnimatedStat = ({ title, endValue, duration = 2000, suffix = '', icon, delay }: { title: string, endValue: number, duration?: number, suffix?: string, icon: React.ReactNode, delay: number }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useElementInView({ threshold: 0.5, triggerOnce: true });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (inView) {
      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * endValue));
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(step);
        }
      };
      animationFrameRef.current = requestAnimationFrame(step);
    }
    return () => {
        if(animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };
  }, [inView, endValue, duration]);

  return (
    <div ref={ref} className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${delay}ms`, opacity: 0 }}>
      <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full text-primary">
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold text-foreground">
          {count.toLocaleString('en-IN')}{suffix}
        </p>
        <p className="text-sm text-muted-foreground leading-tight">{title}</p>
      </div>
    </div>
  );
};


const slides = [
  {
    key: 'main',
    title: <>Your Trusted Partner for <br /><span className="text-primary">Financial Success</span></>,
    description: "Empowering your dreams with transparent, technology-driven financial services. From personal loans to business solutions, we're here to help you grow.",
    imageSrc: '/right-side.png',
    dataAiHint: 'financial growth',
    ctaButtonText: 'Explore Our Services',
    ctaAction: 'scroll' as const,
    ctaTarget: '#services',
    secondaryButtonText: 'How It Works',
    secondaryAction: 'scroll' as const,
    secondaryTarget: '#how-it-works',
    stats: [
        { title: "Partner Banks & NBFCs", endValue: 150, suffix: "+", icon: <Building className="w-6 h-6" />, delay: 700 },
        { title: "Approval Rate", endValue: 98, suffix: "%", icon: <Percent className="w-6 h-6" />, delay: 900 },
        { title: "Happy Customers", endValue: 10000, suffix: "+", icon: <Users className="w-6 h-6" />, delay: 1100 },
    ]
  },
  {
    key: 'loans',
    title: <>Flexible Loans for <br /><span className="text-accent">Every Need</span></>,
    description: "Whether it's for a new home, a personal goal, or business expansion, find the perfect loan with competitive rates and easy processing.",
    imageSrc: '/hero-loan.png',
    dataAiHint: 'loan approval',
    ctaButtonText: 'View Loan Options',
    ctaAction: 'scroll' as const,
    ctaTarget: '#services',
    secondaryButtonText: 'EMI Calculator',
    secondaryAction: 'scroll' as const,
    secondaryTarget: '#calculator',
  },
  {
    key: 'ca-services',
    title: <>Expert CA Services for <br /><span className="text-blue-500">Business Compliance</span></>,
    description: "Stay compliant and focused on your business. We offer GST registration, ITR filing, and complete financial management services.",
    imageSrc: '/hero-ca.png',
    dataAiHint: 'financial planning',
    ctaButtonText: 'Explore CA Services',
    ctaAction: 'setView' as const,
    ctaTarget: 'caServices',
    secondaryButtonText: 'Contact Us',
    secondaryAction: 'navigate' as const,
    secondaryTarget: '/contact',
  },
   {
    key: 'gov-schemes',
    title: <>Unlock Growth with <br /><span className="text-emerald-500">Government Schemes</span></>,
    description: "We provide expert guidance and assistance for a variety of government-backed loan schemes to empower entrepreneurs and small businesses.",
    imageSrc: '/hero-govt.png',
    dataAiHint: 'small business',
    ctaButtonText: 'View Schemes',
    ctaAction: 'setView' as const,
    ctaTarget: 'governmentSchemes',
    secondaryButtonText: 'Learn More',
    secondaryAction: 'scroll' as const,
    secondaryTarget: '#how-it-works',
  },
];


const SlideContent = ({ slide, isActive, onNavClick }: { slide: (typeof slides)[0], isActive: boolean, onNavClick: (action: string, target: string) => void }) => {
  return (
    <div className={cn("absolute inset-0 transition-opacity duration-1000 ease-in-out", isActive ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <div className="container mx-auto px-6 relative z-10 h-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center h-full">
                <div className="text-center lg:text-left">
                    <h1
                        className={cn("text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight", isActive ? "animate-fade-in-up" : "")}
                        style={{ animationDelay: '100ms', opacity: isActive ? 1 : 0 }}
                    >
                        {slide.title}
                    </h1>
                    <p
                        className={cn("mt-6 text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0", isActive ? "animate-fade-in-up" : "")}
                        style={{ animationDelay: '300ms', opacity: isActive ? 1 : 0 }}
                    >
                        {slide.description}
                    </p>
                    
                    <div
                        className={cn("mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4", isActive ? "animate-fade-in-up" : "")}
                        style={{ animationDelay: '500ms', opacity: isActive ? 1 : 0 }}
                    >
                        <Button
                            size="lg"
                            className="cta-button shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                            onClick={() => onNavClick(slide.ctaAction, slide.ctaTarget)}
                        >
                            {slide.ctaButtonText}
                        </Button>
                        <Button
                            variant="ghost"
                            size="lg"
                            onClick={() => onNavClick(slide.secondaryAction, slide.secondaryTarget)}
                            className="text-primary hover:text-primary hover:bg-primary/10"
                        >
                            {slide.secondaryButtonText}
                        </Button>
                    </div>
                    {slide.stats && (
                         <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-y-8 gap-x-4 text-left">
                            {slide.stats.map(stat => (
                                <AnimatedStat key={stat.title} {...stat} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative flex justify-center items-center h-80 lg:h-[30rem]">
                    <div className="absolute inset-x-0 top-1/2 h-4/5 bg-primary/20 rounded-full blur-3xl -translate-y-1/2" />
                    <div className={cn("relative", isActive ? "animate-float" : "")}>
                        <Image
                            src={slide.imageSrc}
                            alt={slide.description}
                            width={600}
                            height={400}
                            data-ai-hint={slide.dataAiHint}
                            className={cn("relative w-full max-w-lg lg:max-w-none h-auto object-contain rounded-2xl shadow-2xl border-4 border-background", isActive ? "opacity-100" : "opacity-0")}
                            style={{ animation: isActive ? "fade-in-up 0.8s ease-out forwards" : "none", animationDelay: '400ms'}}
                            priority={isActive}
                        />
                         <div className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/50 rounded-full blur-2xl", isActive ? "animate-shadow-float" : "")} />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};


interface HeroSliderProps {
    setCurrentPage: SetPageView;
}

export function HeroSlider({ setCurrentPage }: HeroSliderProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const router = useRouter();

  const handleNext = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const handleNavClick = (action: string, target: string) => {
    switch (action) {
      case 'setView':
        setCurrentPage(target as PageView);
        break;
      case 'scroll':
        const elementId = target.substring(1);
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'navigate':
        router.push(target);
        break;
    }
  };


  useEffect(() => {
    const timer = setInterval(handleNext, 7000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <section id="home" className="relative bg-secondary/20 pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative h-[65vh] min-h-[600px] lg:min-h-[500px]">
            {slides.map((slide, index) => (
                <SlideContent key={slide.key} slide={slide} isActive={index === activeSlide} onNavClick={handleNavClick} />
            ))}
        </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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
    </section>
  );
}
