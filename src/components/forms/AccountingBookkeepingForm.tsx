
"use client";

import React from 'react';
import { AccountingBookkeepingFormSchema, type AccountingBookkeepingFormData } from '@/lib/schemas';
import { BookOpenCheck } from 'lucide-react';
import { submitApplicationAction } from '@/app/actions/applicationActions';
import { updateCAServiceApplicationAction } from '@/app/actions/caServiceActions';
import { GenericCAServiceForm } from './GenericCAServiceForm';

interface AccountingBookkeepingFormProps {
  onBack?: () => void;
  initialData?: AccountingBookkeepingFormData | null;
  applicationId?: string;
  mode?: 'create' | 'edit';
}

const accountingSections = [
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
        ]
    },
     {
        title: "Business Details",
        fields: [
            { name: "businessDetails.businessName", label: "Business Name", type: "text", placeholder: "Your Company Name" },
            { name: "businessDetails.businessType", label: "Business Type", type: "radio", options: [
                { value: "proprietorship", label: "Proprietorship" },
                { value: "partnership", label: "Partnership" },
                { value: "pvt_ltd", label: "Pvt Ltd" },
                { value: "llp", label: "LLP" },
                { value: "other", label: "Other" }
            ]},
            { name: "businessDetails.otherBusinessTypeDetail", label: "Specify Other Business Type", type: "text", placeholder: "Specify type", dependsOn: { field: "businessDetails.businessType", value: "other" } },
            { name: "businessDetails.natureOfBusiness", label: "Nature of Business", type: "text", placeholder: "e.g., Manufacturing, Retail, Service" },
            { name: "businessDetails.cityAndState", label: "City & State", type: "text", placeholder: "e.g., Mumbai, Maharashtra", colSpan: 2 },
        ]
    },
    {
        title: "Services Required",
        subtitle: "Select all that apply",
        fields: [
            { name: "servicesRequired.bookkeeping", label: "Bookkeeping (Monthly/Quarterly)", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.ledgerMaintenance", label: "Ledger & Journal Maintenance", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.financialStatementPreparation", label: "Profit & Loss, Balance Sheet Preparation", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.tdsFiling", label: "TDS Calculation & Filing", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.gstReconciliationFiling", label: "GST Reconciliation & Filing", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.payrollServices", label: "Payroll Services", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.otherAccountingService", label: "Other", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.otherAccountingServiceDetail", label: "Specify Other Service", type: "text", placeholder: "Details for other service", colSpan: 2, dependsOn: { field: "servicesRequired.otherAccountingService", value: true } },
        ]
    },
    {
        title: "Upload Required Documents",
        subtitle: "Accepted File Types: PDF, Word, Excel, JPG, PNG. Max File Size: 10 MB per document.",
        fields: [
            { name: "kycDocuments.photograph", label: "Applicant Photograph", type: "file", accept: ".jpg,.jpeg,.png" },
            { name: "kycDocuments.panCard", label: "PAN Card of Business/Owner", type: "file", accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "kycDocuments.aadhaarCard", label: "Aadhaar Card of Applicant", type: "file", accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "documentUploads.gstCertificate", label: "GST Certificate (if available)", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "documentUploads.previousYearFinancials", label: "Previous Year Financial Statements", type: "file", colSpan: 2, accept: ".pdf,.xls,.xlsx,.jpg,.jpeg,.png" },
            { name: "documentUploads.bankStatement", label: "Bank Statement (Last 6–12 Months)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" },
            { name: "documentUploads.invoices", label: "Invoices (Sales & Purchase - PDF/Excel)", type: "file", colSpan: 2, accept: ".pdf,.xls,.xlsx,.jpg,.jpeg,.png" },
            { name: "documentUploads.payrollData", label: "Payroll Data (if applicable)", type: "file", colSpan: 2, accept: ".pdf,.xls,.xlsx,.jpg,.jpeg,.png" },
            { name: "documentUploads.tdsTaxDetails", label: "TDS & Tax Details (if any)", type: "file", colSpan: 2, accept: ".pdf,.xls,.xlsx,.jpg,.jpeg,.png" },
            { name: "documentUploads.otherSupportingDocuments", label: "Any Other Supporting Documents", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" },
        ]
    }
];

export function AccountingBookkeepingForm({ onBack, initialData, applicationId, mode = 'create' }: AccountingBookkeepingFormProps) {
  const defaultValues: AccountingBookkeepingFormData = {
    personalDetails: {
      fullName: '',
      fatherOrHusbandName: '',
      dob: '',
      gender: undefined,
      mobileNumber: '',
      email: '',
      panNumber: '',
      aadhaarNumber: '',
    },
    businessDetails: {
      businessName: '',
      businessType: undefined,
      otherBusinessTypeDetail: '',
      natureOfBusiness: '',
      cityAndState: '',
    },
    servicesRequired: {
      bookkeeping: false,
      ledgerMaintenance: false,
      financialStatementPreparation: false,
      tdsFiling: false,
      gstReconciliationFiling: false,
      payrollServices: false,
      otherAccountingService: false,
      otherAccountingServiceDetail: '',
    },
    kycDocuments: {
        panCard: undefined,
        aadhaarCard: undefined,
        photograph: undefined,
    },
    documentUploads: {
        gstCertificate: undefined,
        previousYearFinancials: undefined,
        bankStatement: undefined,
        invoices: undefined,
        payrollData: undefined,
        tdsTaxDetails: undefined,
        otherSupportingDocuments: undefined,
    }
  };

  return (
    <GenericCAServiceForm
        onBack={onBack}
        formTitle="Accounting & Bookkeeping Service Application"
        formSubtitle="Please provide the details below to avail our services."
        formIcon={<BookOpenCheck className="w-12 h-12 mx-auto text-primary mb-2" />}
        schema={AccountingBookkeepingFormSchema}
        defaultValues={initialData || defaultValues}
        sections={accountingSections}
        submitAction={(data) => submitApplicationAction(data, 'caService', 'Accounting & Bookkeeping Service')}
        updateAction={updateCAServiceApplicationAction}
        applicationId={applicationId}
        mode={mode}
    />
  );
}
