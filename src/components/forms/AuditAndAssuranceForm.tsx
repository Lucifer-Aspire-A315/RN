
"use client";

import React from 'react';
import { AuditAndAssuranceFormSchema, type AuditAndAssuranceFormData } from '@/lib/schemas';
import { ClipboardCheck } from 'lucide-react';
import { submitApplicationAction } from '@/app/actions/applicationActions';
import { updateCAServiceApplicationAction } from '@/app/actions/caServiceActions';
import { GenericCAServiceForm } from './GenericCAServiceForm';

interface AuditAndAssuranceFormProps {
  onBack?: () => void;
  initialData?: AuditAndAssuranceFormData | null;
  applicationId?: string;
  mode?: 'create' | 'edit';
}

const auditAndAssuranceSections = [
    {
        title: "Personal Details (Contact Person)",
        fields: [
            { name: "personalDetails.fullName", label: "Full Name", type: "text", placeholder: "Full Name of Contact Person" },
            { name: "personalDetails.mobileNumber", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
            { name: "personalDetails.email", label: "Email ID", type: "email", placeholder: "example@mail.com" },
            { name: "personalDetails.panNumber", label: "PAN Number", type: "text", placeholder: "ABCDE1234F" },
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
            { name: "businessDetails.annualTurnover", label: "Last Year's Annual Turnover (₹)", type: "number", placeholder: "e.g., 5000000", prefix: "₹", colSpan: 2 },
        ]
    },
    {
        title: "Services Required",
        subtitle: "Select all that apply",
        fields: [
            { name: "servicesRequired.statutoryAudit", label: "Statutory Audit (under Companies Act)", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.taxAudit", label: "Tax Audit (under Income Tax Act)", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.internalAudit", label: "Internal Audit", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.managementAudit", label: "Management Audit", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.stockAudit", label: "Stock Audit", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.dueDiligence", label: "Due Diligence", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.otherAuditService", label: "Other", type: "checkbox", colSpan: 2 },
            { name: "servicesRequired.otherAuditServiceDetail", label: "Specify Other Service", type: "text", placeholder: "Details for other service", colSpan: 2, dependsOn: { field: "servicesRequired.otherAuditService", value: true } },
        ]
    },
    {
        title: "Upload Required Documents",
        subtitle: "Accepted File Types: PDF, Excel, JPG, PNG. Max File Size: 10 MB per document.",
        fields: [
            { name: "documentUploads.kycDocuments.panCard", label: "PAN Card of Business/Promoter", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "documentUploads.gstCertificate", label: "GST Certificate (if available)", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "documentUploads.lastFinancials", label: "Last 2 Years Financial Statements", type: "file", colSpan: 2, accept: ".pdf,.xls,.xlsx,.jpg,.jpeg,.png" },
            { name: "documentUploads.bankStatement", label: "Bank Statement (Last 1 Year)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" },
            { name: "documentUploads.existingAuditorDetails", label: "Details of Existing Auditors (if any)", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "documentUploads.otherSupportingDocs", label: "Any Other Supporting Documents", type: "file", colSpan: 2, accept: ".pdf,.xls,.xlsx,.jpg,.jpeg,.png" },
        ]
    }
];

export function AuditAndAssuranceForm({ onBack, initialData, applicationId, mode = 'create' }: AuditAndAssuranceFormProps) {
  const defaultValues: AuditAndAssuranceFormData = {
    personalDetails: {
      fullName: '',
      mobileNumber: '',
      email: '',
      panNumber: ''
    },
    businessDetails: {
      businessName: '',
      businessType: undefined,
      otherBusinessTypeDetail: '',
      annualTurnover: undefined,
    },
    servicesRequired: {
        statutoryAudit: false,
        taxAudit: false,
        internalAudit: false,
        managementAudit: false,
        stockAudit: false,
        dueDiligence: false,
        otherAuditService: false,
        otherAuditServiceDetail: '',
    },
    documentUploads: {
        kycDocuments: { panCard: undefined },
        gstCertificate: undefined,
        lastFinancials: undefined,
        bankStatement: undefined,
        existingAuditorDetails: undefined,
        otherSupportingDocs: undefined,
    }
  };

  return (
    <GenericCAServiceForm
      onBack={onBack}
      formTitle="Audit and Assurance Service Application"
      formSubtitle="Please provide the details below to avail our services."
      formIcon={<ClipboardCheck className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={AuditAndAssuranceFormSchema}
      defaultValues={initialData || defaultValues}
      sections={auditAndAssuranceSections}
      submitAction={(data) => submitApplicationAction(data, 'caService', 'Audit and Assurance Service')}
      updateAction={updateCAServiceApplicationAction}
      applicationId={applicationId}
      mode={mode}
    />
  );
}
