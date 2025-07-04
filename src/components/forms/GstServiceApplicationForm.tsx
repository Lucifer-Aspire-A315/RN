
"use client";

import React from 'react';
import { GstServiceApplicationSchema, type GstServiceApplicationFormData } from '@/lib/schemas';
import { ReceiptText } from 'lucide-react';
import { submitApplicationAction, updateApplicationAction } from '@/app/actions/applicationActions';
import type { UserApplication } from '@/lib/types';
import { GenericCAServiceForm } from './GenericCAServiceForm';

interface GstServiceApplicationFormProps {
  onBack?: () => void;
  initialData?: GstServiceApplicationFormData | null;
  applicationId?: string;
  mode?: 'create' | 'edit';
}

const gstServiceSections = [
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
            { name: "businessDetails.businessName", label: "Business Name (if any)", type: "text", placeholder: "Your Company Name" },
            { name: "businessDetails.businessType", label: "Business Type", type: "radio", options: [
                { value: "proprietorship", label: "Proprietorship" },
                { value: "partnership", label: "Partnership" },
                { value: "pvt_ltd", label: "Pvt Ltd" },
                { value: "other", label: "Other" }
            ]},
            { name: "businessDetails.otherBusinessTypeDetail", label: "Specify Other Business Type", type: "text", placeholder: "Specify type", dependsOn: { field: "businessDetails.businessType", value: "other" } },
            { name: "businessDetails.natureOfBusiness", label: "Nature of Business", type: "text", placeholder: "e.g., Manufacturing, Retail" },
            { name: "businessDetails.stateAndCity", label: "State & City", type: "text", placeholder: "e.g., Maharashtra, Mumbai" },
        ]
    },
    {
        title: "GST Service Required",
        fields: [
            { name: "gstServiceRequired.newGstRegistration", label: "New GST Registration", type: "checkbox", colSpan: 2 },
            { name: "gstServiceRequired.gstReturnFiling", label: "GST Return Filing (Monthly/Quarterly)", type: "checkbox", colSpan: 2 },
            { name: "gstServiceRequired.gstCancellationAmendment", label: "GST Cancellation / Amendment", type: "checkbox", colSpan: 2 },
            { name: "gstServiceRequired.gstAudit", label: "GST Audit", type: "checkbox", colSpan: 2 },
            { name: "gstServiceRequired.gstNoticeHandling", label: "GST Notice Handling", type: "checkbox", colSpan: 2 },
            { name: "gstServiceRequired.otherGstService", label: "Other", type: "checkbox", colSpan: 2 },
            { name: "gstServiceRequired.otherGstServiceDetail", label: "Specify Other GST Service", type: "text", placeholder: "Details for other service", colSpan: 2, dependsOn: { field: "gstServiceRequired.otherGstService", value: true } },
        ]
    },
    {
        title: "Upload Required Documents",
        subtitle: "Accepted File Types: PDF, JPG, PNG. Max File Size: 10 MB per document.",
        fields: [
            { name: "kycDocuments.panCard", label: "PAN Card of Applicant/Business", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "kycDocuments.aadhaarCard", label: "Aadhaar Card of Proprietor/Director", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "kycDocuments.photograph", label: "Passport Size Photo (JPG/PNG)", type: "file", colSpan: 2, accept: ".jpg,.jpeg,.png" },
            { name: "documentUploads.businessProof", label: "Business Proof (e.g., Shop Act/License)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png" },
            { name: "documentUploads.addressProof", label: "Electricity Bill / Rent Agreement (Address Proof)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png" },
            { name: "documentUploads.bankDetails", label: "Cancelled Cheque or Bank Passbook (1st page)", type: "file", colSpan: 2, accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "documentUploads.digitalSignature", label: "Digital Signature (If available)", type: "file", colSpan: 2, accept: ".pdf" },
        ]
    }
];

export function GstServiceApplicationForm({ onBack, initialData, applicationId, mode = 'create' }: GstServiceApplicationFormProps) {
  const defaultValues: GstServiceApplicationFormData = {
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
      stateAndCity: '',
    },
    gstServiceRequired: {
      newGstRegistration: false,
      gstReturnFiling: false,
      gstCancellationAmendment: false,
      gstAudit: false,
      gstNoticeHandling: false,
      otherGstService: false,
      otherGstServiceDetail: '',
    },
    kycDocuments: {
      panCard: undefined,
      aadhaarCard: undefined,
      photograph: undefined
    },
    documentUploads: {
        businessProof: undefined,
        addressProof: undefined,
        bankDetails: undefined,
        digitalSignature: undefined,
    }
  };

  return (
    <GenericCAServiceForm
      onBack={onBack}
      formTitle="GST Service Application Form"
      formSubtitle="Please fill in the details below to apply for GST related services."
      formIcon={<ReceiptText className="w-12 h-12 mx-auto text-primary mb-2" />}
      schema={GstServiceApplicationSchema}
      defaultValues={initialData || defaultValues}
      sections={gstServiceSections}
      submitAction={(data) => submitApplicationAction(data, 'caService', 'GST Service Application')}
      updateAction={(id, data) => updateApplicationAction(id, 'caService' as UserApplication['serviceCategory'], data)}
      applicationId={applicationId}
      mode={mode}
    />
  );
}
