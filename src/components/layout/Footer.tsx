
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-50 border-t border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and About Section */}
          <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-md">
                <Image
                  src="/rnfintech.png"
                  alt="RN FinTech Logo"
                  width={40}
                  height={28}
                  priority
                />
              </div>
              <span className="font-bold text-lg text-white">FinTech</span>
            </div>
            <p className="mt-4 text-gray-400 text-sm text-center md:text-left">
              Your trusted partner in achieving your financial goals.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-semibold text-white">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Services Section */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-semibold text-white">Our Services</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/services/loans" className="text-gray-400 hover:text-primary transition-colors">
                  Loan Services
                </Link>
              </li>
              <li>
                <Link href="/services/ca-services" className="text-gray-400 hover:text-primary transition-colors">
                  CA Services
                </Link>
              </li>
               <li>
                <Link href="/services/government-schemes" className="text-gray-400 hover:text-primary transition-colors">
                  Government Schemes
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect With Us Section */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-semibold text-white">Connect With Us</h4>
            <address className="mt-4 space-y-2 text-sm not-italic">
              <p className="text-gray-400">
                Sunrise Apartment, A-101, Kalyan, Maharashtra 421301
              </p>
              <p>
                <a href="mailto:contact@rnfintech.com" className="text-gray-400 hover:text-primary transition-colors">
                  contact@rnfintech.com
                </a>
              </p>
            </address>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} RN FinTech. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
