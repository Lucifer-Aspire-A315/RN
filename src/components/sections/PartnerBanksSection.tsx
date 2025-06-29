
import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const partnerLogos = [
  {
    src: '/logos/hdfcbank.png',
    alt: 'HDFC Bank',
  },
  {
    src: '/logos/icicibank.png',
    alt: 'ICICI Bank',
  },
  {
    src: '/logos/bajaj.png',
    alt: 'Bajaj Finserv',
  },
  {
    src: '/logos/axis.png',
    alt: 'Axis Bank',
  },
   {
    src: '/logos/kotakbank.png',
    alt: 'Kotak Mahindra',
  },
   {
    src: '/logos/idfc.png',
    alt: 'IDFC Bank',
  },
  {
    src: '/logos/adityabirlabank.png',
    alt: 'Aditya Birla',
  },
  {
    src: '/logos/sbibank.png',
    alt: 'State Bank of India',
  },
  {
    src: '/logos/muthoot.png',
    alt: 'Muthoot Finance',
  },
  {
    src: '/logos/shriram.png',
    alt: 'Shriram Finance',
  },
  {
    src: '/logos/tatacapital.png',
    alt: 'Tata Capital',
  },
  {
    src: '/logos/indusindbank.png',
    alt: 'IndusInd Bank',
  },
  {
    src: '/logos/chola.png',
    alt: 'Chalomandalam Bank'
  },
  {
    src: '/logos/dbsbank.png',
    alt: 'DBS Bank'
  }
];

export function PartnerBanksSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground">Our Extensive Network</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          We are proud to be associated with over 150+ leading Banks and NBFCs to find you the best financial solutions.
        </p>
        <div className="mt-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 md:gap-6">
            {partnerLogos.map((logo, index) => (
              <div
                key={index}
                className="bg-background p-4 rounded-lg flex items-center justify-center h-24 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-primary"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={60}
                  className="object-contain max-h-full max-w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
