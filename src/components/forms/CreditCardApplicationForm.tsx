
"use client";

import React from 'react';
import { CreditCardIcon } from 'lucide-react';
import { GenericLoanForm } from './GenericLoanForm';
import { CreditCardApplicationSchema, type CreditCardApplicationFormData } from '@/lib/schemas';
import { submitApplicationAction, updateApplicationAction } from '@/app/actions/applicationActions';

interface CreditCardApplicationFormProps {
  onBack?: () => void;
  backButtonText?: string;
  initialData?: CreditCardApplicationFormData | null;
  applicationId?: string;
  mode?: 'create' | 'edit';
}

const creditCardSections = [
  {
    title: "Applicant's Personal Details",
    subtitle: "व्यक्तिगत जानकारी",
    fields: [
      { name: "personalDetails.fullName", label: "Full Name", type: "text", placeholder: "Full Name" },
      { name: "personalDetails.dob", label: "Date of Birth", type: "date" },
      { name: "personalDetails.mobileNumber", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
      { name: "personalDetails.email", label: "Email ID", type: "email", placeholder: "example@mail.com" },
      { name: "personalDetails.panNumber", label: "PAN Number", type: "text", placeholder: "ABCDE1234F", isPAN: true },
      { name: "personalDetails.aadhaarNumber", label: "Aadhaar Number", type: "text", placeholder: "123456789012", isAadhaar: true },
      { name: "address.residentialAddress", label: "Residential Address", type: "textarea", placeholder: "Full residential address", colSpan: 2 },
      { name: "address.city", label: "City", type: "text", placeholder: "City" },
      { name: "address.pincode", label: "Pincode", type: "text", placeholder: "6-digit Pincode" },
    ]
  },
  {
    title: "Employment / Income Details",
    subtitle: "रोजगार और आय की जानकारी",
    fields: [
      { name: "employmentIncome.employmentType", label: "Occupation Type", type: "radio", options: [{value: "salaried", label: "Salaried"}, {value: "self-employed", label: "Self-Employed / Business"}], colSpan: 2},
      { name: "employmentIncome.companyName", label: "Company / Business Name", type: "text", placeholder: "Company Name" },
      { name: "employmentIncome.monthlyIncome", label: "Monthly Income (₹)", type: "number", placeholder: "e.g., 50000", prefix: "₹" },
      { name: "employmentIncome.yearsInCurrentJobOrBusiness", label: "Employment Duration (Years)", type: "number", placeholder: "e.g., 3" },
    ]
  },
  {
    title: "Credit Card Preferences",
    subtitle: "क्रेडिट कार्ड प्राथमिकताएं",
    fields: [
      { name: "creditCardPreferences.preferredCardType", label: "Preferred Card Type", type: "radio", options: [
          {value: "basic", label: "Basic Credit Card"},
          {value: "rewards", label: "Rewards / Cashback Card"},
          {value: "travel", label: "Travel Card"},
          {value: "business", label: "Business Credit Card"},
          {value: "other", label: "Other"}
        ], colSpan: 2 },
      { name: "creditCardPreferences.otherPreferredCardType", label: "If Other, specify type", type: "text", placeholder: "Specify other card type", dependsOn: { field: "creditCardPreferences.preferredCardType", value: "other" } },
      { name: "creditCardPreferences.hasExistingCreditCard", label: "Existing Credit Card?", type: "radio", options: [{value: "yes", label: "Yes"}, {value: "no", label: "No"}], colSpan: 2 },
      { name: "creditCardPreferences.existingCreditCardIssuer", label: "If Yes, Issuer", type: "text", placeholder: "Card Issuer Name", dependsOn: { field: "creditCardPreferences.hasExistingCreditCard", value: "yes" } },
      { name: "creditCardPreferences.existingCreditCardLimit", label: "If Yes, Limit (₹)", type: "number", placeholder: "e.g., 50000", prefix: "₹", dependsOn: { field: "creditCardPreferences.hasExistingCreditCard", value: "yes" } },
    ]
  },
  {
    title: "Upload Required Documents",
    subtitle: "Accepted File Types: PDF, Word, Excel, JPG, PNG. Max File Size: 10 MB per document.",
    fields: [
      { name: "kycDocuments.panCard", label: "PAN Card", type: "file", colSpan: 2 },
      { name: "kycDocuments.aadhaarCard", label: "Aadhaar Card", type: "file", colSpan: 2 },
      { name: "kycDocuments.photograph", label: "Passport Size Photo", type: "file", colSpan: 2 },
      { name: "documentUploads.incomeProof", label: "Income Proof (Salary Slip / ITR)", type: "file", colSpan: 2 },
      { name: "documentUploads.bankStatement", label: "Bank Statement (Last 3–6 Months)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" },
      { name: "documentUploads.employmentProof", label: "Employment/Business Proof", type: "file", colSpan: 2 },
      { name: "documentUploads.existingCreditCardStatement", label: "Existing Credit Card Statement (if any)", type: "file", colSpan: 2 },
    ]
  }
];

export function CreditCardApplicationForm({ onBack, backButtonText, initialData, applicationId, mode = 'create' }: CreditCardApplicationFormProps) {
  const defaultValues: CreditCardApplicationFormData = {
    personalDetails: { fullName: '', dob: '', mobileNumber: '', email: '', panNumber: '', aadhaarNumber: '' },
    address: { residentialAddress: '', city: '', pincode: '' },
    employmentIncome: { 
      employmentType: undefined, 
      companyName: '', 
      monthlyIncome: undefined, 
      yearsInCurrentJobOrBusiness: undefined 
    },
    creditCardPreferences: {
      preferredCardType: undefined,
      otherPreferredCardType: '',
      hasExistingCreditCard: "no",
      existingCreditCardIssuer: '',
      existingCreditCardLimit: undefined,
    },
    kycDocuments: {
      panCard: undefined,
      aadhaarCard: undefined,
      photograph: undefined,
    },
    documentUploads: {
      incomeProof: undefined,
      bankStatement: undefined,
      employmentProof: undefined,
      existingCreditCardStatement: undefined,
    }
  };

  return (
    <GenericLoanForm
      onBack={onBack}
      backButtonText={backButtonText}
      formTitle="Credit Card Application Form"
      formSubtitle="Apply for Your Credit Card Easily • Quick Approval • Minimal Documents • 100% Digital & Secure Process"
      formIcon={<CreditCardIcon className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={CreditCardApplicationSchema}
      defaultValues={initialData || defaultValues}
      sections={creditCardSections}
      submitAction={(data) => submitApplicationAction(data, 'loan', 'Credit Card')}
      updateAction={(id, data) => updateApplicationAction(id, 'loan', data)}
      applicationId={applicationId}
      mode={mode}
      submitButtonText="Submit Credit Card Application"
    />
  );
}
