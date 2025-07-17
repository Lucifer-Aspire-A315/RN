
import { getApplicationDetails } from '@/app/actions/applicationActions';
import { Header } from '@/components/layout/Header';
import type { UserApplication } from '@/lib/types';
import { redirect } from 'next/navigation';
import { checkSessionAction } from '@/app/actions/authActions';

import { HomeLoanApplicationForm } from '@/components/forms/HomeLoanApplicationForm';
import { PersonalLoanApplicationForm } from '@/components/forms/PersonalLoanApplicationForm';
import { BusinessLoanApplicationForm } from '@/components/forms/BusinessLoanApplicationForm';
import { CreditCardApplicationForm } from '@/components/forms/CreditCardApplicationForm';
import { MachineryLoanApplicationForm } from '@/components/forms/MachineryLoanApplicationForm';
import { GovernmentSchemeLoanApplicationForm } from '@/components/forms/GovernmentSchemeLoanApplicationForm';
import { GstServiceApplicationForm } from '@/components/forms/GstServiceApplicationForm';
import { ItrFilingConsultationForm } from '@/components/forms/ItrFilingConsultationForm';
import { AccountingBookkeepingForm } from '@/components/forms/AccountingBookkeepingForm';
import { CompanyIncorporationForm } from '@/components/forms/CompanyIncorporationForm';
import { FinancialAdvisoryForm } from '@/components/forms/FinancialAdvisoryForm';
import { AuditAndAssuranceForm } from '@/components/forms/AuditAndAssuranceForm';


interface AdminEditApplicationPageProps {
  params: { id: string };
  searchParams: { category?: UserApplication['serviceCategory'] };
}

export default async function AdminEditApplicationPage({ params, searchParams }: AdminEditApplicationPageProps) {
  const { id } = params;
  const { category } = searchParams;

  if (!category) {
    return <div>Error: Service category not specified.</div>;
  }
  
  try {
    const applicationData = await getApplicationDetails(id, category);
    const user = await checkSessionAction();

    if (!applicationData || !user?.isAdmin) {
       return <div>Error: Application not found or you do not have permission to edit it.</div>;
    }
    
    const initialData = applicationData.formData;
    
    const renderForm = () => {
      const commonProps = { initialData, applicationId: id, mode: 'edit' as const };
      switch (applicationData.applicationType) {
          case 'Home Loan': return <HomeLoanApplicationForm {...commonProps} />;
          case 'Personal Loan': return <PersonalLoanApplicationForm {...commonProps} />;
          case 'Business Loan': return <BusinessLoanApplicationForm {...commonProps} />;
          case 'Credit Card': return <CreditCardApplicationForm {...commonProps} />;
          case 'Machinery Loan': return <MachineryLoanApplicationForm {...commonProps} />;
          case 'GST Service Application': return <GstServiceApplicationForm {...commonProps} />;
          case 'ITR Filing & Consultation': return <ItrFilingConsultationForm {...commonProps} />;
          case 'Accounting & Bookkeeping Service': return <AccountingBookkeepingForm {...commonProps} />;
          case 'Company Incorporation': return <CompanyIncorporationForm {...commonProps} />;
          case 'Financial Advisory Service': return <FinancialAdvisoryForm {...commonProps} />;
          case 'Audit and Assurance Service': return <AuditAndAssuranceForm {...commonProps} />;
          case 'PM Mudra Yojana':
          case 'PMEGP (Khadi Board)':
          case 'Stand-Up India':
          case 'Other':
              return <GovernmentSchemeLoanApplicationForm {...commonProps} />;
          default:
              return <div>Unsupported application type for editing: {applicationData.applicationType}</div>;
      }
    }

    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {renderForm()}
        </main>
      </div>
    );

  } catch (error: any) {
      if (error.message.includes('Forbidden')) {
          redirect('/dashboard');
      }
      if (error.message.includes('Unauthorized')) {
          redirect('/login');
      }
      return <div>Error: Application not found or an unexpected error occurred.</div>;
  }
}
