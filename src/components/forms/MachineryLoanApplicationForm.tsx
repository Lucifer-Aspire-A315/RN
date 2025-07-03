
"use client";

import React from 'react';
import { Cog } from 'lucide-react';
import { GenericLoanForm } from './GenericLoanForm';
import { MachineryLoanApplicationSchema, type MachineryLoanApplicationFormData } from '@/lib/schemas';
import { submitApplicationAction, updateApplicationAction } from '@/app/actions/applicationActions';

interface MachineryLoanApplicationFormProps {
  onBack?: () => void;
  backButtonText?: string;
  initialData?: MachineryLoanApplicationFormData | null;
  applicationId?: string;
  mode?: 'create' | 'edit';
}

const machineryLoanSections = [
  {
    title: "Applicant's Personal Details",
    subtitle: "आवेदक की जानकारी",
    fields: [
      { name: "personalDetails.fullName", label: "Applicant Name", type: "text", placeholder: "Full Name" },
      { name: "personalDetails.fatherOrHusbandName", label: "Father's / Spouse's Name", type: "text", placeholder: "Father's or Spouse's Full Name" },
      { name: "personalDetails.dob", label: "Date of Birth (जन्म तिथि)", type: "date" },
      { name: "personalDetails.gender", label: "Gender", type: "radio", options: [{value: "male", label: "Male"}, {value: "female", label: "Female"}, {value: "other", label: "Other"}] },
      { name: "personalDetails.mobileNumber", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
      { name: "personalDetails.email", label: "Email ID", type: "email", placeholder: "example@mail.com" },
      { name: "personalDetails.panNumber", label: "PAN Number (पैन नंबर)", type: "text", placeholder: "ABCDE1234F", isPAN: true },
      { name: "personalDetails.aadhaarNumber", label: "Aadhaar Number (आधार नंबर)", type: "text", placeholder: "123456789012", isAadhaar: true },
    ]
  },
  {
    title: "Business Details",
    subtitle: "व्यवसाय की जानकारी",
    fields: [
      { name: "businessDetails.businessName", label: "Business Name", type: "text", placeholder: "Your Company Name" },
      { name: "businessDetails.businessType", label: "Type of Business", type: "radio", options: [
          {value: "proprietorship", label: "Proprietorship"},
          {value: "partnership", label: "Partnership"},
          {value: "pvt_ltd", label: "Pvt. Ltd. Company"},
          {value: "other", label: "Other"}
        ], colSpan: 2 },
      { name: "businessDetails.otherBusinessType", label: "If Other, specify type (अन्य प्रकार निर्दिष्ट करें)", type: "text", placeholder: "Specify other type", dependsOn: { field: "businessDetails.businessType", value: "other"} },
      { name: "businessDetails.natureOfBusiness", label: "Nature of Business (कारोबार का प्रकार)", type: "text", placeholder: "e.g., Manufacturing, Retail" },
      { name: "businessDetails.businessStartYear", label: "Business Start Year (व्यवसाय शुरू होने का वर्ष)", type: "number", placeholder: "YYYY" },
      { name: "businessDetails.businessAddress", label: "Business Address", type: "textarea", placeholder: "Full business address", colSpan: 2 },
      { name: "businessDetails.annualTurnover", label: "Annual Turnover (₹)", type: "number", placeholder: "e.g., 5000000", prefix: "₹" },
      { name: "businessDetails.profitAfterTax", label: "Profit After Tax (कर के बाद लाभ)", type: "number", placeholder: "e.g., 500000", prefix: "₹" },
    ]
  },
  {
    title: "Machinery & Loan Requirement",
    subtitle: "मशीनरी और ऋण की आवश्यकता",
    fields: [
      { name: "machineryLoanDetails.descriptionOfMachinery", label: "Description of Machinery", type: "textarea", placeholder: "e.g., CNC Milling Machine, Model XYZ", colSpan: 2 },
      { name: "machineryLoanDetails.supplierName", label: "Supplier Name", type: "text", placeholder: "e.g., ABC Machinery Pvt. Ltd." },
      { name: "machineryLoanDetails.totalCostOfMachinery", label: "Total Cost of Machinery (₹)", type: "number", placeholder: "e.g., 1500000", prefix: "₹" },
      { name: "machineryLoanDetails.loanAmountRequired", label: "Loan Amount Required (₹)", type: "number", placeholder: "e.g., 1200000", prefix: "₹" },
      { name: "machineryLoanDetails.loanTenureRequired", label: "Loan Tenure (in Months)", type: "number", placeholder: "e.g., 60" },
      { name: "machineryLoanDetails.hasExistingLoans", label: "Any Existing Loans? (क्या कोई वर्तमान लोन है?)", type: "radio", options: [{value: "yes", label: "Yes (हाँ)"}, {value: "no", label: "No (नहीं)"}], colSpan: 2 },
    ]
  },
   {
    title: "Existing Loan Details",
    subtitle: "मौजूदा ऋण की जानकारी",
    fields: [
      { name: "existingLoans.emiAmount", label: "If Yes, Total Current EMI (कुल वर्तमान ईएमआई)", type: "number", placeholder: "Total EMI amount", prefix: "₹", dependsOn: { field: "machineryLoanDetails.hasExistingLoans", value: "yes" } },
      { name: "existingLoans.bankName", label: "If Yes, Bank Name(s) (बैंक का नाम)", type: "text", placeholder: "Bank Name(s)", dependsOn: { field: "machineryLoanDetails.hasExistingLoans", value: "yes" } },
      { name: "existingLoans.outstandingAmount", label: "If Yes, Total Outstanding Amount (कुल बकाया राशि)", type: "number", placeholder: "Total outstanding amount", prefix: "₹", dependsOn: { field: "machineryLoanDetails.hasExistingLoans", value: "yes" } },
    ]
  },
  {
    title: "Upload Required Documents",
    subtitle: "Accepted File Types: PDF, Word, Excel, JPG, PNG. Max File Size: 10 MB per file.",
    fields: [
      { name: "documentUploads.quotation", label: "Machinery Quotation / Proforma Invoice", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" },
      { name: "documentUploads.panCard", label: "PAN Card", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
      { name: "documentUploads.aadhaarCard", label: "Aadhaar Card", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
      { name: "documentUploads.photograph", label: "Passport Size Photograph", type: "file", colSpan: 2, accept: ".jpg,.jpeg,.png" },
      { name: "documentUploads.gstOrUdyamCertificate", label: "GST Registration / Udyam Certificate", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
      { name: "documentUploads.bankStatement", label: "Bank Statement (Last 6–12 Months)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" },
      { name: "documentUploads.itrLast2Years", label: "ITR for Last 2 Years", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
      { name: "documentUploads.existingLoanStatement", label: "Existing Loan Statement (if applicable)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" },
    ]
  }
];

export function MachineryLoanApplicationForm({ onBack, backButtonText, initialData, applicationId, mode = 'create' }: MachineryLoanApplicationFormProps) {
  const defaultValues: MachineryLoanApplicationFormData = {
    personalDetails: { fullName: '', fatherOrHusbandName: '', dob: '', gender: undefined, mobileNumber: '', email: '', panNumber: '', aadhaarNumber: '' },
    businessDetails: {
      businessName: '',
      businessType: undefined, 
      otherBusinessType: '',
      natureOfBusiness: '',
      businessStartYear: undefined,
      businessAddress: '',
      annualTurnover: undefined,
      profitAfterTax: undefined,
    },
    machineryLoanDetails: {
      descriptionOfMachinery: '',
      supplierName: '',
      totalCostOfMachinery: undefined,
      loanAmountRequired: undefined,
      loanTenureRequired: undefined,
      hasExistingLoans: "no",
    },
    existingLoans: {
        emiAmount: undefined,
        bankName: '',
        outstandingAmount: undefined,
    },
    documentUploads: { 
        panCard: undefined,
        aadhaarCard: undefined,
        photograph: undefined,
        quotation: undefined,
        gstOrUdyamCertificate: undefined,
        bankStatement: undefined,
        itrLast2Years: undefined,
        existingLoanStatement: undefined,
    }
  };

  return (
    <GenericLoanForm
      onBack={onBack}
      backButtonText={backButtonText}
      formTitle="Machinery Loan Application Form"
      formSubtitle="Get funds to purchase new or upgrade existing machinery for your business."
      formIcon={<Cog className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={MachineryLoanApplicationSchema}
      defaultValues={initialData || defaultValues}
      sections={machineryLoanSections}
      submitAction={(data) => submitApplicationAction(data, 'loan', 'Machinery Loan')}
      updateAction={(id, data) => updateApplicationAction(id, 'loan', data)}
      applicationId={applicationId}
      mode={mode}
      submitButtonText="Submit Machinery Loan Application"
    />
  );
}
