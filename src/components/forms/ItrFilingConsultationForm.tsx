
"use client";

import React from 'react';
import { ItrFilingConsultationFormSchema, type ItrFilingConsultationFormData } from '@/lib/schemas';
import { FileSpreadsheet } from 'lucide-react';
import { submitApplicationAction } from '@/app/actions/applicationActions';
import { updateCAServiceApplicationAction } from '@/app/actions/caServiceActions';
import { GenericCAServiceForm } from './GenericCAServiceForm';

interface ItrFilingConsultationFormProps {
  onBack?: () => void;
  initialData?: ItrFilingConsultationFormData | null;
  applicationId?: string;
  mode?: 'create' | 'edit';
}

const itrFilingSections = [
    {
        title: "Personal Details",
        fields: [
            { name: "personalDetails.fullName", label: "Full Name", type: "text", placeholder: "Full Name" },
            { name: "personalDetails.mobileNumber", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
            { name: "personalDetails.email", label: "Email ID", type: "email", placeholder: "example@mail.com" },
            { name: "personalDetails.dob", label: "Date of Birth", type: "date" },
            { name: "personalDetails.panNumber", label: "PAN Number", type: "text", placeholder: "ABCDE1234F" },
            { name: "personalDetails.aadhaarNumber", label: "Aadhaar Number", type: "text", placeholder: "123456789012" },
            { name: "personalDetails.address", label: "Address", type: "textarea", placeholder: "Your full address", colSpan: 2 },
            { name: "personalDetails.cityAndState", label: "City & State", type: "text", placeholder: "e.g., Mumbai, Maharashtra", colSpan: 2 },
        ]
    },
    {
        title: "Income Source Type",
        subtitle: "Select all that apply",
        fields: [
            { name: "incomeSourceType.salariedEmployee", label: "Salaried Employee", type: "checkbox", colSpan: 2 },
            { name: "incomeSourceType.businessIncome", label: "Business Income", type: "checkbox", colSpan: 2 },
            { name: "incomeSourceType.freelanceProfessional", label: "Freelance / Professional", type: "checkbox", colSpan: 2 },
            { name: "incomeSourceType.capitalGains", label: "Capital Gains (Stocks, Property)", type: "checkbox", colSpan: 2 },
            { name: "incomeSourceType.housePropertyIncome", label: "House Property Income", type: "checkbox", colSpan: 2 },
            { name: "incomeSourceType.otherIncomeSource", label: "Other", type: "checkbox", colSpan: 2 },
            { name: "incomeSourceType.otherIncomeSourceDetail", label: "Specify Other Income Source", type: "text", placeholder: "Details for other income source", colSpan: 2, dependsOn: { field: "incomeSourceType.otherIncomeSource", value: true } },
        ]
    },
    {
        title: "Upload Required Documents",
        subtitle: "Accepted File Types: PDF, Word, Excel, JPG, PNG. Max File Size: 10 MB per document.",
        fields: [
            { name: "kycDocuments.panCard", label: "PAN Card", type: "file", colSpan: 2 },
            { name: "kycDocuments.aadhaarCard", label: "Aadhaar Card", type: "file", colSpan: 2 },
            { name: "kycDocuments.photograph", label: "Applicant Photograph", type: "file", accept: ".jpg,.jpeg,.png", colSpan: 2 },
            { name: "documentUploads.form16", label: "Form 16 (if Salaried)", type: "file", colSpan: 2 },
            { name: "documentUploads.salarySlips", label: "Salary Slips (if applicable)", type: "file", colSpan: 2 },
            { name: "documentUploads.bankStatement", label: "Bank Statement (Full FY)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" },
            { name: "documentUploads.investmentProofs", label: "Investment Proofs (LIC, PPF, 80C, etc.)", type: "file", colSpan: 2 },
            { name: "documentUploads.rentReceipts", label: "Rent Receipts / HRA Proofs", type: "file", colSpan: 2 },
            { name: "documentUploads.capitalGainStatement", label: "Capital Gain Statement (if any)", type: "file", colSpan: 2 },
            { name: "documentUploads.businessIncomeProof", label: "Business Income Proof / ITR of Previous Year", type: "file", colSpan: 2 },
        ]
    }
];

export function ItrFilingConsultationForm({ onBack, initialData, applicationId, mode = 'create' }: ItrFilingConsultationFormProps) {
  const defaultValues: ItrFilingConsultationFormData = {
    personalDetails: {
      fullName: '',
      mobileNumber: '',
      email: '',
      dob: '',
      panNumber: '',
      aadhaarNumber: '',
      address: '',
      cityAndState: '',
      fatherOrHusbandName: '',
      gender: undefined,
    },
    incomeSourceType: {
      salariedEmployee: false,
      businessIncome: false,
      freelanceProfessional: false,
      capitalGains: false,
      housePropertyIncome: false,
      otherIncomeSource: false,
      otherIncomeSourceDetail: '',
    },
    kycDocuments: {
        panCard: undefined,
        aadhaarCard: undefined,
        photograph: undefined,
    },
    documentUploads: {
        form16: undefined,
        salarySlips: undefined,
        bankStatement: undefined,
        investmentProofs: undefined,
        rentReceipts: undefined,
        capitalGainStatement: undefined,
        businessIncomeProof: undefined,
    }
  };

  return (
    <GenericCAServiceForm
      onBack={onBack}
      formTitle="Income Tax Filing & Consultation Application"
      formSubtitle="Please provide the following details for ITR filing and consultation services."
      formIcon={<FileSpreadsheet className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={ItrFilingConsultationFormSchema}
      defaultValues={initialData || defaultValues}
      sections={itrFilingSections}
      submitAction={(data) => submitApplicationAction(data, 'caService', 'ITR Filing & Consultation')}
      updateAction={updateCAServiceApplicationAction}
      applicationId={applicationId}
      mode={mode}
    />
  );
}
