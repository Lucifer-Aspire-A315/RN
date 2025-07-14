
"use client";

import React from 'react';
import { AuditAndAssuranceFormSchema, type AuditAndAssuranceFormData } from '@/lib/schemas';
import { ClipboardCheck } from 'lucide-react';
import { submitApplicationAction, updateApplicationAction } from '@/app/actions/applicationActions';
import type { UserApplication } from '@/lib/types';
import { GenericCAServiceForm } from './GenericCAServiceForm';
import type { UserProfileData } from '@/app/actions/profileActions';

interface AuditAndAssuranceFormProps {
  onBack?: () => void;
  initialData?: AuditAndAssuranceFormData | null;
  applicationId?: string;
  mode?: 'create' | 'edit';
  userProfile?: UserProfileData | null;
}

const auditAndAssuranceSections = [
    {
        title: "Personal Details (Contact Person)",
        fields: [
            { name: "personalDetails.fullName", label: "Full Name", type: "text", placeholder: "Full Name of Contact Person" },
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
        subtitle: "Accepted File Types: PDF, Word, Excel, JPG, PNG. Max File Size: 10 MB per document.",
        fields: [
            { name: "kycDocuments.photograph", label: "Contact Person Photograph", type: "file", accept: ".jpg,.jpeg,.png" },
            { name: "kycDocuments.panCard", label: "PAN Card of Business/Promoter", type: "file", accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "kycDocuments.aadhaarCard", label: "Aadhaar of Contact Person", type: "file", accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "documentUploads.gstCertificate", label: "GST Certificate (if available)", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "documentUploads.lastFinancials", label: "Last 2 Years Financial Statements", type: "file", colSpan: 2, accept: ".pdf,.xls,.xlsx,.jpg,.jpeg,.png" },
            { name: "documentUploads.bankStatement", label: "Bank Statement (Last 1 Year)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" },
            { name: "documentUploads.existingAuditorDetails", label: "Details of Existing Auditors (if any)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" },
            { name: "documentUploads.otherSupportingDocs", label: "Any Other Supporting Documents", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" },
        ]
    }
];

export function AuditAndAssuranceForm({ onBack, initialData, applicationId, mode = 'create', userProfile }: AuditAndAssuranceFormProps) {
  
  const prefilledData = {
    personalDetails: {
      fullName: userProfile?.fullName || '',
      email: userProfile?.email || '',
      mobileNumber: userProfile?.mobileNumber || '',
    }
  };

  const defaultValues: AuditAndAssuranceFormData = {
    personalDetails: {
      fullName: initialData?.personalDetails?.fullName || prefilledData.personalDetails.fullName,
      fatherOrHusbandName: initialData?.personalDetails?.fatherOrHusbandName || '',
      dob: initialData?.personalDetails?.dob || '',
      gender: initialData?.personalDetails?.gender || undefined,
      mobileNumber: initialData?.personalDetails?.mobileNumber || prefilledData.personalDetails.mobileNumber,
      email: initialData?.personalDetails?.email || prefilledData.personalDetails.email,
      panNumber: initialData?.personalDetails?.panNumber || '',
      aadhaarNumber: initialData?.personalDetails?.aadhaarNumber || '',
    },
    businessDetails: initialData?.businessDetails || {
      businessName: '',
      businessType: undefined,
      otherBusinessTypeDetail: '',
      annualTurnover: undefined,
    },
    servicesRequired: initialData?.servicesRequired || {
        statutoryAudit: false,
        taxAudit: false,
        internalAudit: false,
        managementAudit: false,
        stockAudit: false,
        dueDiligence: false,
        otherAuditService: false,
        otherAuditServiceDetail: '',
    },
    kycDocuments: initialData?.kycDocuments || {
        panCard: undefined,
        aadhaarCard: undefined,
        photograph: undefined,
    },
    documentUploads: initialData?.documentUploads || {
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
      defaultValues={defaultValues}
      sections={auditAndAssuranceSections}
      submitAction={(data) => submitApplicationAction(data, 'caService', 'Audit and Assurance Service')}
      updateAction={(id, data) => updateApplicationAction(id, 'caService' as UserApplication['serviceCategory'], data)}
      applicationId={applicationId}
      mode={mode}
    />
  );
}
