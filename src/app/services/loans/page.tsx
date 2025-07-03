
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { Home, User, Briefcase, CreditCardIcon, Cog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const loanServices = [
  {
    icon: <Home className="w-8 h-8" />,
    title: 'Home Loan (होम लोन)',
    description: 'Apne sapno ka ghar banayein hamare flexible home loan ke saath.',
    href: '/apply/home-loan',
    colorIndex: 1,
  },
  {
    icon: <User className="w-8 h-8" />,
    title: 'Personal Loan (व्यक्तिगत ऋण)',
    description: 'Shaadi, chuttiyan, ya kisi bhi zaroorat ke liye.',
    href: '/apply/personal-loan',
    colorIndex: 2,
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: 'Business Loan (व्यापार ऋण)',
    description: 'Apne business ko nayi unchaiyon tak le jayein.',
    href: '/apply/business-loan',
    colorIndex: 3,
  },
  {
    icon: <CreditCardIcon className="w-8 h-8" />,
    title: 'Credit Card (क्रेडिट कार्ड)',
    description: 'Premium credit cards ke saath offers aur rewards ka laabh uthayein.',
    href: '/apply/credit-card',
    colorIndex: 4,
  },
  {
    icon: <Cog className="w-8 h-8" />,
    title: 'Machinery Loan (मशीनरी ऋण)',
    description: 'Nayi machinery kharidein aur apne production ko badhayein.',
    href: '/apply/machinery-loan',
    colorIndex: 5,
  },
];

export default function LoanServicesPage() {
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
                <h1 className="text-3xl font-bold text-foreground">Loan Services</h1>
                <p className="mt-2 text-muted-foreground">Find the perfect financing solution for your needs.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {loanServices.map((service) => (
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
