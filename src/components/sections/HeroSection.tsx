
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Users, Building, Percent } from 'lucide-react';

// Custom hook to detect when an element is in view
const useElementInView = (options: IntersectionObserverInit) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);

        const currentRef = containerRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [containerRef, options]);

    return [containerRef, isVisible] as const;
};

// Component for the animated statistic
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


export function HeroSection() {
  return (
    <section id="home" className="relative bg-secondary/20 pt-16 pb-12 md:pt-24 md:pb-20 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text Content */}
          <div className="text-center lg:text-left">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight animate-fade-in-up"
              style={{ animationDelay: '100ms', opacity: 0 }}
            >
              Your Trusted Partner for <br />
              <span className="text-primary">Financial Success</span>
            </h1>
            <p
              className="mt-6 text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 animate-fade-in-up"
              style={{ animationDelay: '300ms', opacity: 0 }}
            >
              Empowering your dreams with transparent, technology-driven financial services. From personal loans to business solutions, we're here to help you grow.
            </p>
            
            <div
              className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4 animate-fade-in-up"
              style={{ animationDelay: '500ms', opacity: 0 }}
            >
              <Button
                size="lg"
                className="cta-button shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Our Services
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
             <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-y-8 gap-x-4 text-left">
                <AnimatedStat title="Partner Banks & NBFCs" endValue={150} suffix="+" icon={<Building className="w-6 h-6" />} delay={700} />
                <AnimatedStat title="Approval Rate" endValue={98} suffix="%" icon={<Percent className="w-6 h-6" />} delay={900} />
                <AnimatedStat title="Happy Customers" endValue={10000} suffix="+" icon={<Users className="w-6 h-6" />} delay={1100} />
             </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative flex justify-center items-center h-80 lg:h-[30rem]">
            <div className="absolute inset-x-0 top-1/2 h-4/5 bg-primary/20 rounded-full blur-3xl -translate-y-1/2" />
            <Image
              src="https://placehold.co/600x400.png"
              alt="Financial growth and success"
              width={600}
              height={400}
              data-ai-hint="financial success growth"
              className="relative w-full max-w-lg lg:max-w-none h-auto object-contain rounded-2xl shadow-2xl animate-zoom-in-out border-4 border-background"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
