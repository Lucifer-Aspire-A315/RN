
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Banknote, Factory, Users, FileQuestion } from 'lucide-react';

const schemeOptions = [
  { href: '/apply/government-scheme/pm-mudra-yojana', icon: Banknote, title: "PM Mudra Yojana", description: "Loans up to ₹10 lakh for micro enterprises." },
  { href: '/apply/government-scheme/pmegp-khadi-board', icon: Factory, title: "PMEGP (Khadi Board)", description: "Credit-linked subsidy for new ventures." },
  { href: '/apply/government-scheme/stand-up-india', icon: Users, title: "Stand-Up India", description: "Loans for SC/ST and women entrepreneurs." },
  { href: '/apply/government-scheme/other', icon: FileQuestion, title: "Other Scheme", description: "Apply for another government scheme." },
];

export function PartnerGovSchemeApplication() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schemeOptions.map(opt => {
            const Icon = opt.icon;
            return (
                 <Button key={opt.href} asChild size="lg" variant="outline" className="justify-start h-auto py-4 text-left">
                    <Link href={opt.href}>
                        <Icon className="mr-4 h-6 w-6" />
                        <div>
                            <p className="font-semibold">{opt.title}</p>
                            <p className="font-normal text-muted-foreground text-sm">{opt.description}</p>
                        </div>
                    </Link>
                </Button>
            )
        })}
    </div>
  );
}
