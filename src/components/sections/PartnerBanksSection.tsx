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
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground">Our Extensive Network</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          We are proud to be associated with over 150+ leading Banks and NBFCs to find you the best financial solutions.
        </p>
        <div className="mt-12">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-5">
            {partnerLogos.map((logo, index) => (
              <div
                key={index}
                className="bg-card rounded-lg overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border"
              >
                <div className="bg-background flex items-center justify-center p-4 aspect-video">
                   <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={140}
                      height={60}
                      className="h-full w-full object-contain"
                    />
                </div>
                <div className="p-3 bg-card border-t">
                     <p className="text-sm font-semibold text-foreground truncate">{logo.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
