
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
    src: '/logos/sbi.png',
    alt: 'State Bank of India',
  },
  {
    src: '/logos/axis.png',
    alt: 'Axis Bank',
  },
   {
    src: 'https://placehold.co/150x75/e2e8f0/64748b?text=Bank+5',
    alt: 'Partner Bank 5',
  },
   {
    src: 'https://placehold.co/150x75/e2e8f0/64748b?text=Bank+6',
    alt: 'Partner Bank 6',
  },
   {
    src: 'https://placehold.co/150x75/e2e8f0/64748b?text=Bank+7',
    alt: 'Partner Bank 7',
  },
   {
    src: 'https://placehold.co/150x75/e2e8f0/64748b?text=Bank+8',
    alt: 'Partner Bank 8',
  },
   {
    src: 'https://placehold.co/150x75/e2e8f0/64748b?text=Bank+9',
    alt: 'Partner Bank 9',
  },
   {
    src: 'https://placehold.co/150x75/e2e8f0/64748b?text=Bank+10',
    alt: 'Partner Bank 10',
  },
   {
    src: 'https://placehold.co/150x75/e2e8f0/64748b?text=Bank+11',
    alt: 'Partner Bank 11',
  },
  {
    src: 'https://placehold.co/150x75/e2e8f0/64748b?text=Bank+12',
    alt: 'Partner Bank 12',
  },
];

export function PartnerBanksSection() {
  // We duplicate the logos to create a seamless, infinite scrolling effect.
  const allLogos = [...partnerLogos, ...partnerLogos]; 

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground">Our Extensive Network</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          We are proud to be associated with over 150+ leading Banks and NBFCs to find you the best financial solutions.
        </p>
        <div className="relative mt-12 w-full overflow-hidden group">
          <div className="flex w-max gap-16 animate-scroll-infinite group-hover:[animation-play-state:paused]">
            {allLogos.map((logo, index) => (
              <div key={index} className="flex-shrink-0">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={150}
                  height={75}
                  className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
