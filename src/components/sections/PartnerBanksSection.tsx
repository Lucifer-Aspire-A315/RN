import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const partnerLogos = Array.from({ length: 14 }, (_, i) => ({
  src: `https://placehold.co/150x75/e2e8f0/64748b?text=Bank+${i + 1}`,
  alt: `Partner Bank ${i + 1}`,
}));

export function PartnerBanksSection() {
  const allLogos = [...partnerLogos, ...partnerLogos]; // Duplicate for seamless scroll

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground">Our Extensive Network</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          We are proud to be associated with over 150+ leading Banks and NBFCs to find you the best financial solutions.
        </p>
        <div className="relative mt-12 w-full overflow-hidden">
          <div className="animate-scroll-infinite flex w-max gap-16">
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
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background"></div>
        </div>
      </div>
    </section>
  );
}
