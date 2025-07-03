
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Building, FileSpreadsheet, BookOpenCheck, Building2, PiggyBank, ClipboardCheck } from 'lucide-react';

const caServices = [
  { href: "/apply/accounting-bookkeeping", icon: <BookOpenCheck className="w-8 h-8" />, title: "Accounting & Bookkeeping", description: "Manage finances and keep records.", colorIndex: 1 },
  { href: "/apply/gst-service", icon: <FileSpreadsheet className="w-8 h-8" />, title: "GST Registration and Filing", description: "Complete GST solutions.", colorIndex: 2 },
  { href: "/apply/company-incorporation", icon: <Building2 className="w-8 h-8" />, title: "Company Incorporation", description: "Register your company.", colorIndex: 3 },
  { href: "/apply/audit-assurance", icon: <ClipboardCheck className="w-8 h-8" />, title: "Audit and Assurance", description: "Ensure financial accuracy.", colorIndex: 4 },
  { href: "/apply/itr-filing", icon: <FileSpreadsheet className="w-8 h-8" />, title: "Income Tax Filing & Consultation", description: "Expert ITR filing and planning.", colorIndex: 5 },
  { href: "/apply/financial-advisory", icon: <PiggyBank className="w-8 h-8" />, title: "Financial Advisory", description: "Strategic advice to grow.", colorIndex: 1 },
];

export default function CAServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-secondary/30 py-16 md:py-20">
        <div className="container mx-auto px-6">
            <Button asChild variant="ghost" className="mb-8 -ml-4">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground">Chartered Accountant Services</h1>
                <p className="mt-2 text-muted-foreground">Expert financial and compliance services to meet your needs.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {caServices.map((service) => (
                <ServiceCard 
                  key={service.title}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  colorIndex={service.colorIndex as 1 | 2 | 3 | 4 | 5}
                  href={service.href}
                />
              ))}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
