
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function FormProgress({ currentStep, totalSteps, className }: FormProgressProps) {
    // Progress represents the percentage of steps *completed*.
    // On step 1 of 5 (index 0), progress is 0%.
    // On step 5 of 5 (index 4), progress is 80%, as 4 of 5 steps are complete.
    // This avoids the confusing "100% complete" message before submission.
    const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  
    return (
        <div className={cn("my-8", className)}>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-primary">Step {currentStep + 1} of {totalSteps}</span>
                <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
                <div
                    className="h-full rounded-full bg-primary shadow-md shadow-primary/50 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
