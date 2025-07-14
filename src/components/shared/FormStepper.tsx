
"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface FormStepperProps {
  steps: string[];
  currentStep: number;
  highestValidatedStep: number;
  onStepClick: (stepIndex: number) => void;
  className?: string;
}

export function FormStepper({ steps, currentStep, highestValidatedStep, onStepClick, className }: FormStepperProps) {
  return (
    <div className={cn("mb-12", className)}>
      <div className="flex items-center">
        {steps.map((label, index) => {
          const isCompleted = index < highestValidatedStep;
          const isActive = index === currentStep;
          const isReachable = index <= highestValidatedStep;

          return (
            <React.Fragment key={index}>
              <div
                className={cn(
                  "flex flex-col items-center gap-2",
                  isReachable ? 'cursor-pointer' : 'cursor-not-allowed'
                )}
                onClick={() => onStepClick(index)}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                    isActive ? "bg-primary border-primary text-primary-foreground scale-110" :
                    isCompleted ? "bg-primary/20 border-primary text-primary" :
                    "bg-muted border-border text-muted-foreground"
                  )}
                >
                  {isCompleted && !isActive ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <p
                  className={cn(
                    "text-xs text-center font-medium transition-colors duration-300 max-w-24",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {label}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-2 transition-colors duration-300",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
