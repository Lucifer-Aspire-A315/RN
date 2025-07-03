
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, User, Briefcase, CreditCardIcon, Cog } from 'lucide-react';

const loanOptions = [
    { href: '/apply/home-loan', icon: Home, title: 'Home Loan', description: 'For property purchase or construction' },
    { href: '/apply/personal-loan', icon: User, title: 'Personal Loan', description: 'For personal needs like weddings, travel' },
    { href: '/apply/business-loan', icon: Briefcase, title: 'Business Loan', description: 'For business expansion or working capital' },
    { href: '/apply/credit-card', icon: CreditCardIcon, title: 'Credit Card', description: 'Apply for a new credit card' },
    { href: '/apply/machinery-loan', icon: Cog, title: 'Machinery Loan', description: 'Purchase new equipment for your business' }
]

export function PartnerLoanApplication() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loanOptions.map(opt => {
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
