
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
              <Button asChild variant="default" className="h-20 flex-col gap-2">
                <Link href="/login" onClick={() => onOpenChange(false)}>
                  <LogIn />
                  <span>User Login</span>
                </Link>
              </Button>
              <Button asChild variant="secondary" className="h-20 flex-col gap-2">
                <Link href="/partner-login" onClick={() => onOpenChange(false)}>
                  <Handshake />
                  <span>Partner & Admin Login</span>
                </Link>
              </Button>
            </>
          )}
          {mode === 'signup' && (
            <>
              <Button asChild variant="default" className="h-20 flex-col gap-2">
                <Link href="/signup" onClick={() => onOpenChange(false)}>
                  <UserPlus />
                  <span>Create a User Account</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link href="/partner-signup" onClick={() => onOpenChange(false)}>
                  <Building />
                  <span>Become a Partner</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
