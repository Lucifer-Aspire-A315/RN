
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and About Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2">
               <Image
                src="/rnfintech.png"
                alt="RN FinTech Logo"
                width={40}
                height={28}
                priority
              />
              <span className="font-bold text-xl text-foreground">RN FinTech</span>
            </div>
            <p className="mt-4 text-muted-foreground text-sm">
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
                <a href="mailto:contact@rnfintech.com" className="text-muted-foreground hover:text-primary transition-colors">
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
