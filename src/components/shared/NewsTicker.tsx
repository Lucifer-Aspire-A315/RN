
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface NewsTickerItem {
  text: React.ReactNode;
  textColor?: string;
  bgColor?: string;
}

interface NewsTickerProps {
  items: NewsTickerItem[];
  duration?: number;
  onContainerClick: () => void;
}

export function NewsTicker({ items, duration = 5000, onContainerClick }: NewsTickerProps) {
  const [index, setIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const goToNext = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIndex((prevIndex) => (prevIndex + 1) % items.length);
      setIsFadingOut(false);
    }, 300);
  }, [items.length]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(goToNext, duration);
  }, [duration, goToNext]);

  const goToIndex = (newIndex: number) => {
    if (newIndex === index) return;
    setIsFadingOut(true);
    setTimeout(() => {
      setIndex(newIndex);
      setIsFadingOut(false);
    }, 300);
    resetTimer();
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resetTimer]);

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[index];

  return (
    <div
      onClick={onContainerClick}
      className="group relative w-full cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl rounded-xl"
    >
      <div className="flex items-center justify-center min-h-[14rem] overflow-hidden rounded-xl">
        <div
          className={cn(
            'transition-opacity duration-300 ease-in-out w-full h-full',
            isFadingOut ? 'opacity-0' : 'opacity-100'
          )}
        >
          {currentItem.text}
        </div>
      </div>

       <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                goToIndex(i);
              }}
              className={cn(
                'h-1.5 w-1.5 rounded-full transition-all duration-300',
                i === index ? 'w-4 bg-primary' : 'bg-muted-foreground/50 hover:bg-muted-foreground'
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
    </div>
  );
}
