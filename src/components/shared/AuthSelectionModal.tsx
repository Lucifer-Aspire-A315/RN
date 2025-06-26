
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
import { Separator } from '@/components/ui/separator';

interface AuthSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthSelectionModal({ open, onOpenChange }: AuthSelectionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="text-center items-center">
          <DialogTitle className="text-2xl">Welcome to RN FinTech</DialogTitle>
          <DialogDescription>
            Choose an option below to log in or create a new account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
             <h4 className="text-sm font-semibold text-muted-foreground px-1">For Individuals</h4>
             <div className="grid grid-cols-2 gap-4">
                <Button asChild variant="default" className="h-20 flex-col gap-2">
                    <Link href="/login" onClick={() => onOpenChange(false)}>
                        <LogIn />
                        <span>User Login</span>
                    </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col gap-2">
                    <Link href="/signup" onClick={() => onOpenChange(false)}>
                        <UserPlus />
                        <span>Create Account</span>
                    </Link>
                </Button>
             </div>
          </div>
          <Separator className="my-4" />
           <div className="space-y-2">
             <h4 className="text-sm font-semibold text-muted-foreground px-1">For Partners & Admins</h4>
             <div className="grid grid-cols-2 gap-4">
                <Button asChild variant="secondary" className="h-20 flex-col gap-2">
                    <Link href="/partner-login" onClick={() => onOpenChange(false)}>
                        <Handshake />
                        <span>Partner Login</span>
                    </Link>
                </Button>
                 <Button asChild variant="outline" className="h-20 flex-col gap-2">
                    <Link href="/partner-signup" onClick={() => onOpenChange(false)}>
                        <Building />
                        <span>Become a Partner</span>
                    </Link>
                </Button>
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
