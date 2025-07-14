
"use client";

import React from 'react';
import { User } from 'lucide-react';
import { GenericLoanForm } from './GenericLoanForm';
import { PersonalLoanApplicationSchema, type PersonalLoanApplicationFormData } from '@/lib/schemas';
import { submitApplicationAction, updateApplicationAction } from '@/app/actions/applicationActions';
import type { UserProfileData } from '@/app/actions/profileActions';

interface PersonalLoanApplicationFormProps {
  onBack?: () => void;
  backButtonText?: string;
  initialData?: PersonalLoanApplicationFormData | null;
  applicationId?: string;
  mode?: 'create' | 'edit';
  userProfile?: UserProfileData | null;
}

const personalLoanSections = [
  {
    title: "Applicant's Personal Details",
    subtitle: "व्यक्तिगत जानकारी",
    fields: [
      { name: "personalDetails.fullName", label: "Full Name", type: "text", placeholder: "Full Name" },
      { name: "personalDetails.fatherOrHusbandName", label: "Father's / Spouse's Name", type: "text", placeholder: "Father's or Spouse's Full Name" },
      { name: "personalDetails.dob", label: "Date of Birth", type: "date" },
      { name: "personalDetails.gender", label: "Gender", type: "radio", options: [{value: "male", label: "Male"}, {value: "female", label: "Female"}, {value: "other", label: "Other"}] },
      { name: "personalDetails.mobileNumber", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
      { name: "personalDetails.email", label: "Email ID", type: "email", placeholder: "example@mail.com" },
      { name: "personalDetails.panNumber", label: "PAN Number", type: "text", placeholder: "ABCDE1234F", isPAN: true },
      { name: "personalDetails.aadhaarNumber", label: "Aadhaar Number", type: "text", placeholder: "123456789012", isAadhaar: true },
    ]
  },
   {
    title: "Address Details",
    subtitle: "पते की जानकारी",
    fields: [
      { name: "addressDetails.currentAddress", label: "Current Residential Address", type: "textarea", placeholder: "Enter your current full address", colSpan: 2 },
      { 
        name: "addressDetails.isPermanentAddressSame", 
        label: "Is Permanent Address same as Current Address?", 
        type: "radio", 
        options: [{value: "yes", label: "Yes"}, {value: "no", label: "No"}], 
        colSpan: 2
      },
      { name: "addressDetails.permanentAddress", label: "Permanent Address (if different)", type: "textarea", placeholder: "Enter your permanent full address", colSpan: 2, dependsOn: { field: "addressDetails.isPermanentAddressSame", value: "no" } },
    ]
  },
  {
    title: "Employment / Income Details",
    subtitle: "रोजगार और आय की जानकारी",
    fields: [
      { name: "employmentIncome.employmentType", label: "Occupation Type", type: "radio", options: [{value: "salaried", label: "Salaried"}, {value: "self-employed", label: "Self-Employed / Business"}], colSpan: 2},
      { name: "employmentIncome.companyName", label: "Company / Business Name", type: "text", placeholder: "Company Name" },
      { name: "employmentIncome.monthlyIncome", label: "Monthly Income (₹)", type: "number", placeholder: "e.g., 50000", prefix: "₹" },
      { name: "employmentIncome.yearsInCurrentJobOrBusiness", label: "Job/Business Duration (Years)", type: "number", placeholder: "e.g., 3" },
    ]
  },
   {
    title: "Loan Details",
    subtitle: "ऋण की जानकारी",
    fields: [
      { name: "loanDetails.loanAmountRequired", label: "Loan Amount Required (₹)", type: "number", placeholder: "e.g., 200000", prefix: "₹" },
      { name: "loanDetails.purposeOfLoan", label: "Purpose of Loan", type: "radio", options: [
          {value: "medical_emergency", label: "Medical Emergency"},
          {value: "travel", label: "Travel"},
          {value: "education", label: "Education"},
          {value: "wedding", label: "Wedding"},
          {value: "home_renovation", label: "Home Renovation"},
          {value: "other", label: "Other"}
        ], colSpan: 2 },
      { name: "loanDetails.otherPurposeOfLoan", label: "If Other, specify purpose", type: "text", placeholder: "Specify other purpose", dependsOn: { field: "loanDetails.purposeOfLoan", value: "other" } },
      { name: "loanDetails.loanTenureRequired", label: "Preferred Loan Tenure (in Months)", type: "number", placeholder: "e.g., 36" },
      { name: "loanDetails.hasExistingLoans", label: "Any Existing Loans?", type: "radio", options: [{value: "yes", label: "Yes"}, {value: "no", label: "No"}], colSpan: 2 },
    ]
  },
   {
    title: "Existing Loan Details",
    subtitle: "मौजूदा ऋण की जानकारी",
    fields: [
      { name: "existingLoans.emiAmount", label: "If Yes, Total Current EMI (कुल वर्तमान ईएमआई)", type: "number", placeholder: "Total EMI amount", prefix: "₹", dependsOn: { field: "loanDetails.hasExistingLoans", value: "yes" } },
      { name: "existingLoans.bankName", label: "If Yes, Bank Name(s) (बैंक का नाम)", type: "text", placeholder: "Bank Name(s)", dependsOn: { field: "loanDetails.hasExistingLoans", value: "yes" } },
      { name: "existingLoans.outstandingAmount", label: "If Yes, Total Outstanding Amount (कुल बकाया राशि)", type: "number", placeholder: "Total outstanding amount", prefix: "₹", dependsOn: { field: "loanDetails.hasExistingLoans", value: "yes" } },
    ]
  },
  {
    title: "Upload Required Documents",
    subtitle: "Accepted File Types: PDF, Word, Excel, JPG, PNG. Max File Size: 10 MB per document.",
    fields: [
      { name: "documentUploads.panCard", label: "PAN Card", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
      { name: "documentUploads.aadhaarCard", label: "Aadhaar Card", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
      { name: "documentUploads.photograph", label: "Passport Size Photograph", type: "file", colSpan: 2, accept: ".jpg,.jpeg,.png" },
      { name: "documentUploads.incomeProof", label: "Income Proof (Salary Slip / ITR)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" },
      { name: "documentUploads.bankStatement", label: "Bank Statement (Last 6 Months)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" },
      { name: "documentUploads.employmentProof", label: "Employment/Business Proof", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png" },
      { name: "documentUploads.existingLoanStatement", label: "Existing Loan Statement (if any)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" },
    ]
  }
];


export function PersonalLoanApplicationForm({ onBack, backButtonText, initialData, applicationId, mode = 'create', userProfile }: PersonalLoanApplicationFormProps) {
  
  const prefilledData = {
    personalDetails: {
      fullName: userProfile?.fullName || '',
      email: userProfile?.email || '',
      mobileNumber: userProfile?.mobileNumber || '',
    }
  };
  
  const defaultValues: PersonalLoanApplicationFormData = {
    personalDetails: { 
      fullName: initialData?.personalDetails?.fullName || prefilledData.personalDetails.fullName,
      fatherOrHusbandName: initialData?.personalDetails?.fatherOrHusbandName || '',
      dob: initialData?.personalDetails?.dob || '', 
      gender: initialData?.personalDetails?.gender || undefined, 
      mobileNumber: initialData?.personalDetails?.mobileNumber || prefilledData.personalDetails.mobileNumber, 
      email: initialData?.personalDetails?.email || prefilledData.personalDetails.email, 
      panNumber: initialData?.personalDetails?.panNumber || '', 
      aadhaarNumber: initialData?.personalDetails?.aadhaarNumber || ''
    },
    addressDetails: initialData?.addressDetails || {
      currentAddress: '',
      isPermanentAddressSame: "yes",
      permanentAddress: '',
    },
    employmentIncome: initialData?.employmentIncome || { 
      employmentType: undefined,
      companyName: '', 
      monthlyIncome: undefined,
      yearsInCurrentJobOrBusiness: undefined 
    },
    loanDetails: initialData?.loanDetails || {
      loanAmountRequired: undefined,
      purposeOfLoan: undefined,
      otherPurposeOfLoan: '',
      loanTenureRequired: undefined,
      hasExistingLoans: "no",
    },
    existingLoans: initialData?.existingLoans || {
      emiAmount: undefined,
      bankName: '',
      outstandingAmount: undefined,
    },
    documentUploads: initialData?.documentUploads || {
      panCard: undefined,
      aadhaarCard: undefined,
      photograph: undefined,
      incomeProof: undefined,
      bankStatement: undefined,
      employmentProof: undefined,
      existingLoanStatement: undefined,
    }
  };


  return (
    <GenericLoanForm
      onBack={onBack}
      backButtonText={backButtonText}
      formTitle="Personal Loan Application Form"
      formSubtitle="Instant Loan for Your Personal Needs • Easy Process • Fast Disbursal • Minimum Documents • 100% Secure & Confidential"
      formIcon={<User className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={PersonalLoanApplicationSchema}
      defaultValues={defaultValues}
      sections={personalLoanSections}
      submitAction={(data) => submitApplicationAction(data, 'loan', 'Personal Loan')}
      updateAction={(id, data) => updateApplicationAction(id, 'loan', data)}
      applicationId={applicationId}
      mode={mode}
      submitButtonText="Submit Personal Loan Application"
    />
  );
}
