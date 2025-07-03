
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-foreground text-background border-t border-primary/50 shadow-[0_-4px_24px_0_rgba(76,175,80,0.07)] rounded-t-2xl">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-primary/20">
          {/* Logo and About Section */}
          <div className="p-4 md:p-8 flex flex-col items-center text-center">
            <div className="bg-background rounded-lg p-2 inline-block">
              <Image
                src="/rnfintech.png"
                alt="RN FinTech Logo"
                width={45}
                height={30}
                priority
              />
            </div>
            <p className="mt-4 text-secondary text-sm">
              Your trusted partner in achieving your financial goals.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="p-4 md:p-8">
            <h4 className="font-semibold text-accent">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-background hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-background hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-background hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-background hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Services Section */}
          <div className="p-4 md:p-8">
            <h4 className="font-semibold text-accent">Our Services</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/#services" className="text-background hover:text-primary transition-colors">
                  Home Loan
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-background hover:text-primary transition-colors">
                  Personal Loan
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-background hover:text-primary transition-colors">
                  Business Loan
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-background hover:text-primary transition-colors">
                  Credit Card
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-background hover:text-primary transition-colors">
                  Machinery Loan
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect With Us Section */}
          <div className="p-4 md:p-8">
            <h4 className="font-semibold text-accent">Connect With Us</h4>
            <address className="mt-4 space-y-1 text-sm not-italic">
              <p className="text-secondary">
                Sunrise Apartment, A-101, Santoshi Mata Rd, near Yashoda Apartment, near KDMC Commissioners Bunglow, Syndicate, Kalyan, Maharashtra 421301
              </p>
              <p>
                <a href="mailto:contact@rnfintech.com" className="text-background hover:text-primary transition-colors">
                  contact@rnfintech.com
                </a>
              </p>
            </address>
          </div>
        </div>
        <div className="mt-12 border-t border-primary/50 pt-8 text-center">
          <p className="text-sm text-secondary">
            &copy; {new Date().getFullYear()} RN FinTech. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
