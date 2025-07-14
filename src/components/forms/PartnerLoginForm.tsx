
"use client";

import React, { useState } from 'react';
import { partnerLoginAction } from '@/app/actions/authActions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, UserPlus, Store, Users, ShieldCheck, ArrowLeft } from 'lucide-react';
import { AuthForm } from './shared/AuthForm';
import { PartnerLoginSchema } from '@/lib/schemas';

type LoginType = 'dsa' | 'merchant' | 'referral' | 'admin';

const loginOptions = [
    { type: 'dsa' as LoginType, icon: UserPlus, title: "DSA Partner", description: "Login as a Direct Selling Agent." },
    { type: 'merchant' as LoginType, icon: Store, title: "Merchant Partner", description: "Login as a Merchant Partner." },
    { type: 'referral' as LoginType, icon: Users, title: "Referral Partner", description: "Login as a Referral Partner." },
    { type: 'admin' as LoginType, icon: ShieldCheck, title: "Admin", description: "Login as an Administrator." },
]

export function PartnerLoginForm() {
  const [selectedLogin, setSelectedLogin] = useState<LoginType | null>(null);

  if (!selectedLogin) {
    return (
         <Card className="max-w-3xl mx-auto shadow-xl">
             <CardHeader className="text-center">
                <LogIn className="w-12 h-12 mx-auto text-primary mb-2" />
                <CardTitle className="text-3xl">Partner & Admin Login</CardTitle>
                <CardDescription className="text-lg">Please select your login type to continue.</CardDescription>
             </CardHeader>
             <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                {loginOptions.map(opt => {
                    const Icon = opt.icon;
                    return (
                        <button
                            key={opt.type}
                            onClick={() => setSelectedLogin(opt.type)}
                            className="group flex flex-col items-center justify-center text-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            <Icon className="w-10 h-10 mb-3 text-muted-foreground transition-colors group-hover:text-primary" />
                            <span className="font-bold text-lg text-foreground">{opt.title}</span>
                            <span className="text-sm text-muted-foreground">{opt.description}</span>
                        </button>
                    )
                })}
             </CardContent>
             <CardFooter className="flex-col gap-2 pt-6 border-t text-center">
                <p className="text-sm text-muted-foreground">
                    Don&apos;t have a partner account?{' '}
                    <Link href="/partner-signup" className="font-medium text-primary hover:underline">
                    Sign up here
                    </Link>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                    Not a partner?{' '}
                    <Link href="/login" className="font-medium text-accent hover:underline">
                    User Login
                    </Link>
                </p>
             </CardFooter>
         </Card>
    )
  }

  const currentOption = loginOptions.find(opt => opt.type === selectedLogin);
  const Icon = currentOption?.icon || LogIn;

  return (
    <Card className="max-w-md mx-auto shadow-xl relative">
        <CardHeader className="text-center">
             <Button variant="ghost" size="sm" onClick={() => setSelectedLogin(null)} className="absolute top-4 left-4 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-1"/> Back
            </Button>
            <div className="flex justify-center text-primary pt-8">
                <Icon className="w-10 h-10" />
            </div>
            <CardTitle className="text-2xl">{currentOption?.title} Login</CardTitle>
            <CardDescription>Access your {currentOption?.type} account.</CardDescription>
        </CardHeader>
        <CardContent>
             <AuthForm
                schema={PartnerLoginSchema}
                submitAction={partnerLoginAction}
                defaultValues={{ email: '', password: '' }}
                buttonText="Login"
             />
              <div className="mt-4 text-right">
                <Button variant="link" asChild className="p-0 h-auto">
                    <Link href="/forgot-password">Forgot Password?</Link>
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}
