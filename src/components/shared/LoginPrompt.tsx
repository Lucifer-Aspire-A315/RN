
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginPromptProps {
    onBack: () => void;
}

export function LoginPrompt({ onBack }: LoginPromptProps) {
  const { openAuthModal } = useAuth();
  
  return (
    <section className="bg-secondary py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <Button variant="ghost" onClick={onBack} className="inline-flex items-center mb-8 text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <div className="max-w-xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center p-6">
              <CardTitle className="text-2xl">Authentication Required</CardTitle>
              <CardDescription className="mt-2">You need to be logged in to start an application.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center p-6 pt-0">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => openAuthModal('login')}>
                <LogIn className="mr-2" /> Login
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => openAuthModal('signup')}>
                <UserPlus className="mr-2" /> Create Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
