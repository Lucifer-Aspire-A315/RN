
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LogIn, UserPlus, Handshake, Building } from 'lucide-react';

interface AuthSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'login' | 'signup';
}

export function AuthSelectionModal({ open, onOpenChange, mode }: AuthSelectionModalProps) {
  const title = mode === 'login' ? 'Log In' : 'Sign Up';
  const description = mode === 'login' 
    ? 'Please select your login type.'
    : 'How would you like to join RN FinTech?';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center items-center">
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {mode === 'login' && (
            <>
              <Button asChild variant="default" className="h-24 flex-col gap-2 text-base" onClick={() => onOpenChange(false)}>
                <Link href="/login">
                  <LogIn />
                  <span>User Login</span>
                   <span className="font-normal text-xs text-primary-foreground/80">For individual applicants</span>
                </Link>
              </Button>
              <Button asChild variant="secondary" className="h-24 flex-col gap-2 text-base" onClick={() => onOpenChange(false)}>
                <Link href="/partner-login">
                  <Handshake />
                  <span>Partner & Admin Login</span>
                   <span className="font-normal text-xs text-secondary-foreground/80">For DSA, Merchant, Referral, and Admin</span>
                </Link>
              </Button>
            </>
          )}
          {mode === 'signup' && (
            <>
              <Button asChild variant="default" className="h-24 flex-col gap-2 text-base" onClick={() => onOpenChange(false)}>
                <Link href="/signup">
                  <UserPlus />
                  <span>Create a User Account</span>
                  <span className="font-normal text-xs text-primary-foreground/80">Apply for loans and services</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col gap-2 text-base" onClick={() => onOpenChange(false)}>
                <Link href="/partner-signup">
                  <Building />
                  <span>Become a Partner</span>
                  <span className="font-normal text-xs text-muted-foreground">Join our network and grow with us</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
