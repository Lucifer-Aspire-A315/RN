
"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export interface NewsTickerItem {
  text: string;
  icon: React.ElementType;
}

interface NewsTickerProps {
  items: NewsTickerItem[];
}

export function NewsTicker({ items }: NewsTickerProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div
      className="group relative w-full cursor-pointer overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
      }}
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex-shrink-0 w-80 mx-4">
              <div className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-all duration-300 hover:bg-primary/5 hover:border-primary hover:shadow-lg">
                <div className="flex-shrink-0 rounded-full bg-primary/10 p-3 text-primary">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground whitespace-nowrap">{item.text}</p>
                  <p className="text-xs text-muted-foreground flex items-center">
                    Learn More <ArrowRight className="w-3 h-3 ml-1" />
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
