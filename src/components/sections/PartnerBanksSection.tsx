
"use client"

import React from 'react';
import Image from 'next/image';

const partnerLogos = [
  { src: '/logos/hdfc-logo.png', alt: 'HDFC Bank', name: 'HDFC Bank' },
  { src: '/logos/icici-logo.png', alt: 'ICICI Bank', name: 'ICICI Bank' },
  { src: '/logos/bajaj-logo.png', alt: 'Bajaj Finserv', name: 'Bajaj Finserv' },
  { src: '/logos/axis-logo.png', alt: 'Axis Bank', name: 'Axis Bank' },
  { src: '/logos/kotak-logo.png', alt: 'Kotak Mahindra', name: 'Kotak Bank' },
  { src: '/logos/idfc-logo.png', alt: 'IDFC Bank', name: 'IDFC First Bank' },
  { src: '/logos/adityabirla-logo.png', alt: 'Aditya Birla', name: 'Aditya Birla' },
  { src: '/logos/sbi-logo.png', alt: 'State Bank of India', name: 'SBI' },
  { src: '/logos/muthoot-logo.png', alt: 'Muthoot Finance', name: 'Muthoot Finance' },
  { src: '/logos/shriram-logo.png', alt: 'Shriram Finance', name: 'Shriram Finance' },
  { src: '/logos/tatac-logo.png', alt: 'Tata Capital', name: 'Tata Capital' },
  { src: '/logos/indusind-logo.png', alt: 'IndusInd Bank', name: 'IndusInd Bank' },
  { src: '/logos/chola-logo.png', alt: 'Chola', name: 'Cholamandalam' },
  { src: '/logos/dbs-logo.png', alt: 'DBS Bank', name: 'DBS Bank' }
];

export function PartnerBanksSection() {
  return (
    <section className="relative py-12 md:py-16 bg-secondary overflow-hidden">
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl font-bold text-foreground">Our Extensive Network</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          We are proud to be associated with over 150+ leading Banks and NBFCs to find you the best financial solutions.
        </p>
        <div 
          className="group relative mt-8 w-full overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          }}
        >
          <div className="flex w-max animate-scroll-infinite group-hover:[animation-play-state:paused]">
            {[...partnerLogos, ...partnerLogos].map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-44 mx-8 flex items-center justify-center h-28"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={160}
                  height={112}
                  className="h-full w-auto object-contain grayscale transition-all duration-300 ease-in-out hover:grayscale-0 hover:scale-110 hover:drop-shadow-xl"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
