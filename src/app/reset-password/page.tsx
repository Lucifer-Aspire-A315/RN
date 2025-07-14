
"use client";

import React, { useState, Suspense } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, KeyRound, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { resetPasswordAction } from '@/app/actions/authActions';
import Link from 'next/link';

const ResetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

function ResetPasswordComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  
  React.useEffect(() => {
    if (!token) {
      setError("Invalid or missing password reset token. Please request a new link.");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    setIsSubmitting(true);
    setError(null);

    const result = await resetPasswordAction(token, data.password);

    if (result.success) {
      toast({
        title: "Password Reset Successful",
        description: result.message,
      });
      setIsSuccess(true);
    } else {
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description: result.message,
      });
      setError(result.message);
      setIsSubmitting(false);
    }
  };
  
  const renderContent = () => {
    if (error) {
       return (
        <div className="text-center text-destructive">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <p className="font-semibold">{error}</p>
          <Button asChild variant="link" className="mt-4">
            <Link href="/forgot-password">Request a new link</Link>
          </Button>
        </div>
      );
    }

    if (isSuccess) {
       return (
        <div className="text-center">
            <CheckCircle className="w-12 h-12 mx-auto text-success mb-4" />
            <p className="font-semibold text-lg">Your password has been reset successfully.</p>
            <Button asChild className="mt-6">
                <Link href="/login">Proceed to Login</Link>
            </Button>
        </div>
       )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                    <Input type="password" placeholder="Enter your new password" {...field} />
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
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                    <Input type="password" placeholder="Confirm your new password" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
            </Button>
            </form>
        </Form>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12">
        <Card className="w-full max-w-md mx-auto shadow-xl">
          <CardHeader className="text-center">
            <KeyRound className="w-12 h-12 mx-auto text-primary" />
            <CardTitle className="text-2xl">Set a New Password</CardTitle>
            {!error && !isSuccess && <CardDescription>Please enter and confirm your new password below.</CardDescription>}
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordComponent />
        </Suspense>
    )
}

