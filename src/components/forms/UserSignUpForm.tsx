
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
import { Loader2, UserPlus, Handshake, Eye, EyeOff } from 'lucide-react';
import { userSignUpAction } from '@/app/actions/authActions';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Combobox } from '@/components/ui/combobox';

interface UserSignUpFormProps {
  partners: { id: string; fullName: string; businessModel?: 'referral' | 'dsa' | 'merchant' }[];
}

export function UserSignUpForm({ partners }: UserSignUpFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const partnerOptions = partners.map(partner => ({
    value: partner.id,
    label: partner.fullName,
  }));

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
                    <FormItem className="flex flex-col">
                        <FormLabel className="flex items-center gap-2">
                        <Handshake className="w-4 h-4 text-muted-foreground" />
                        Referred by a Partner?
                        </FormLabel>
                        <FormControl>
                            <Combobox
                                options={partnerOptions}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Search partner name..."
                                notFoundMessage="No partner found."
                            />
                        </FormControl>
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
                    <div className="relative">
                      <FormControl>
                        <Input type={showPassword ? "text" : "password"} placeholder="Create a strong password" {...field} />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
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
                    <div className="relative">
                      <FormControl>
                        <Input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" {...field} />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
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
