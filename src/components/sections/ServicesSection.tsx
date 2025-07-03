
import { ServiceCard } from '@/components/shared/ServiceCard';
import { Home, User, Briefcase, CreditCardIcon, Cog, LandPlot, Building } from 'lucide-react'; 

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

const otherServices = [
    {
        icon: <LandPlot className="w-8 h-8" />,
        title: 'Government Schemes',
        description: 'Expert assistance for various government loan schemes like Mudra, PMEGP, etc.',
        href: '/services/government-schemes',
        colorIndex: 1,
    },
    {
        icon: <Building className="w-8 h-8" />,
        title: 'CA Services',
        description: 'GST, ITR filing, company incorporation, and other financial compliance services.',
        href: '/services/ca-services',
        colorIndex: 2,
    }
]

export function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground">Our Core Offerings (हमारी मुख्य सेवाएं)</h2>
        <p className="mt-2 text-muted-foreground">Aapki har zaroorat ke liye hamari suvidhayein.</p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
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
         <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-foreground">Specialized Financial Services</h3>
            <p className="mt-2 text-muted-foreground">We also provide expert guidance for government schemes and CA services.</p>
             <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {otherServices.map((service) => (
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
      </div>
    </section>
  );
}
