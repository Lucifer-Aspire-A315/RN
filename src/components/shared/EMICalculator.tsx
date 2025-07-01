
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(10.5);
  const [loanTenure, setLoanTenure] = useState<number>(5);
  const [emi, setEmi] = useState<number>(0);
  const [displayedEmi, setDisplayedEmi] = useState<number>(0);

  const animationFrameRef = useRef<number>();

  const calculateEMI = useCallback(() => {
    const p = loanAmount;
    const r = interestRate / 12 / 100;
    const n = loanTenure * 12;

    if (p > 0 && r > 0 && n > 0) {
      const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setEmi(emiValue);
    } else {
      setEmi(0);
    }
  }, [loanAmount, interestRate, loanTenure]);

  useEffect(() => {
    calculateEMI();
  }, [calculateEMI]);

  useEffect(() => {
    const startValue = displayedEmi;
    const endValue = emi;
    const duration = 400; // Animation duration in ms
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = startValue + (endValue - startValue) * progress;
      setDisplayedEmi(currentValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emi]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setter(value === '' ? 0 : parseFloat(value));
  };
  
  const handleSliderChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (value: number[]) => {
      setter(value[0]);
  };


  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-1">
            <Label htmlFor="amount" className="font-medium text-foreground">Loan Amount</Label>
            <div className="relative w-32">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                <Input 
                  type="text" 
                  id="amount" 
                  value={loanAmount > 0 ? loanAmount.toLocaleString('en-IN') : ''} 
                  onChange={(e) => {
                      const value = e.target.value.replace(/,/g, '');
                      setLoanAmount(value === '' ? 0 : parseInt(value, 10));
                  }}
                  className="pl-6 pr-2 py-1 text-right font-semibold"
                  placeholder="e.g., 5,00,000"
                />
            </div>
        </div>
        <Slider value={[loanAmount]} onValueChange={handleSliderChange(setLoanAmount)} min={10000} max={10000000} step={10000} />
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
            <Label htmlFor="interest" className="font-medium text-foreground">Interest Rate</Label>
            <div className="relative w-32">
                <Input 
                  type="number" 
                  id="interest" 
                  value={interestRate} 
                  onChange={handleInputChange(setInterestRate)}
                  step="0.05"
                  className="pr-6 py-1 text-right font-semibold"
                  placeholder="e.g., 10.5"
                />
                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
            </div>
        </div>
        <Slider value={[interestRate]} onValueChange={handleSliderChange(setInterestRate)} min={5} max={25} step={0.05} />
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
            <Label htmlFor="tenure" className="font-medium text-foreground">Loan Tenure</Label>
             <div className="relative w-32">
                <Input 
                  type="number" 
                  id="tenure" 
                  value={loanTenure} 
                  onChange={handleInputChange(setLoanTenure)}
                  className="pr-16 py-1 text-right font-semibold"
                  placeholder="e.g., 5"
                />
                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Years</span>
            </div>
        </div>
        <Slider value={[loanTenure]} onValueChange={handleSliderChange(setLoanTenure)} min={1} max={30} step={1} />
      </div>
      <div id="emi-result" className="mt-8 text-center bg-primary/10 p-6 rounded-lg">
        <p className="text-muted-foreground">Your Monthly EMI</p>
        <p id="emi-value" className="text-4xl font-bold text-primary mt-2">
            ₹ {displayedEmi.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </p>
      </div>
    </div>
  );
}
