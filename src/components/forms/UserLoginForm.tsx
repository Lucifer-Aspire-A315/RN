
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserLoginSchema, type UserLoginFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn } from 'lucide-react';
import { userLoginAction } from '@/app/actions/authActions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function UserLoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const form = useForm<UserLoginFormData>({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: UserLoginFormData) {
    setIsSubmitting(true);
    try {
      const result = await userLoginAction(data);
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
            form.setError(fieldName as keyof UserLoginFormData, {
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
      console.error("User login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-md mx-auto shadow-xl">
        <CardHeader className="text-center">
            <LogIn className="w-12 h-12 mx-auto text-primary mb-2" />
            <CardTitle className="text-2xl">User Login</CardTitle>
            <CardDescription>Access your RN FinTech account.</CardDescription>
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
        <CardFooter className="flex-col gap-4 pt-6 border-t">
            <p className="text-sm text-muted-foreground text-center">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up here
                </Link>
            </p>
            <p className="text-sm text-muted-foreground text-center">
                Are you a partner?{' '}
                <Link href="/partner-login" className="font-medium text-secondary-foreground hover:text-primary transition-colors">
                Partner Login
                </Link>
            </p>
        </CardFooter>
    </Card>
  );
}
