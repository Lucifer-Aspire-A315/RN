
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GstServiceApplicationForm } from '@/components/forms/GstServiceApplicationForm';
import { ItrFilingConsultationForm } from '@/components/forms/ItrFilingConsultationForm';
import { AccountingBookkeepingForm } from '@/components/forms/AccountingBookkeepingForm';
import { CompanyIncorporationForm } from '@/components/forms/CompanyIncorporationForm';
import { FinancialAdvisoryForm } from '@/components/forms/FinancialAdvisoryForm';
import { AuditAndAssuranceForm } from '@/components/forms/AuditAndAssuranceForm';

type FormType = 'gst' | 'itr' | 'accounting' | 'incorporation' | 'advisory' | 'audit';

const caServicesList = [
  { id: "accounting", title: "Accounting & Bookkeeping", description: "Manage finances and keep records.", formType: "accounting" as FormType },
  { id: "gst-registration", title: "GST Registration and Filing", description: "Complete GST solutions.", formType: "gst" as FormType },
  { id: "incorporation", title: "Company Incorporation", description: "Register your company.", formType: "incorporation" as FormType },
  { id: "audit", title: "Audit and Assurance", description: "Ensure financial accuracy.", formType: "audit" as FormType },
  { id: "itr", title: "Income Tax Filing & Consultation", description: "Expert ITR filing and planning.", formType: "itr" as FormType },
  { id: "advisory", title: "Financial Advisory", description: "Strategic advice to grow.", formType: "advisory" as FormType },
];


export function PartnerCAServiceApplication() {
    const [activeForm, setActiveForm] = useState<FormType | null>(null);

    const handleBackToMenu = () => {
        setActiveForm(null);
    };

    if (activeForm) {
        switch (activeForm) {
            case 'gst': return <GstServiceApplicationForm onBack={handleBackToMenu} />;
            case 'itr': return <ItrFilingConsultationForm onBack={handleBackToMenu} />;
            case 'accounting': return <AccountingBookkeepingForm onBack={handleBackToMenu} />;
            case 'incorporation': return <CompanyIncorporationForm onBack={handleBackToMenu} />;
            case 'advisory': return <FinancialAdvisoryForm onBack={handleBackToMenu} />;
            case 'audit': return <AuditAndAssuranceForm onBack={handleBackToMenu} />;
            default: return null;
        }
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caServicesList.map(service => (
                 <Button key={service.id} onClick={() => setActiveForm(service.formType)} size="lg" variant="outline" className="justify-start h-auto py-4 text-left">
                    <div>
                        <p className="font-semibold">{service.title}</p>
                        <p className="font-normal text-muted-foreground text-sm">{service.description}</p>
                    </div>
                </Button>
            ))}
        </div>
    );
}
