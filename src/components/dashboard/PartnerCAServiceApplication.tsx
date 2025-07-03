
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const caServicesList = [
  { href: "/apply/accounting-bookkeeping", title: "Accounting & Bookkeeping", description: "Manage finances and keep records." },
  { href: "/apply/gst-service", title: "GST Registration and Filing", description: "Complete GST solutions." },
  { href: "/apply/company-incorporation", title: "Company Incorporation", description: "Register your company." },
  { href: "/apply/audit-assurance", title: "Audit and Assurance", description: "Ensure financial accuracy." },
  { href: "/apply/itr-filing", title: "Income Tax Filing & Consultation", description: "Expert ITR filing and planning." },
  { href: "/apply/financial-advisory", title: "Financial Advisory", description: "Strategic advice to grow." },
];


export function PartnerCAServiceApplication() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caServicesList.map(service => (
                 <Button key={service.href} asChild size="lg" variant="outline" className="justify-start h-auto py-4 text-left">
                    <Link href={service.href}>
                        <div>
                            <p className="font-semibold">{service.title}</p>
                            <p className="font-normal text-muted-foreground text-sm">{service.description}</p>
                        </div>
                    </Link>
                </Button>
            ))}
        </div>
    );
}
