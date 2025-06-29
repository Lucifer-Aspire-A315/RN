
import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// --- How to Add Your Partner Logos ---
// 1. Add your logo images to the `public/logos` folder.
// 2. Replace the placeholder entries below with your actual logo information.
//    - src: The path to your logo, starting with `/logos/`. For example: `/logos/your-bank-logo.png`
//    - alt: The name of the bank for accessibility.
// To add more or fewer logos, simply add or remove objects from this array.
const partnerLogos = [
  {
    src: '/logos/hdfc.png',
    alt: 'HDFC Bank',
  },
  {
    src: '/logos/icici.png',
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
    src: '/logos/kotak.png',
    alt: 'Kotak Mahindra',
  },
   {
    src: '/logos/idfc.png',
    alt: 'IDFC Bank',
  },
  {
    src: '/logos/adityabirla.png',
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
    src: '/logos/indusind.png',
    alt: 'IndusInd Bank',
  },
  {
    src: '/logos/chalomandalam.png',
    alt: 'Chalomandalam Bank'
  },
  {
    src: '/logos/dbs.png',
    alt: 'DBS Bank'
  }
   
];

export function PartnerBanksSection() {
  // We duplicate the logos to create a seamless, infinite scrolling effect.
  const allLogos = [...partnerLogos, ...partnerLogos]; 

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground">Our Extensive Network</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          We are proud to be associated with over 150+ leading Banks and NBFCs to find you the best financial solutions.
        </p>
        <div className="relative mt-12 w-full overflow-hidden group">
          <div className="flex w-max animate-scroll-infinite group-hover:[animation-play-state:paused]">
            {allLogos.map((logo, index) => (
              <div key={index} className="flex-shrink-0 w-48 h-20 flex items-center justify-center p-2 mx-4 transition-opacity duration-300 opacity-60 hover:opacity-100">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={150}
                  height={75}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-transparent to-secondary pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
