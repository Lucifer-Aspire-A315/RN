
"use client";

import React from 'react';
import { CompanyIncorporationFormSchema, type CompanyIncorporationFormData } from '@/lib/schemas';
import { Building2 } from 'lucide-react';
import { submitApplicationAction } from '@/app/actions/applicationActions';
import { updateCAServiceApplicationAction } from '@/app/actions/caServiceActions';
import { GenericCAServiceForm } from './GenericCAServiceForm';

interface CompanyIncorporationFormProps {
  onBack?: () => void;
  initialData?: CompanyIncorporationFormData | null;
  applicationId?: string;
  mode?: 'create' | 'edit';
}

const companyIncorporationSections = [
    {
        title: "Primary Founder's Personal Details",
        fields: [
            { name: "personalDetails.fullName", label: "Full Name", type: "text", placeholder: "Full Name" },
            { name: "personalDetails.mobileNumber", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
            { name: "personalDetails.email", label: "Email ID", type: "email", placeholder: "example@mail.com" },
            { name: "personalDetails.dob", label: "Date of Birth", type: "date" },
            { name: "personalDetails.panNumber", label: "PAN Number", type: "text", placeholder: "ABCDE1234F" },
            { name: "personalDetails.aadhaarNumber", label: "Aadhaar Number", type: "text", placeholder: "123456789012" },
            { name: "personalDetails.occupation", label: "Occupation", type: "radio", colSpan: 2, options: [
                { value: "business", label: "Business" },
                { value: "job", label: "Job" },
                { value: "student", label: "Student" },
                { value: "other", label: "Other" }
            ]},
            { name: "personalDetails.otherOccupationDetail", label: "Specify Other Occupation", type: "text", placeholder: "Specify occupation", dependsOn: { field: "personalDetails.occupation", value: "other" } },
            { name: "personalDetails.residentialAddress", label: "Residential Address", type: "textarea", placeholder: "Your full residential address", colSpan: 2 },
            { name: "personalDetails.cityAndState", label: "City & State", type: "text", placeholder: "e.g., Mumbai, Maharashtra" },
        ]
    },
    {
        title: "Company Details",
        fields: [
            { name: "companyDetails.companyType", label: "Type of Company to Incorporate", type: "radio", colSpan: 2, options: [
                { value: "pvt_ltd", label: "Private Limited (Pvt Ltd)" },
                { value: "llp", label: "Limited Liability Partnership (LLP)" },
                { value: "opc", label: "One Person Company (OPC)" },
                { value: "partnership", label: "Partnership Firm" },
                { value: "other", label: "Other" }
            ]},
            { name: "companyDetails.otherCompanyTypeDetail", label: "Specify Other Company Type", type: "text", placeholder: "Specify type", dependsOn: { field: "companyDetails.companyType", value: "other" } },
            { name: "companyDetails.proposedCompanyName1", label: "Proposed Company Name 1", type: "text", placeholder: "Name preference 1" },
            { name: "companyDetails.proposedCompanyName2", label: "Proposed Company Name 2 (Optional)", type: "text", placeholder: "Name preference 2" },
            { name: "companyDetails.proposedCompanyName3", label: "Proposed Company Name 3 (Optional)", type: "text", placeholder: "Name preference 3" },
            { name: "companyDetails.businessActivity", label: "Business Activity / Nature of Work", type: "textarea", placeholder: "Describe your business activities", colSpan: 2 },
            { name: "companyDetails.proposedBusinessAddress", label: "Proposed Business Address", type: "textarea", placeholder: "Full proposed business address", colSpan: 2 },
        ]
    },
    {
        title: "Number of Directors / Partners",
        fields: [
            { name: "directorsPartners.numberOfDirectorsPartners", label: "Select Number", type: "radio", colSpan: 2, options: [
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4+", label: "4+" }
            ]},
        ]
    },
    {
        title: "Upload Required Documents",
        subtitle: "For Each Director/Partner. Accepted File Types: PDF, Word, JPG, PNG. Max File Size: 10 MB per document.",
        fields: [
            { name: "kycDocuments.panCard", label: "Director/Partner PAN Card", type: "file", colSpan: 2 },
            { name: "kycDocuments.aadhaarCard", label: "Director/Partner Aadhaar Card", type: "file", colSpan: 2 },
            { name: "kycDocuments.photograph", label: "Director/Partner Passport Photo", type: "file", colSpan: 2 },
            { name: "documentUploads.businessAddressProof", label: "Electricity Bill / Rent Agreement (Business Address Proof)", type: "file", colSpan: 2 },
            { name: "documentUploads.directorBankStatement", label: "Bank Statement (Last 1 month)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png" },
            { name: "documentUploads.dsc", label: "Digital Signature Certificate (DSC, if available)", type: "file", colSpan: 2 },
        ]
    },
    {
        title: "Optional Services",
        subtitle: "Select if Needed",
        fields: [
            { name: "optionalServices.gstRegistration", label: "GST Registration", type: "checkbox", colSpan: 2 },
            { name: "optionalServices.msmeRegistration", label: "MSME Registration", type: "checkbox", colSpan: 2 },
            { name: "optionalServices.trademarkFiling", label: "Trademark Filing", type: "checkbox", colSpan: 2 },
            { name: "optionalServices.openBusinessBankAccount", label: "Opening Business Bank Account", type: "checkbox", colSpan: 2 },
            { name: "optionalServices.accountingTaxSetup", label: "Accounting & Tax Filing Setup", type: "checkbox", colSpan: 2 },
        ]
    }
];

export function CompanyIncorporationForm({ onBack, initialData, applicationId, mode = 'create' }: CompanyIncorporationFormProps) {
  const defaultValues: CompanyIncorporationFormData = {
    personalDetails: {
      fullName: '',
      mobileNumber: '',
      email: '',
      dob: '',
      occupation: undefined,
      otherOccupationDetail: '',
      residentialAddress: '',
      cityAndState: '',
      panNumber: '',
      aadhaarNumber: '',
      fatherOrHusbandName: '',
      gender: undefined,
    },
    companyDetails: {
      companyType: undefined,
      otherCompanyTypeDetail: '',
      proposedCompanyName1: '',
      proposedCompanyName2: '',
      proposedCompanyName3: '',
      businessActivity: '',
      proposedBusinessAddress: '',
    },
    directorsPartners: {
      numberOfDirectorsPartners: undefined,
    },
    kycDocuments: {
        panCard: undefined,
        aadhaarCard: undefined,
        photograph: undefined,
    },
    documentUploads: {
        businessAddressProof: undefined,
        directorBankStatement: undefined,
        dsc: undefined,
    },
    optionalServices: {
        gstRegistration: false,
        msmeRegistration: false,
        trademarkFiling: false,
        openBusinessBankAccount: false,
        accountingTaxSetup: false,
    },
  };

  const declarationConfig = {
    label: "Declaration and Undertaking",
    description: "I hereby declare that the details and documents submitted are true and correct. I authorize RN FinTech to initiate the company registration process on my behalf."
  };

  return (
    <GenericCAServiceForm
        onBack={onBack}
        formTitle="Company Incorporation Application Form"
        formSubtitle="Please provide the details below to start your company registration process."
        formIcon={<Building2 className="w-12 h-12 mx-auto text-primary mb-2" />}
        schema={CompanyIncorporationFormSchema}
        defaultValues={initialData || defaultValues}
        sections={companyIncorporationSections}
        submitAction={(data) => submitApplicationAction(data, 'caService', 'Company Incorporation')}
        updateAction={updateCAServiceApplicationAction}
        applicationId={applicationId}
        mode={mode}
        declarationConfig={declarationConfig}
    />
  );
}
