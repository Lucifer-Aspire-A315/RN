
"use client";

import React from 'react';
import { NewsTicker, type NewsTickerItem } from '../shared/NewsTicker';
import { Banknote, Factory, Users } from 'lucide-react';
import Link from 'next/link';

const schemeItems: NewsTickerItem[] = [
  { text: "PM Mudra Yojana", icon: Banknote },
  { text: "Stand-Up India Scheme", icon: Users },
  { text: "PMEGP (Khadi Board)", icon: Factory },
  { text: "PM Svanidhi Scheme", icon: Banknote },
  { text: "Credit Guarantee Scheme", icon: Factory },
];


export function GovernmentSchemeHighlights() {
  return (
    <section className="py-16 md:py-20 bg-secondary/20">
       <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground">Government Scheme Assistance</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          We provide expert guidance and assistance for a variety of government-backed loan schemes to empower entrepreneurs and small businesses.
        </p>
        <div className="mt-12">
            <Link href="/services/government-schemes">
                <NewsTicker items={schemeItems} />
            </Link>
        </div>
      </div>
    </section>
  );
}
