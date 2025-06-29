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
    <section className="relative py-12 md:py-16 bg-[#2D3A3A] overflow-hidden">
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl font-bold text-primary-foreground">Our Extensive Network</h2>
        <p className="mt-4 text-lg text-secondary max-w-2xl mx-auto">
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
                className="flex-shrink-0 w-48 mx-4 flex items-center justify-center h-20"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={160}
                  height={90}
                  className="h-full w-auto object-contain transition-all duration-300 ease-in-out opacity-80 hover:opacity-100 hover:scale-110 hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
