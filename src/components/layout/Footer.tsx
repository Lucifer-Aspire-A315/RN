
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export function Footer() {
  const { resolvedTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState('/lightmode-logo.png'); // Default to light mode logo

  useEffect(() => {
    // Set the logo based on the resolved theme, which handles 'system' preference
    setLogoSrc(resolvedTheme === 'dark' ? '/darkmode-logo.png' : '/lightmode-logo.png');
  }, [resolvedTheme]);


  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and About Section */}
          <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start">
             <Link href="/" className="flex-shrink-0 flex items-center gap-2 no-underline">
                <Image
                  src={logoSrc}
                  alt="RN FinTech Logo"
                  width={150}
                  height={40}
                  priority
                  className="h-10"
                />
            </Link>
            <p className="mt-4 text-muted-foreground text-sm text-center md:text-left">
              Your trusted partner in achieving your financial goals.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Services Section */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-semibold text-foreground">Our Services</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/services/loans" className="text-muted-foreground hover:text-primary transition-colors">
                  Loan Services
                </Link>
              </li>
              <li>
                <Link href="/services/ca-services" className="text-muted-foreground hover:text-primary transition-colors">
                  CA Services
                </Link>
              </li>
               <li>
                <Link href="/services/government-schemes" className="text-muted-foreground hover:text-primary transition-colors">
                  Government Schemes
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect With Us Section */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-semibold text-foreground">Connect With Us</h4>
            <address className="mt-4 space-y-2 text-sm not-italic">
              <p className="text-muted-foreground">
                Sunrise Apartment, A-101, Kalyan, Maharashtra 421301
              </p>
              <p>
                <a href="mailto:admin@rnfintech.com" className="text-muted-foreground hover:text-primary transition-colors">
                  contact@rnfintech.com
                </a>
              </p>
            </address>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} RN FinTech. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
