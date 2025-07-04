
"use client";

import React from 'react';
import { ItrFilingConsultationFormSchema, type ItrFilingConsultationFormData } from '@/lib/schemas';
import { FileSpreadsheet } from 'lucide-react';
import { submitApplicationAction, updateApplicationAction } from '@/app/actions/applicationActions';
import type { UserApplication } from '@/lib/types';
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
            { name: "personalDetails.fatherOrHusbandName", label: "Father's / Spouse's Name", type: "text", placeholder: "Father's or Spouse's Full Name" },
            { name: "personalDetails.dob", label: "Date of Birth", type: "date" },
            { name: "personalDetails.gender", label: "Gender", type: "radio", options: [{value: "male", label: "Male"}, {value: "female", label: "Female"}, {value: "other", label: "Other"}] },
            { name: "personalDetails.mobileNumber", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
            { name: "personalDetails.email", label: "Email ID", type: "email", placeholder: "example@mail.com" },
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
            { name: "kycDocuments.panCard", label: "PAN Card", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "kycDocuments.aadhaarCard", label: "Aadhaar Card", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "kycDocuments.photograph", label: "Applicant Photograph", type: "file", colSpan: 2, accept: ".jpg,.jpeg,.png" },
            { name: "documentUploads.form16", label: "Form 16 (if Salaried)", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "documentUploads.salarySlips", label: "Salary Slips (if applicable)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png" },
            { name: "documentUploads.bankStatement", label: "Bank Statement (Full FY)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" },
            { name: "documentUploads.investmentProofs", label: "Investment Proofs (LIC, PPF, 80C, etc.)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png" },
            { name: "documentUploads.rentReceipts", label: "Rent Receipts / HRA Proofs", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png" },
            { name: "documentUploads.capitalGainStatement", label: "Capital Gain Statement (if any)", type: "file", colSpan: 2, accept: ".pdf,.xls,.xlsx,.jpg,.jpeg,.png" },
            { name: "documentUploads.businessIncomeProof", label: "Business Income Proof / ITR of Previous Year", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" },
        ]
    }
];

export function ItrFilingConsultationForm({ onBack, initialData, applicationId, mode = 'create' }: ItrFilingConsultationFormProps) {
  const defaultValues: ItrFilingConsultationFormData = {
    personalDetails: {
      fullName: '',
      fatherOrHusbandName: '',
      dob: '',
      gender: undefined,
      mobileNumber: '',
      email: '',
      panNumber: '',
      aadhaarNumber: '',
      address: '',
      cityAndState: '',
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
      updateAction={(id, data) => updateApplicationAction(id, 'caService' as UserApplication['serviceCategory'], data)}
      applicationId={applicationId}
      mode={mode}
    />
  );
}
