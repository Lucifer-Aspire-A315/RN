
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthModalController } from '@/components/shared/AuthModalController';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { GoogleAnalytics } from '@/components/shared/GoogleAnalytics';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'RN FinTech - Aapke Sapno Ka Loan',
  description: 'Quick & Easy Financial Solutions. Your trusted partner in achieving your financial goals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Suspense>
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        </Suspense>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
            <AuthModalController />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
