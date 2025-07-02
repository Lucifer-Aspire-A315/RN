
"use client";

import React from 'react';
import { FinancialAdvisoryFormSchema, type FinancialAdvisoryFormData } from '@/lib/schemas';
import { PiggyBank } from 'lucide-react';
import { submitApplicationAction } from '@/app/actions/applicationActions';
import { updateCAServiceApplicationAction } from '@/app/actions/caServiceActions';
import { GenericCAServiceForm } from './GenericCAServiceForm';

interface FinancialAdvisoryFormProps {
  onBack?: () => void;
  initialData?: FinancialAdvisoryFormData | null;
  applicationId?: string;
  mode?: 'create' | 'edit';
}

const financialAdvisorySections = [
    {
        title: "Personal Details",
        fields: [
            { name: "personalDetails.fullName", label: "Full Name", type: "text", placeholder: "Full Name" },
            { name: "personalDetails.mobileNumber", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile" },
            { name: "personalDetails.email", label: "Email ID", type: "email", placeholder: "example@mail.com" },
            { name: "personalDetails.dob", label: "Date of Birth", type: "date" },
            { name: "personalDetails.panNumber", label: "PAN Number", type: "text", placeholder: "ABCDE1234F" },
            { name: "personalDetails.aadhaarNumber", label: "Aadhaar Number", type: "text", placeholder: "123456789012" },
            { name: "personalDetails.occupation", label: "Occupation", type: "radio", colSpan: 2, options: [
                { value: "salaried", label: "Salaried" },
                { value: "business", label: "Business" },
                { value: "professional", label: "Professional" },
                { value: "retired", label: "Retired" },
                { value: "other", label: "Other" }
            ]},
            { name: "personalDetails.otherOccupationDetail", label: "Specify Other Occupation", type: "text", placeholder: "Specify occupation", dependsOn: { field: "personalDetails.occupation", value: "other" } },
            { name: "personalDetails.cityAndState", label: "City & State", type: "text", placeholder: "e.g., Mumbai, Maharashtra" },
            { name: "personalDetails.maritalStatus", label: "Marital Status", type: "radio", options: [{ value: "single", label: "Single" }, { value: "married", label: "Married" }] },
            { name: "personalDetails.dependentMembersAdults", label: "Dependent Adults", type: "number", placeholder: "e.g., 2" },
            { name: "personalDetails.dependentMembersChildren", label: "Dependent Children", type: "number", placeholder: "e.g., 1" },
        ]
    },
    {
        title: "Advisory Services Required",
        subtitle: "Select all that apply",
        fields: [
            { name: "advisoryServicesRequired.taxSavingPlan", label: "Tax Saving Plan (under 80C, 80D, etc.)", type: "checkbox", colSpan: 2 },
            { name: "advisoryServicesRequired.investmentPlanning", label: "Investment Planning (Mutual Funds, FD, PPF)", type: "checkbox", colSpan: 2 },
            { name: "advisoryServicesRequired.retirementPlanning", label: "Retirement Planning", type: "checkbox", colSpan: 2 },
            { name: "advisoryServicesRequired.insuranceAdvisory", label: "Insurance Advisory (Term / Health / Life)", type: "checkbox", colSpan: 2 },
            { name: "advisoryServicesRequired.wealthManagement", label: "Wealth Management", type: "checkbox", colSpan: 2 },
            { name: "advisoryServicesRequired.childEducationPlanning", label: "Child Education Planning", type: "checkbox", colSpan: 2 },
            { name: "advisoryServicesRequired.nriFinancialAdvisory", label: "NRI Financial Advisory", type: "checkbox", colSpan: 2 },
            { name: "advisoryServicesRequired.otherAdvisoryService", label: "Other", type: "checkbox", colSpan: 2 },
            { name: "advisoryServicesRequired.otherAdvisoryServiceDetail", label: "Specify Other Service", type: "text", placeholder: "Details for other service", colSpan: 2, dependsOn: { field: "advisoryServicesRequired.otherAdvisoryService", value: true } },
        ]
    },
    {
        title: "Current Financial Overview",
        fields: [
            { name: "currentFinancialOverview.annualIncome", label: "Annual Income (approx) (₹)", type: "number", placeholder: "e.g., 1200000" },
            { name: "currentFinancialOverview.monthlySavings", label: "Monthly Savings (avg) (₹)", type: "number", placeholder: "e.g., 25000" },
            { name: "currentFinancialOverview.currentInvestmentsAmount", label: "Current Investments (approx) (₹)", type: "number", placeholder: "e.g., 500000" },
            { name: "currentFinancialOverview.currentInvestmentsTypes.licInsurance", label: "LIC / Insurance", type: "checkbox", colSpan: 1 },
            { name: "currentFinancialOverview.currentInvestmentsTypes.ppfEpf", label: "PPF / EPF", type: "checkbox", colSpan: 1 },
            { name: "currentFinancialOverview.currentInvestmentsTypes.mutualFunds", label: "Mutual Funds", type: "checkbox", colSpan: 1 },
            { name: "currentFinancialOverview.currentInvestmentsTypes.fdRd", label: "FD / RD", type: "checkbox", colSpan: 1 },
            { name: "currentFinancialOverview.currentInvestmentsTypes.realEstate", label: "Real Estate", type: "checkbox", colSpan: 1 },
            { name: "currentFinancialOverview.currentInvestmentsTypes.none", label: "None", type: "checkbox", colSpan: 1 },
        ]
    },
    {
        title: "Upload Required Documents",
        subtitle: "Optional but Recommended. Accepted File Types: PDF, Word, JPG, PNG. Max File Size: 5 MB per document.",
        fields: [
            { name: "kycDocuments.photograph", label: "Applicant Photograph", type: "file", accept: ".jpg,.jpeg,.png" },
            { name: "kycDocuments.panCard", label: "PAN Card", type: "file", accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "kycDocuments.aadhaarCard", label: "Aadhaar Card", type: "file", accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "documentUploads.salarySlipsIncomeProof", label: "Salary Slips / Income Proof", type: "file", colSpan: 2 },
            { name: "documentUploads.lastYearItrForm16", label: "Last Year’s ITR or Form 16", type: "file", colSpan: 2 },
            { name: "documentUploads.bankStatement", label: "Bank Statement (3–6 Months)", type: "file", colSpan: 2, accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png" },
            { name: "documentUploads.investmentProofs", label: "Investment Proofs (Mutual Funds, LIC, etc.)", type: "file", colSpan: 2 },
            { name: "documentUploads.existingLoanEmiDetails", label: "Existing Loan / EMI Details (if any)", type: "file", colSpan: 2 },
        ]
    }
];

export function FinancialAdvisoryForm({ onBack, initialData, applicationId, mode = 'create' }: FinancialAdvisoryFormProps) {
  const defaultValues: FinancialAdvisoryFormData = {
    personalDetails: {
      fullName: '',
      mobileNumber: '',
      email: '',
      dob: '',
      occupation: undefined,
      otherOccupationDetail: '',
      cityAndState: '',
      maritalStatus: undefined,
      dependentMembersAdults: undefined,
      dependentMembersChildren: undefined,
      panNumber: '',
      aadhaarNumber: '',
      fatherOrHusbandName: '',
      gender: undefined,
    },
    advisoryServicesRequired: {
      taxSavingPlan: false,
      investmentPlanning: false,
      retirementPlanning: false,
      insuranceAdvisory: false,
      wealthManagement: false,
      childEducationPlanning: false,
      nriFinancialAdvisory: false,
      otherAdvisoryService: false,
      otherAdvisoryServiceDetail: '',
    },
    currentFinancialOverview: {
      annualIncome: undefined,
      monthlySavings: undefined,
      currentInvestmentsAmount: undefined,
      currentInvestmentsTypes: {
        licInsurance: false,
        ppfEpf: false,
        mutualFunds: false,
        fdRd: false,
        realEstate: false,
        none: false,
      },
    },
    kycDocuments: {
      panCard: undefined,
      aadhaarCard: undefined,
      photograph: undefined,
    },
    documentUploads: {
        salarySlipsIncomeProof: undefined,
        lastYearItrForm16: undefined,
        bankStatement: undefined,
        investmentProofs: undefined,
        existingLoanEmiDetails: undefined,
    }
  };

  return (
    <GenericCAServiceForm
        onBack={onBack}
        formTitle="Financial Advisory Service Application"
        formSubtitle="Please provide the details below to help us understand your financial needs."
        formIcon={<PiggyBank className="w-12 h-12 mx-auto text-primary mb-2" />}
        schema={FinancialAdvisoryFormSchema}
        defaultValues={initialData || defaultValues}
        sections={financialAdvisorySections}
        submitAction={(data) => submitApplicationAction(data, 'caService', 'Financial Advisory Service')}
        updateAction={updateCAServiceApplicationAction}
        applicationId={applicationId}
        mode={mode}
    />
  );
}
