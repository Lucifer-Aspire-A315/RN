
"use client";

import React from 'react';
import { UserLoginSchema } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { userLoginAction } from '@/app/actions/authActions';
import Link from 'next/link';
import { AuthForm } from './shared/AuthForm';
import { Button } from '../ui/button';


export function UserLoginForm() {
  return (
    <Card className="max-w-md mx-auto shadow-xl">
        <CardHeader className="text-center">
            <LogIn className="w-12 h-12 mx-auto text-primary mb-2" />
            <CardTitle className="text-2xl">User Login</CardTitle>
            <CardDescription>Access your RN FinTech account.</CardDescription>
        </CardHeader>
        <CardContent>
            <AuthForm
                schema={UserLoginSchema}
                submitAction={userLoginAction}
                defaultValues={{ email: '', password: '' }}
                buttonText="Login"
            />
            <div className="mt-4 text-right">
                <Button variant="link" asChild className="p-0 h-auto">
                    <Link href="/forgot-password">Forgot Password?</Link>
                </Button>
            </div>
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
