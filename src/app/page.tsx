"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { EMICalculatorSection } from '@/components/sections/EMICalculatorSection';
import { HomeLoanApplicationForm } from '@/components/forms/HomeLoanApplicationForm';
import { PersonalLoanApplicationForm } from '@/components/forms/PersonalLoanApplicationForm';
import { BusinessLoanApplicationForm } from '@/components/forms/BusinessLoanApplicationForm';
import { CreditCardApplicationForm } from '@/components/forms/CreditCardApplicationForm';
import { MachineryLoanApplicationForm } from '@/components/forms/MachineryLoanApplicationForm';
import { GovernmentSchemesPage } from '@/components/sections/GovernmentSchemesPage';
import { GovernmentSchemeLoanApplicationForm } from '@/components/forms/GovernmentSchemeLoanApplicationForm';
import { CAServicesPage } from '@/components/sections/CAServicesPage';
import { GstServiceApplicationForm } from '@/components/forms/GstServiceApplicationForm';
import { ItrFilingConsultationForm } from '@/components/forms/ItrFilingConsultationForm';
import { AccountingBookkeepingForm } from '@/components/forms/AccountingBookkeepingForm';
import { CompanyIncorporationForm } from '@/components/forms/CompanyIncorporationForm';
import { FinancialAdvisoryForm } from '@/components/forms/FinancialAdvisoryForm';
import { AuditAndAssuranceForm } from '@/components/forms/AuditAndAssuranceForm';
import { Skeleton } from '@/components/ui/skeleton'; 
import { useAuth } from '@/contexts/AuthContext';
import { LoginPrompt } from '@/components/shared/LoginPrompt';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { CTASection } from '@/components/sections/CTASection';
import { PartnerBanksSection } from '@/components/sections/PartnerBanksSection';

export type PageView = 
  'main' | 
  'homeLoan' | 
  'personalLoan' | 
  'businessLoan' | 
  'creditCard' | 
  'machineryLoan' |
  'governmentSchemes' | 
  'governmentSchemeApplication' | 
  'caServices' | 
  'gstServiceForm' | 
  'itrFilingConsultationForm' | 
  'accountingBookkeepingForm' | 
  'companyIncorporationForm' | 
  'financialAdvisoryForm' |
  'auditAndAssuranceForm';

export type SetPageView = React.Dispatch<React.SetStateAction<PageView>>;
export type SetSelectedGovernmentScheme = React.Dispatch<React.SetStateAction<string | undefined>>;
export type SetOtherGovernmentSchemeName = React.Dispatch<React.SetStateAction<string | undefined>>;

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageView>('main');
  const [isClient, setIsClient] = useState(false);
  const [selectedGovernmentScheme, setSelectedGovernmentScheme] = useState<string | undefined>();
  const [otherGovernmentSchemeName, setOtherGovernmentSchemeName] = useState<string | undefined>();
  
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // This useEffect was removed as it forced logged-in users to the dashboard.
  // Users can now access the homepage while logged in.

  useEffect(() => {
    setIsClient(true);

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#home' || hash === '#services' || hash === '#calculator' || hash === '#how-it-works') {
        if(currentPage !== 'main') setCurrentPage('main');
        setTimeout(() => {
          const element = document.getElementById(hash.substring(1));
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange, false);
    if (window.location.hash) {
       setCurrentPage('main');
       setTimeout(() => {
        const elementId = window.location.hash.substring(1);
        const element = document.getElementById(elementId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
       }, 100);
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange, false);
    };
  }, [currentPage]);

  useEffect(() => {
    if (currentPage !== 'main') {
      window.scrollTo(0, 0);
    }
  }, [currentPage]);

  // Show a loading skeleton only while authentication status is being checked.
  if (!isClient || isAuthLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Skeleton className="h-16 w-full" />
        <main className="flex-grow container mx-auto px-6 py-8 space-y-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </main>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  
  const renderPageContent = () => {
    const handleBackToMain = () => setCurrentPage('main');

    const ProtectedFormComponent = ({ children, onBack }: { children: React.ReactNode; onBack: () => void }) => {
      if (!currentUser) {
        return <LoginPrompt onBack={onBack} />;
      }
      return <>{children}</>;
    };

    switch (currentPage) {
      case 'main':
        return (
          <>
            <HeroSection setCurrentPage={setCurrentPage} />
            <PartnerBanksSection />
            <ServicesSection setCurrentPage={setCurrentPage} />
            <HowItWorksSection />
            <EMICalculatorSection />
            <CTASection />
          </>
        );
      case 'homeLoan':
        return <ProtectedFormComponent onBack={handleBackToMain}><HomeLoanApplicationForm onBack={handleBackToMain} /></ProtectedFormComponent>;
      case 'personalLoan':
        return <ProtectedFormComponent onBack={handleBackToMain}><PersonalLoanApplicationForm onBack={handleBackToMain} /></ProtectedFormComponent>;
      case 'businessLoan':
        return <ProtectedFormComponent onBack={handleBackToMain}><BusinessLoanApplicationForm onBack={handleBackToMain} /></ProtectedFormComponent>;
      case 'creditCard':
        return <ProtectedFormComponent onBack={handleBackToMain}><CreditCardApplicationForm onBack={handleBackToMain} /></ProtectedFormComponent>;
      case 'machineryLoan':
        return <ProtectedFormComponent onBack={handleBackToMain}><MachineryLoanApplicationForm onBack={handleBackToMain} /></ProtectedFormComponent>;
      case 'governmentSchemes':
        return <GovernmentSchemesPage
                  setCurrentPage={setCurrentPage}
                  setSelectedGovernmentScheme={setSelectedGovernmentScheme}
                  setOtherGovernmentSchemeName={setOtherGovernmentSchemeName}
                />;
      case 'governmentSchemeApplication':
        if (!selectedGovernmentScheme) {
          setCurrentPage('governmentSchemes'); 
          return <p>Please select a scheme first.</p>;
        }
        return (
          <ProtectedFormComponent onBack={() => setCurrentPage('governmentSchemes')}>
            <GovernmentSchemeLoanApplicationForm
              onBack={() => setCurrentPage('governmentSchemes')}
              selectedScheme={selectedGovernmentScheme}
              otherSchemeName={otherGovernmentSchemeName}
            />
          </ProtectedFormComponent>
        );
      case 'caServices':
        return <CAServicesPage setCurrentPage={setCurrentPage} />;
      case 'gstServiceForm':
        return <ProtectedFormComponent onBack={() => setCurrentPage('caServices')}><GstServiceApplicationForm onBack={() => setCurrentPage('caServices')} /></ProtectedFormComponent>;
      case 'itrFilingConsultationForm':
        return <ProtectedFormComponent onBack={() => setCurrentPage('caServices')}><ItrFilingConsultationForm onBack={() => setCurrentPage('caServices')} /></ProtectedFormComponent>;
      case 'accountingBookkeepingForm':
        return <ProtectedFormComponent onBack={() => setCurrentPage('caServices')}><AccountingBookkeepingForm onBack={() => setCurrentPage('caServices')} /></ProtectedFormComponent>;
      case 'companyIncorporationForm':
        return <ProtectedFormComponent onBack={() => setCurrentPage('caServices')}><CompanyIncorporationForm onBack={() => setCurrentPage('caServices')} /></ProtectedFormComponent>;
      case 'financialAdvisoryForm':
        return <ProtectedFormComponent onBack={() => setCurrentPage('caServices')}><FinancialAdvisoryForm onBack={() => setCurrentPage('caServices')} /></ProtectedFormComponent>;
      case 'auditAndAssuranceForm':
        return <ProtectedFormComponent onBack={() => setCurrentPage('caServices')}><AuditAndAssuranceForm onBack={() => setCurrentPage('caServices')} /></ProtectedFormComponent>;
      default:
        return <p>Page not found.</p>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header setCurrentPage={setCurrentPage} />
      <main className="flex-grow">
        {renderPageContent()}
      </main>
      <Footer />
    </div>
  );
}
