"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export interface NewsTickerItem {
  text: string;
}

interface NewsTickerProps {
  items: NewsTickerItem[];
  onContainerClick: () => void;
}

export function NewsTicker({ items, onContainerClick }: NewsTickerProps) {
  if (!items || items.length === 0) {
    return null;
  }

  // The 'animation-play-state' property is not directly available in Tailwind by default, so we add a class
  // `group-hover:[animation-play-state:paused]` which is a valid arbitrary property in modern Tailwind.
  return (
    <div
      onClick={onContainerClick}
      className="group relative w-full bg-primary/10 border-y border-primary/20 cursor-pointer overflow-hidden flex items-center"
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {/* We duplicate the items to create a seamless loop */}
        {[...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center mx-6 h-12">
            <Sparkles className="w-5 h-5 mr-3 text-accent flex-shrink-0" />
            <span className="text-sm font-medium text-foreground whitespace-nowrap">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
