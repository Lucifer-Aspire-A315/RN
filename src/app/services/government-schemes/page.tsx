
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Banknote, Factory, Users, FileQuestion } from 'lucide-react';

const schemeServices = [
  {
    icon: <Banknote className="w-8 h-8" />,
    title: 'PM Mudra Yojana',
    description: 'Loans up to ₹10 lakh for non-corporate, non-farm small/micro enterprises.',
    href: '/apply/government-scheme/pm-mudra-yojana',
    colorIndex: 1,
  },
  {
    icon: <Factory className="w-8 h-8" />,
    title: 'PMEGP (Khadi Board)',
    description: 'Credit-linked subsidy for new self-employment ventures in the non-farm sector.',
    href: '/apply/government-scheme/pmegp-khadi-board',
    colorIndex: 2,
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Stand-Up India',
    description: 'Loans between ₹10 lakh and ₹1 Crore for SC/ST and women entrepreneurs.',
    href: '/apply/government-scheme/stand-up-india',
    colorIndex: 3,
  },
  {
    icon: <FileQuestion className="w-8 h-8" />,
    title: 'Other Scheme',
    description: 'Apply for another government scheme not listed here.',
    href: '/apply/government-scheme/other',
    colorIndex: 4,
  },
];

export default function GovernmentSchemesPage() {
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
                <h1 className="text-3xl font-bold text-foreground">Government Loan Schemes</h1>
                <p className="mt-2 text-muted-foreground">Empowering entrepreneurs and small businesses with government-backed financing.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {schemeServices.map((service) => (
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
