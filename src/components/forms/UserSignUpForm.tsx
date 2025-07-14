
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSignUpSchema, type UserSignUpFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus, Handshake } from 'lucide-react';
import { userSignUpAction } from '@/app/actions/authActions';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface UserSignUpFormProps {
  partners: { id: string; fullName: string; businessModel?: 'referral' | 'dsa' | 'merchant' }[];
}

const getBusinessModelDisplay = (model?: 'referral' | 'dsa' | 'merchant'): string => {
    switch(model) {
        case 'dsa': return 'DSA';
        case 'merchant': return 'Merchant';
        case 'referral': return 'Referral';
        default: return 'Partner';
    }
}

export function UserSignUpForm({ partners }: UserSignUpFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<UserSignUpFormData>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobileNumber: '',
      password: '',
      confirmPassword: '',
      partnerId: '',
    },
  });

  async function onSubmit(data: UserSignUpFormData) {
    setIsSubmitting(true);
    try {
      const result = await userSignUpAction(data);
      if (result.success && result.user) {
        toast({
          title: "Sign Up Successful",
          description: result.message || "Your account has been created.",
        });
        login(result.user);
        form.reset();
        router.push('/dashboard'); 
      } else {
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: result.message || "An unknown error occurred.",
        });
        if (result.errors) {
           Object.entries(result.errors).forEach(([fieldName, errorMessages]) => {
            form.setError(fieldName as keyof UserSignUpFormData, {
              type: 'manual',
              message: (errorMessages as string[]).join(', '),
            });
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign Up Error",
        description: "An unexpected error occurred during sign up.",
      });
      console.error("User sign up error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
     <Card className="max-w-md mx-auto shadow-xl">
      <CardHeader className="text-center">
        <UserPlus className="w-12 h-12 mx-auto text-primary mb-2" />
        <CardTitle className="text-2xl">Create Your Account</CardTitle>
        <CardDescription>Join RN FinTech to access our financial services.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                    <Input placeholder="Your Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
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
                name="mobileNumber"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                    <Input type="tel" placeholder="10-digit mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            {partners.length > 0 && (
              <FormField
                control={form.control}
                name="partnerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                        <Handshake className="w-4 h-4 text-muted-foreground" />
                        Select Your Partner
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={cn(!field.value && "text-muted-foreground")}>
                            <SelectValue placeholder="Select the partner who referred you..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      {partners.map((partner) => (
                          <SelectItem key={partner.id} value={partner.id}>
                              <div className="flex justify-between items-center w-full">
                                  <span>{partner.fullName}</span>
                                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                                      {getBusinessModelDisplay(partner.businessModel)}
                                  </span>
                              </div>
                          </SelectItem>
                      ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Create Password</FormLabel>
                    <FormControl>
                    <Input type="password" placeholder="Create a strong password" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                    <Input type="password" placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <Button type="submit" className="w-full cta-button" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing Up...</> : 'Sign Up Now'}
            </Button>
            </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-4 pt-6 border-t">
        <p className="text-sm text-muted-foreground text-center">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
            Login here
            </Link>
        </p>
        <p className="text-sm text-muted-foreground text-center">
            Want to become a partner?{' '}
            <Link href="/partner-signup" className="font-medium text-secondary-foreground hover:text-primary transition-colors">
            Partner Sign-up
            </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
