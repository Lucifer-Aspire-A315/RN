
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PartnerLoginSchema, type PartnerLoginFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn, UserPlus, Store, Users, ShieldCheck, ArrowLeft } from 'lucide-react';
import { partnerLoginAction } from '@/app/actions/authActions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

type LoginType = 'dsa' | 'merchant' | 'referral' | 'admin';

const loginOptions = [
    { type: 'dsa' as LoginType, icon: UserPlus, title: "DSA Partner", description: "Login as a Direct Selling Agent." },
    { type: 'merchant' as LoginType, icon: Store, title: "Merchant Partner", description: "Login as a Merchant Partner." },
    { type: 'referral' as LoginType, icon: Users, title: "Referral Partner", description: "Login as a Referral Partner." },
    { type: 'admin' as LoginType, icon: ShieldCheck, title: "Admin", description: "Login as an Administrator." },
]

export function PartnerLoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const [selectedLogin, setSelectedLogin] = useState<LoginType | null>(null);

  const form = useForm<PartnerLoginFormData>({
    resolver: zodResolver(PartnerLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: PartnerLoginFormData) {
    setIsSubmitting(true);
    try {
      const result = await partnerLoginAction(data);
      if (result.success && result.user) {
        toast({
          title: "Login Successful",
          description: result.message || "Welcome back!",
        });
        login(result.user);
        form.reset();
        if (result.user.isAdmin) {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: result.message || "An unknown error occurred.",
        });
        if (result.errors) {
           Object.entries(result.errors).forEach(([fieldName, errorMessages]) => {
            form.setError(fieldName as keyof PartnerLoginFormData, {
              type: 'manual',
              message: (errorMessages as string[]).join(', '),
            });
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An unexpected error occurred during login.",
      });
      console.error("Partner login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

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
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email ID</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="Your password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" className="w-full cta-button" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging In...</> : 'Login'}
                </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
