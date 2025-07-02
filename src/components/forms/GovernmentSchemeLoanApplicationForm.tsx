
"use client";

import React from 'react';
import { GovernmentSchemeLoanApplicationSchema, type GovernmentSchemeLoanApplicationFormData } from '@/lib/schemas';
import { FileText } from 'lucide-react';
import { GenericLoanForm } from './GenericLoanForm';
import { submitApplicationAction, updateApplicationAction } from '@/app/actions/applicationActions';
import { updateGovernmentSchemeLoanApplicationAction } from '@/app/actions/governmentSchemeActions';

interface GovernmentSchemeLoanApplicationFormProps {
  onBack?: () => void;
  selectedScheme?: string;
  otherSchemeName?: string;
  initialData?: GovernmentSchemeLoanApplicationFormData | null;
  applicationId?: string;
  mode?: 'create' | 'edit';
}

const schemeDisplayNames: Record<string, string> = {
  pmmy: "PM Mudra Yojana",
  pmegp: "PMEGP (Khadi Board)",
  standup: "Stand-Up India",
  other: "Other",
};

const governmentSchemeSections = [
  {
    title: "Applicant's Personal Details",
    fields: [
      { name: "personalDetails.fullName", label: "Full Name", type: "text", placeholder: "Full Name" },
      { name: "personalDetails.fatherOrHusbandName", label: "Father’s / Spouse’s Name", type: "text", placeholder: "Father's / Spouse's Name" },
      { name: "personalDetails.dob", label: "Date of Birth", type: "date" },
      { name: "personalDetails.mobileNumber", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
      { name: "personalDetails.email", label: "Email ID", type: "email", placeholder: "example@mail.com", colSpan: 2 },
      { name: "personalDetails.gender", label: "Gender", type: "radio", options: [{value: 'male', label: 'Male'}, {value: 'female', label: 'Female'}, {value: 'other', label: 'Other'}] },
      { name: "personalDetails.category", label: "Category", type: "radio", options: [{value: 'general', label: 'General'}, {value: 'sc', label: 'SC'}, {value: 'st', label: 'ST'}, {value: 'obc', label: 'OBC'}] },
      { name: "personalDetails.maritalStatus", label: "Marital Status", type: "radio", colSpan: 2, options: [{value: 'single', label: 'Single'}, {value: 'married', label: 'Married'}] },
      { name: "personalDetails.panNumber", label: "PAN Number", type: "text", placeholder: "ABCDE1234F", isPAN: true },
      { name: "personalDetails.aadhaarNumber", label: "Aadhaar Number", type: "text", placeholder: "123456789012", isAadhaar: true },
    ]
  },
  {
    title: "Address Information",
    fields: [
      { name: "addressInformation.residentialAddress", label: "Residential Address", type: "textarea", placeholder: "Full Residential Address", colSpan: 2 },
      { name: "addressInformation.state", label: "State", type: "text", placeholder: "State" },
      { name: "addressInformation.district", label: "District", type: "text", placeholder: "District" },
      { name: "addressInformation.pincode", label: "Pincode", type: "text", placeholder: "6-digit Pincode" },
    ]
  },
  {
    title: "Business Information",
    fields: [
      { name: "businessInformation.businessName", label: "Business Name (if any)", type: "text", placeholder: "Your Business Name" },
      { name: "businessInformation.businessType", label: "Type of Business", type: "radio", options: [{value: 'proprietorship', label: 'Proprietorship'}, {value: 'partnership', label: 'Partnership'}, {value: 'other', label: 'Other'}] },
      { name: "businessInformation.otherBusinessType", label: "Specify Other Business Type", type: "text", placeholder: "Specify type", dependsOn: { field: "businessInformation.businessType", value: "other" } },
      { name: "businessInformation.businessLocation", label: "Business Location", type: "text", placeholder: "Location of business" },
      { name: "businessInformation.yearsInBusiness", label: "Years in Business", type: "number", placeholder: "e.g., 5" },
      { name: "businessInformation.sector", label: "Sector", type: "radio", options: [{value: 'manufacturing', label: 'Manufacturing'}, {value: 'service', label: 'Service'}, {value: 'trading', label: 'Trading'}] },
      { name: "businessInformation.loanPurpose", label: "Loan Purpose", type: "radio", colSpan: 2, options: [{value: 'new_setup', label: 'New Setup'}, {value: 'expansion', label: 'Expansion'}, {value: 'working_capital', label: 'Working Capital'}] },
    ]
  },
  {
    title: "Loan Details",
    fields: [
      { name: "loanDetails.selectedScheme", label: "Selected Scheme", type: "text", disabled: true, colSpan: 2 },
      { name: "loanDetails.otherSchemeName", label: "Specified Scheme Name", type: "text", disabled: true, dependsOn: { field: "loanDetails.selectedScheme", value: "Other" }, colSpan: 2 },
      { name: "loanDetails.loanAmountRequired", label: "Loan Amount Required (₹)", type: "number", placeholder: "e.g., 500000", prefix: '₹' },
      { name: "loanDetails.loanTenure", label: "Loan Tenure (in Years)", type: "number", placeholder: "e.g., 5" },
    ]
  },
  {
    title: "Upload Required Documents",
    subtitle: "File types allowed: PDF, Word, Excel, JPG, PNG. Max size: 10 MB per document.",
    fields: [
      { name: "kycDocuments.aadhaarCard", label: "Aadhaar Card", type: "file", colSpan: 2 },
      { name: "kycDocuments.panCard", label: "PAN Card", type: "file", colSpan: 2 },
      { name: "kycDocuments.photograph", label: "Passport Size Photo", type: "file", colSpan: 2 },
      { name: "documentUploads.businessProof", label: "Business Proof (Udyam / Registration)", type: "file", colSpan: 2 },
      { name: "documentUploads.bankStatement", label: "Bank Statement (Last 6 Months)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" },
      { name: "documentUploads.casteCertificate", label: "Caste Certificate (if applicable)", type: "file", colSpan: 2 },
      { name: "documentUploads.incomeCertificate", label: "Income Certificate", type: "file", colSpan: 2 },
      { name: "documentUploads.projectReport", label: "Project Report / Business Plan", type: "file", colSpan: 2 },
      { name: "documentUploads.existingLoanStatement", label: "Existing Loan Statement (if any)", type: "file", colSpan: 2 },
    ]
  }
];

export function GovernmentSchemeLoanApplicationForm({ onBack, selectedScheme, otherSchemeName, initialData, applicationId, mode = 'create' }: GovernmentSchemeLoanApplicationFormProps) {

  const defaultValues: GovernmentSchemeLoanApplicationFormData = initialData || {
    personalDetails: {
      fullName: '',
      fatherOrHusbandName: '',
      dob: '',
      mobileNumber: '',
      email: '',
      gender: undefined,
      category: undefined,
      maritalStatus: undefined,
      panNumber: '',
      aadhaarNumber: '',
    },
    addressInformation: {
      residentialAddress: '',
      state: '',
      district: '',
      pincode: '',
    },
    businessInformation: {
      businessName: '',
      businessType: undefined,
      otherBusinessType: '',
      businessLocation: '',
      yearsInBusiness: undefined,
      sector: undefined,
      loanPurpose: undefined,
    },
    loanDetails: {
      selectedScheme: selectedScheme ? (schemeDisplayNames[selectedScheme] || otherSchemeName || selectedScheme) : '',
      otherSchemeName: selectedScheme === 'other' ? otherSchemeName : '',
      loanAmountRequired: undefined,
      loanTenure: undefined,
    },
    kycDocuments: {
      aadhaarCard: undefined,
      panCard: undefined,
      photograph: undefined,
    },
    documentUploads: {
      businessProof: undefined,
      bankStatement: undefined,
      casteCertificate: undefined,
      incomeCertificate: undefined,
      projectReport: undefined,
      existingLoanStatement: undefined,
    }
  };

  const applicationType = initialData?.loanDetails.selectedScheme || defaultValues.loanDetails.selectedScheme;
  const formSubtitle = mode === 'edit'
    ? `Editing Application for: ${applicationType}`
    : `Applying for: ${applicationType}`;
  
  const applicationTypeForSubmission = defaultValues.loanDetails.selectedScheme;
  const schemeNameForDisplay = defaultValues.loanDetails.selectedScheme === 'Other' && defaultValues.loanDetails.otherSchemeName ? defaultValues.loanDetails.otherSchemeName : defaultValues.loanDetails.selectedScheme;

  return (
     <GenericLoanForm
      onBack={onBack}
      backButtonText="Back to Schemes"
      formTitle="Government Scheme Loan Application Form"
      formSubtitle={formSubtitle}
      formIcon={<FileText className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={GovernmentSchemeLoanApplicationSchema}
      defaultValues={defaultValues}
      sections={governmentSchemeSections}
      submitAction={(data) => submitApplicationAction(data, 'governmentScheme', applicationTypeForSubmission, schemeNameForDisplay)}
      updateAction={(id, data) => updateGovernmentSchemeLoanApplicationAction(id, data)}
      applicationId={applicationId}
      mode={mode}
      submitButtonText="Submit Government Scheme Application"
    />
  );
}
