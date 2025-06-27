
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


interface EditApplicationPageProps {
  params: { id: string };
  searchParams: { category?: UserApplication['serviceCategory'] };
}

export default async function EditApplicationPage({ params, searchParams }: EditApplicationPageProps) {
  const user = await checkSessionAction();
  if (!user) {
    redirect('/login');
  }

  const { id } = params;
  const { category } = searchParams;

  if (!category) {
    return <div>Error: Service category not specified.</div>;
  }
  
  // getApplicationDetails action has its own security to ensure only the submitter or an admin can access it.
  const applicationData = await getApplicationDetails(id, category);

  if (!applicationData) {
     return <div>Error: Application not found or you do not have permission to edit it.</div>;
  }
  
  const initialData = applicationData.formData;
  
  const renderForm = () => {
    switch (applicationData.applicationType) {
        // Loan Forms
        case 'Home Loan':
            return <HomeLoanApplicationForm initialData={initialData} applicationId={id} mode="edit" />;
        case 'Personal Loan':
            return <PersonalLoanApplicationForm initialData={initialData} applicationId={id} mode="edit" />;
        case 'Business Loan':
            return <BusinessLoanApplicationForm initialData={initialData} applicationId={id} mode="edit" />;
        case 'Credit Card':
            return <CreditCardApplicationForm initialData={initialData} applicationId={id} mode="edit" />;
        case 'Machinery Loan':
            return <MachineryLoanApplicationForm initialData={initialData} applicationId={id} mode="edit" />;
        
        // CA Service Forms
        case 'GST Service Application':
            return <GstServiceApplicationForm initialData={initialData} applicationId={id} mode="edit" />;
        case 'ITR Filing & Consultation':
            return <ItrFilingConsultationForm initialData={initialData} applicationId={id} mode="edit" />;
        case 'Accounting & Bookkeeping Service':
            return <AccountingBookkeepingForm initialData={initialData} applicationId={id} mode="edit" />;
        case 'Company Incorporation':
            return <CompanyIncorporationForm initialData={initialData} applicationId={id} mode="edit" />;
        case 'Financial Advisory Service':
            return <FinancialAdvisoryForm initialData={initialData} applicationId={id} mode="edit" />;
        case 'Audit and Assurance Service':
            return <AuditAndAssuranceForm initialData={initialData} applicationId={id} mode="edit" />;

        // Government Scheme Forms
        case 'PM Mudra Yojana':
        case 'PMEGP (Khadi Board)':
        case 'Stand-Up India':
        case 'Other':
             return <GovernmentSchemeLoanApplicationForm initialData={initialData} applicationId={id} mode="edit" />;

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
}
