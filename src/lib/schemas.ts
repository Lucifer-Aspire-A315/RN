
import { z } from 'zod';

// #region --- REUSABLE FILE & FIELD SCHEMAS ---

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const ACCEPTED_EXCEL_TYPES = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
const ACCEPTED_WORD_TYPES = ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const ACCOUNTING_ACCEPTED_TYPES = [...ACCEPTED_DOCUMENT_TYPES, ...ACCEPTED_EXCEL_TYPES];
const ACCEPTED_BANK_STATEMENT_TYPES = [...ACCEPTED_DOCUMENT_TYPES, ...ACCEPTED_EXCEL_TYPES, ...ACCEPTED_WORD_TYPES];


const fileSchema = (types: string[]) => z.instanceof(File, { message: "File is required." })
  .refine(file => file.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
  .refine(file => types.includes(file.type), `Unsupported file type.`)
  .optional()
  .nullable();

const stringOrFileSchema = (types: string[]) => z.union([
  z.string().url({ message: "Invalid URL." }).optional().nullable(),
  fileSchema(types)
]);

// #endregion

// #region --- GOLDEN SCHEMAS (NEW STANDARD) ---

export const PersonalDetailsSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  fatherOrHusbandName: z.string().min(1, "This field is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  gender: z.enum(['male', 'female', 'other'], { required_error: "Gender is required" }),
  email: z.string().email("Invalid email address"),
  mobileNumber: z.string().regex(/^\d{10}$/, "A valid 10-digit mobile number is required"),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  aadhaarNumber: z.string().regex(/^\d{12}$/, "Invalid Aadhaar format (must be 12 digits)"),
});
export type PersonalDetailsFormData = z.infer<typeof PersonalDetailsSchema>;

export const AddressSchema = z.object({
  currentAddress: z.string().min(1, "Current address is required"),
  isPermanentAddressSame: z.enum(['yes', 'no'], { required_error: "Please select an option" }),
  permanentAddress: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.isPermanentAddressSame === 'no' && !data.permanentAddress?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Permanent address is required", path: ["permanentAddress"] });
    }
});
export type AddressFormData = z.infer<typeof AddressSchema>;

export const KycDocumentsSchema = z.object({
  panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).refine(val => val, { message: "PAN Card is required." }),
  aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).refine(val => val, { message: "Aadhaar Card is required." }),
  photograph: stringOrFileSchema(ACCEPTED_IMAGE_TYPES).refine(val => val, { message: "Photograph is required." }),
});
export type KycDocumentsFormData = z.infer<typeof KycDocumentsSchema>;

// #endregion


// #region --- REUSABLE FORM SECTION SCHEMAS ---

export const EmploymentIncomeSchema = z.object({
  employmentType: z.enum(["salaried", "self-employed"], { required_error: "Occupation Type is required" }),
  companyName: z.string().min(1, "Company / Business Name is required"),
  monthlyIncome: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Must be a number" }).min(0, "Monthly income cannot be negative")
  ),
  yearsInCurrentJobOrBusiness: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Must be a number" }).min(0, "Years cannot be negative")
  ).optional(),
});

export const ExistingLoansSchema = z.object({
  bankName: z.string().optional(),
  outstandingAmount: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Must be a number" }).min(0)
  ).optional(),
  emiAmount: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Must be a number" }).min(0)
  ).optional(),
});
export type ExistingLoansFormData = z.infer<typeof ExistingLoansSchema>;

// #endregion

// #region --- HOME LOAN ---

const HomeLoanPropertyDetailsSchema = z.object({
  loanAmountRequired: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Loan Amount Required is required")),
  loanTenureRequired: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Loan Tenure is required (in years)")),
  purposeOfLoan: z.enum(["purchase", "construction", "renovation", "transfer"], { required_error: "Purpose of Loan is required" }),
  propertyLocation: z.string().min(1, "Property Location is required"),
  estimatedPropertyValue: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Estimated property value is required")),
  propertyType: z.enum(["apartment", "independent_house", "plot_construction"], { required_error: "Property Type is required" }),
  hasExistingLoans: z.enum(["yes", "no"], { required_error: "Please specify if you have existing loans" }),
});

const HomeLoanDocumentUploadsSchema = z.object({
  incomeProof: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  propertyDocs: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  allotmentLetter: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  employmentProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  existingLoanStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
}).merge(KycDocumentsSchema);

export const HomeLoanApplicationSchema = z.object({
  personalDetails: PersonalDetailsSchema,
  addressDetails: AddressSchema,
  employmentIncome: EmploymentIncomeSchema,
  loanPropertyDetails: HomeLoanPropertyDetailsSchema,
  existingLoans: ExistingLoansSchema.optional(),
  documentUploads: HomeLoanDocumentUploadsSchema.optional(),
}).superRefine((data, ctx) => {
  if (data.loanPropertyDetails.hasExistingLoans === "yes") {
      const loanData = data.existingLoans;
      if (!loanData || loanData.emiAmount === undefined || loanData.emiAmount <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid EMI is required.", path: ["existingLoans", "emiAmount"] });
      }
      if (!loanData || !loanData.bankName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bank name is required.", path: ["existingLoans", "bankName"] });
      }
      if (!loanData || loanData.outstandingAmount === undefined || loanData.outstandingAmount < 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid outstanding amount is required.", path: ["existingLoans", "outstandingAmount"] });
      }
  }
});
export type HomeLoanApplicationFormData = z.infer<typeof HomeLoanApplicationSchema>;

// #endregion

// #region --- PERSONAL LOAN ---

const PersonalLoanDetailsSchema = z.object({
    loanAmountRequired: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Loan amount is required")),
    purposeOfLoan: z.enum(["medical_emergency", "travel", "education", "wedding", "home_renovation", "other"], { required_error: "Purpose of Loan is required" }),
    otherPurposeOfLoan: z.string().optional(),
    loanTenureRequired: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Loan tenure is required (in months)")),
    hasExistingLoans: z.enum(["yes", "no"], { required_error: "Please specify if you have existing loans" }),
  }).superRefine((data, ctx) => {
    if (data.purposeOfLoan === "other" && (!data.otherPurposeOfLoan || data.otherPurposeOfLoan.trim() === "")) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other purpose of loan", path: ["otherPurposeOfLoan"] });
    }
});

const PersonalLoanDocumentUploadsSchema = z.object({
  incomeProof: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  employmentProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  existingLoanStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
}).merge(KycDocumentsSchema);

export const PersonalLoanApplicationSchema = z.object({
  personalDetails: PersonalDetailsSchema,
  addressDetails: AddressSchema,
  employmentIncome: EmploymentIncomeSchema,
  loanDetails: PersonalLoanDetailsSchema,
  existingLoans: ExistingLoansSchema.optional(),
  documentUploads: PersonalLoanDocumentUploadsSchema.optional(),
}).superRefine((data, ctx) => {
  if (data.loanDetails.hasExistingLoans === "yes") {
    const loanData = data.existingLoans;
    if (!loanData || loanData.emiAmount === undefined || loanData.emiAmount <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid EMI is required.", path: ["existingLoans", "emiAmount"] });
    }
    if (!loanData || !loanData.bankName) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bank name is required.", path: ["existingLoans", "bankName"] });
    }
  }
});
export type PersonalLoanApplicationFormData = z.infer<typeof PersonalLoanApplicationSchema>;

// #endregion

// #region --- BUSINESS LOAN ---

export const BusinessDetailsSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.enum(["proprietorship", "partnership", "pvt_ltd", "other"], { required_error: "Business type is required" }),
  otherBusinessType: z.string().optional(),
  natureOfBusiness: z.string().min(1, "Nature of business is required"),
  businessStartYear: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1900, "Invalid year").max(new Date().getFullYear(), "Invalid year")),
  businessAddress: z.string().min(1, "Business address is required"),
  annualTurnover: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0, "Annual turnover cannot be negative")),
  profitAfterTax: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0, "Profit after tax cannot be negative")),
}).superRefine((data, ctx) => {
  if (data.businessType === "other" && (!data.otherBusinessType || data.otherBusinessType.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other business type", path: ["otherBusinessType"] });
  }
});

const BusinessLoanDetailsSchema = z.object({
  loanAmountRequired: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Loan amount is required")),
  loanTenureRequired: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Loan tenure is required (in months)")),
  purposeOfLoan: z.enum(["working_capital", "machinery_purchase", "business_expansion", "other"], { required_error: "Purpose of loan is required" }),
  otherPurposeOfLoan: z.string().optional(),
  hasExistingLoans: z.enum(["yes", "no"], { required_error: "Please specify if you have existing loans" }),
}).superRefine((data, ctx) => {
  if (data.purposeOfLoan === "other" && (!data.otherPurposeOfLoan || data.otherPurposeOfLoan.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other purpose of loan", path: ["otherPurposeOfLoan"] });
  }
});

const BusinessLoanDocumentUploadsSchema = z.object({
  gstOrUdyamCertificate: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  businessProof: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  itrLast2Years: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  balanceSheetAndPL: stringOrFileSchema(ACCOUNTING_ACCEPTED_TYPES),
  existingLoanStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
  machineryQuotation: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
}).merge(KycDocumentsSchema);

export const BusinessLoanApplicationSchema = z.object({
  personalDetails: PersonalDetailsSchema,
  businessDetails: BusinessDetailsSchema,
  loanDetails: BusinessLoanDetailsSchema,
  existingLoans: ExistingLoansSchema.optional(),
  documentUploads: BusinessLoanDocumentUploadsSchema.optional(),
}).superRefine((data, ctx) => {
    if (data.loanDetails.hasExistingLoans === "yes") {
        const loanData = data.existingLoans;
        if (!loanData || loanData.emiAmount === undefined || loanData.emiAmount <= 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid EMI is required.", path: ["existingLoans", "emiAmount"] });
        }
        if (!loanData || !loanData.bankName) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bank name is required.", path: ["existingLoans", "bankName"] });
        }
    }
});
export type BusinessLoanApplicationFormData = z.infer<typeof BusinessLoanApplicationSchema>;

// #endregion

// #region --- CREDIT CARD ---

const CreditCardAddressSchema = z.object({
  currentAddress: z.string().min(1, "Current address is required"),
});

const CreditCardPreferencesSchema = z.object({
  preferredCardType: z.enum(["basic", "rewards", "travel", "business", "other"], { required_error: "Preferred card type is required" }),
  otherPreferredCardType: z.string().optional(),
  hasExistingCreditCard: z.enum(["yes", "no"], { required_error: "Specify if you have existing credit cards" }),
  existingCreditCardIssuer: z.string().optional(),
  existingCreditCardLimit: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0)).optional(),
}).superRefine((data, ctx) => {
  if (data.preferredCardType === "other" && (!data.otherPreferredCardType || data.otherPreferredCardType.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other card type", path: ["otherPreferredCardType"] });
  }
  if (data.hasExistingCreditCard === "yes") {
    if (!data.existingCreditCardIssuer) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Issuer name is required", path: ["existingCreditCardIssuer"] });
    }
    if (data.existingCreditCardLimit === undefined || data.existingCreditCardLimit <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid credit limit is required", path: ["existingCreditCardLimit"] });
    }
  }
});

const CreditCardDocumentUploadsSchema = z.object({
  incomeProof: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  employmentProof: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  existingCreditCardStatement: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
}).merge(KycDocumentsSchema);

export const CreditCardApplicationSchema = z.object({
  personalDetails: PersonalDetailsSchema,
  addressDetails: CreditCardAddressSchema,
  employmentIncome: EmploymentIncomeSchema,
  creditCardPreferences: CreditCardPreferencesSchema,
  documentUploads: CreditCardDocumentUploadsSchema.optional(),
});
export type CreditCardApplicationFormData = z.infer<typeof CreditCardApplicationSchema>;

// #endregion

// #region --- MACHINERY LOAN ---

const MachineryLoanDetailsSchema = z.object({
  descriptionOfMachinery: z.string().min(1, "Description of machinery is required"),
  supplierName: z.string().min(1, "Supplier name is required"),
  totalCostOfMachinery: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Total cost is required")),
  loanAmountRequired: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Loan amount is required")),
  loanTenureRequired: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Loan tenure is required (in months)")),
  hasExistingLoans: z.enum(["yes", "no"], { required_error: "Please specify if you have existing loans" }),
});

const MachineryLoanDocumentUploadsSchema = z.object({
  quotation: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  gstOrUdyamCertificate: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  itrLast2Years: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  existingLoanStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
}).merge(KycDocumentsSchema);

export const MachineryLoanApplicationSchema = z.object({
  personalDetails: PersonalDetailsSchema,
  businessDetails: BusinessDetailsSchema,
  machineryLoanDetails: MachineryLoanDetailsSchema,
  existingLoans: ExistingLoansSchema.optional(),
  documentUploads: MachineryLoanDocumentUploadsSchema.optional(),
}).superRefine((data, ctx) => {
    if (data.machineryLoanDetails.hasExistingLoans === "yes") {
        const loanData = data.existingLoans;
        if (!loanData || loanData.emiAmount === undefined || loanData.emiAmount <= 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid EMI is required.", path: ["existingLoans", "emiAmount"] });
        }
        if (!loanData || !loanData.bankName) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bank name is required.", path: ["existingLoans", "bankName"] });
        }
    }
});
export type MachineryLoanApplicationFormData = z.infer<typeof MachineryLoanApplicationSchema>;

// #endregion

// #region --- GOVERNMENT SCHEME LOAN ---

export const GovernmentSchemePersonalDetailsSchema = PersonalDetailsSchema.extend({
  category: z.enum(["general", "sc", "st", "obc"], { required_error: "Category is required" }),
  maritalStatus: z.enum(["single", "married"], { required_error: "Marital Status is required" }),
});


export const GovernmentSchemeAddressSchema = z.object({
  residentialAddress: z.string().min(1, "Residential Address is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid Pincode"),
});

export const GovernmentSchemeBusinessInfoSchema = z.object({
  businessName: z.string().optional(),
  businessType: z.enum(["proprietorship", "partnership", "other"], { required_error: "Type of Business is required" }),
  otherBusinessType: z.string().optional(),
  businessLocation: z.string().min(1, "Business Location is required"),
  yearsInBusiness: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0, "Years in business cannot be negative")),
  sector: z.enum(["manufacturing", "service", "trading"], { required_error: "Sector is required" }),
  loanPurpose: z.enum(["new_setup", "expansion", "working_capital"], { required_error: "Loan Purpose is required" }),
}).superRefine((data, ctx) => {
  if (data.businessType === "other" && (!data.otherBusinessType || data.otherBusinessType.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other business type", path: ["otherBusinessType"] });
  }
});

export const GovernmentSchemeLoanDetailsSchema = z.object({
  selectedScheme: z.string().min(1, "Loan scheme is required"),
  otherSchemeName: z.string().optional(),
  loanAmountRequired: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Loan Amount Required is required")),
  loanTenure: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(1, "Loan Tenure is required (in years)")),
}).superRefine((data, ctx) => {
    if (data.selectedScheme === 'Other' && (!data.otherSchemeName || data.otherSchemeName.trim() === '')) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify the scheme name.", path: ["otherSchemeName"] });
    }
});

export const GovernmentSchemeDocumentUploadsSchema = z.object({
  businessProof: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  casteCertificate: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  incomeCertificate: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
  projectReport: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
  existingLoanStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
}).merge(KycDocumentsSchema);

export const GovernmentSchemeLoanApplicationSchema = z.object({
  personalDetails: GovernmentSchemePersonalDetailsSchema,
  addressInformation: GovernmentSchemeAddressSchema,
  businessInformation: GovernmentSchemeBusinessInfoSchema,
  loanDetails: GovernmentSchemeLoanDetailsSchema,
  documentUploads: GovernmentSchemeDocumentUploadsSchema.optional(),
});
export type GovernmentSchemeLoanApplicationFormData = z.infer<typeof GovernmentSchemeLoanApplicationSchema>;

// #endregion

// #region --- CA SERVICE SCHEMAS ---

// GST Service
export const GstBusinessDetailsSchema = z.object({
    businessName: z.string().optional(),
    businessType: z.enum(["proprietorship", "partnership", "pvt_ltd", "other"], { required_error: "Business type is required" }),
    otherBusinessTypeDetail: z.string().optional(),
    natureOfBusiness: z.string().min(1, "Nature of Business is required"),
    stateAndCity: z.string().min(1, "State & City are required"),
}).superRefine((data, ctx) => {
    if (data.businessType === "other" && (!data.otherBusinessTypeDetail || data.otherBusinessTypeDetail.trim() === "")) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other business type", path: ["otherBusinessTypeDetail"] });
    }
});


export const GstServiceRequiredSchema = z.object({
  newGstRegistration: z.boolean().optional().default(false),
  gstReturnFiling: z.boolean().optional().default(false),
  gstCancellationAmendment: z.boolean().optional().default(false),
  gstAudit: z.boolean().optional().default(false),
  gstNoticeHandling: z.boolean().optional().default(false),
  otherGstService: z.boolean().optional().default(false),
  otherGstServiceDetail: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.otherGstService && (!data.otherGstServiceDetail || data.otherGstServiceDetail.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other GST service details.", path: ["otherGstServiceDetail"] });
  }
  const { otherGstServiceDetail, ...services } = data;
  if (!Object.values(services).some(val => val === true)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "At least one GST service must be selected.", path: ["newGstRegistration"] });
  }
});

export const GstDocumentUploadSchema = z.object({
  businessProof: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
  addressProof: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  bankDetails: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  digitalSignature: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
});

export const GstServiceApplicationSchema = z.object({
  personalDetails: PersonalDetailsSchema,
  businessDetails: GstBusinessDetailsSchema,
  gstServiceRequired: GstServiceRequiredSchema,
  kycDocuments: KycDocumentsSchema,
  documentUploads: GstDocumentUploadSchema.optional(),
});
export type GstServiceApplicationFormData = z.infer<typeof GstServiceApplicationSchema>;

// ITR Filing
const ItrPersonalDetailsSchema = PersonalDetailsSchema.extend({
  address: z.string().min(1, "Address is required"),
  cityAndState: z.string().min(1, "City & State are required"),
});

export const IncomeSourceTypeSchema = z.object({
  salariedEmployee: z.boolean().optional().default(false),
  businessIncome: z.boolean().optional().default(false),
  freelanceProfessional: z.boolean().optional().default(false),
  capitalGains: z.boolean().optional().default(false),
  housePropertyIncome: z.boolean().optional().default(false),
  otherIncomeSource: z.boolean().optional().default(false),
  otherIncomeSourceDetail: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.otherIncomeSource && (!data.otherIncomeSourceDetail || data.otherIncomeSourceDetail.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other income source details.", path: ["otherIncomeSourceDetail"] });
  }
  const { otherIncomeSourceDetail, ...sources } = data;
  if (!Object.values(sources).some(val => val === true)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "At least one income source must be selected.", path: ["salariedEmployee"] });
  }
});

export const ItrDocumentUploadSchema = z.object({
  form16: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  salarySlips: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  investmentProofs: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
  rentReceipts: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
  capitalGainStatement: stringOrFileSchema(ACCOUNTING_ACCEPTED_TYPES).optional(),
  businessIncomeProof: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
});

export const ItrFilingConsultationFormSchema = z.object({
  personalDetails: ItrPersonalDetailsSchema,
  incomeSourceType: IncomeSourceTypeSchema,
  kycDocuments: KycDocumentsSchema,
  documentUploads: ItrDocumentUploadSchema.optional(),
});
export type ItrFilingConsultationFormData = z.infer<typeof ItrFilingConsultationFormSchema>;

// Accounting & Bookkeeping
const AccountingBusinessDetailsSchema = z.object({
  businessName: z.string().min(1, "Business Name is required"),
  businessType: z.enum(["proprietorship", "partnership", "pvt_ltd", "llp", "other"], { required_error: "Business type is required" }),
  otherBusinessTypeDetail: z.string().optional(),
  natureOfBusiness: z.string().min(1, "Nature of Business is required"),
  cityAndState: z.string().min(1, "City & State are required"),
}).superRefine((data, ctx) => {
  if (data.businessType === "other" && (!data.otherBusinessTypeDetail || data.otherBusinessTypeDetail.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other business type", path: ["otherBusinessTypeDetail"] });
  }
});


export const AccountingServicesRequiredSchema = z.object({
  bookkeeping: z.boolean().optional().default(false),
  ledgerMaintenance: z.boolean().optional().default(false),
  financialStatementPreparation: z.boolean().optional().default(false),
  tdsFiling: z.boolean().optional().default(false),
  gstReconciliationFiling: z.boolean().optional().default(false),
  payrollServices: z.boolean().optional().default(false),
  otherAccountingService: z.boolean().optional().default(false),
  otherAccountingServiceDetail: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.otherAccountingService && (!data.otherAccountingServiceDetail || data.otherAccountingServiceDetail.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other service details.", path: ["otherAccountingServiceDetail"] });
  }
  const { otherAccountingServiceDetail, ...services } = data;
  if (!Object.values(services).some(val => val === true)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "At least one service must be selected.", path: ["bookkeeping"] });
  }
});

export const AccountingDocumentUploadSchema = z.object({
  gstCertificate: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  previousYearFinancials: stringOrFileSchema(ACCOUNTING_ACCEPTED_TYPES).optional(),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  invoices: stringOrFileSchema(ACCOUNTING_ACCEPTED_TYPES).optional(),
  payrollData: stringOrFileSchema(ACCOUNTING_ACCEPTED_TYPES).optional(),
  tdsTaxDetails: stringOrFileSchema(ACCOUNTING_ACCEPTED_TYPES).optional(),
  otherSupportingDocuments: stringOrFileSchema(ACCOUNTING_ACCEPTED_TYPES).optional(),
});

export const AccountingBookkeepingFormSchema = z.object({
  personalDetails: PersonalDetailsSchema,
  businessDetails: AccountingBusinessDetailsSchema,
  servicesRequired: AccountingServicesRequiredSchema,
  kycDocuments: KycDocumentsSchema,
  documentUploads: AccountingDocumentUploadSchema.optional(),
});
export type AccountingBookkeepingFormData = z.infer<typeof AccountingBookkeepingFormSchema>;

// Company Incorporation
const CompanyIncorporationPersonalDetailsSchema = PersonalDetailsSchema.extend({
  occupation: z.enum(["business", "job", "student", "other"], { required_error: "Occupation is required" }),
  otherOccupationDetail: z.string().optional(),
  residentialAddress: z.string().min(1, "Residential Address is required"),
  cityAndState: z.string().min(1, "City & State are required"),
}).superRefine((data, ctx) => {
  if (data.occupation === "other" && (!data.otherOccupationDetail || data.otherOccupationDetail.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other occupation", path: ["otherOccupationDetail"] });
  }
});

export const IncorporationCompanyDetailsSchema = z.object({
  companyType: z.enum(["pvt_ltd", "llp", "opc", "partnership", "other"], { required_error: "Type of Company is required" }),
  otherCompanyTypeDetail: z.string().optional(),
  proposedCompanyName1: z.string().min(1, "At least one proposed company name is required"),
  proposedCompanyName2: z.string().optional(),
  proposedCompanyName3: z.string().optional(),
  businessActivity: z.string().min(1, "Business Activity / Nature of Work is required"),
  proposedBusinessAddress: z.string().min(1, "Proposed Business Address is required"),
}).superRefine((data, ctx) => {
  if (data.companyType === "other" && (!data.otherCompanyTypeDetail || data.otherCompanyTypeDetail.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other company type", path: ["otherCompanyTypeDetail"] });
  }
});

export const IncorporationDirectorsPartnersSchema = z.object({
  numberOfDirectorsPartners: z.enum(["1", "2", "3", "4+"], { required_error: "Number of Directors / Partners is required" }),
});

export const IncorporationDocumentUploadsSchema = z.object({
  businessAddressProof: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  directorBankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  dsc: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
});

export const IncorporationOptionalServicesSchema = z.object({
  gstRegistration: z.boolean().optional().default(false),
  msmeRegistration: z.boolean().optional().default(false),
  trademarkFiling: z.boolean().optional().default(false),
  openBusinessBankAccount: z.boolean().optional().default(false),
  accountingTaxSetup: z.boolean().optional().default(false),
});

export const CompanyIncorporationFormSchema = z.object({
  personalDetails: CompanyIncorporationPersonalDetailsSchema,
  companyDetails: IncorporationCompanyDetailsSchema,
  directorsPartners: IncorporationDirectorsPartnersSchema,
  kycDocuments: KycDocumentsSchema,
  documentUploads: IncorporationDocumentUploadsSchema.optional(),
  optionalServices: IncorporationOptionalServicesSchema.optional(),
});
export type CompanyIncorporationFormData = z.infer<typeof CompanyIncorporationFormSchema>;

// Financial Advisory
const FinancialAdvisoryPersonalDetailsSchema = PersonalDetailsSchema.extend({
  occupation: z.enum(["salaried", "business", "professional", "retired", "other"], { required_error: "Occupation is required" }),
  otherOccupationDetail: z.string().optional(),
  cityAndState: z.string().min(1, "City & State are required"),
  maritalStatus: z.enum(["single", "married"], { required_error: "Marital Status is required" }),
  dependentMembersAdults: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0)).optional(),
  dependentMembersChildren: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0)).optional(),
}).superRefine((data, ctx) => {
  if (data.occupation === "other" && (!data.otherOccupationDetail || data.otherOccupationDetail.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other occupation", path: ["otherOccupationDetail"] });
  }
});

export const FinancialAdvisoryServicesRequiredSchema = z.object({
  taxSavingPlan: z.boolean().optional().default(false),
  investmentPlanning: z.boolean().optional().default(false),
  retirementPlanning: z.boolean().optional().default(false),
  insuranceAdvisory: z.boolean().optional().default(false),
  wealthManagement: z.boolean().optional().default(false),
  childEducationPlanning: z.boolean().optional().default(false),
  nriFinancialAdvisory: z.boolean().optional().default(false),
  otherAdvisoryService: z.boolean().optional().default(false),
  otherAdvisoryServiceDetail: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.otherAdvisoryService && (!data.otherAdvisoryServiceDetail || data.otherAdvisoryServiceDetail.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other advisory service details.", path: ["otherAdvisoryServiceDetail"] });
  }
  const { otherAdvisoryServiceDetail, ...services } = data;
  if (!Object.values(services).some(val => val === true)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "At least one advisory service must be selected.", path: ["taxSavingPlan"] });
  }
});

export const FinancialAdvisoryCurrentFinancialOverviewSchema = z.object({
  annualIncome: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0)).optional(),
  monthlySavings: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0)).optional(),
  currentInvestmentsAmount: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0)).optional(),
  currentInvestmentsTypes: z.object({
    licInsurance: z.boolean().optional().default(false),
    ppfEpf: z.boolean().optional().default(false),
    mutualFunds: z.boolean().optional().default(false),
    fdRd: z.boolean().optional().default(false),
    realEstate: z.boolean().optional().default(false),
    none: z.boolean().optional().default(false),
  }).optional(),
});

export const FinancialAdvisoryDocumentUploadSchema = z.object({
  salarySlipsIncomeProof: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
  lastYearItrForm16: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
  investmentProofs: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
  existingLoanEmiDetails: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
});

export const FinancialAdvisoryFormSchema = z.object({
  personalDetails: FinancialAdvisoryPersonalDetailsSchema,
  advisoryServicesRequired: FinancialAdvisoryServicesRequiredSchema,
  currentFinancialOverview: FinancialAdvisoryCurrentFinancialOverviewSchema,
  kycDocuments: KycDocumentsSchema,
  documentUploads: FinancialAdvisoryDocumentUploadSchema.optional(),
});
export type FinancialAdvisoryFormData = z.infer<typeof FinancialAdvisoryFormSchema>;

// Audit and Assurance
const AuditAndAssuranceBusinessDetailsSchema = z.object({
  businessName: z.string().min(1, "Business Name is required"),
  businessType: z.enum(["proprietorship", "partnership", "pvt_ltd", "llp", "other"], { required_error: "Business type is required" }),
  otherBusinessTypeDetail: z.string().optional(),
  annualTurnover: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Must be a number" }).min(0, "Annual turnover cannot be negative")),
}).superRefine((data, ctx) => {
  if (data.businessType === "other" && (!data.otherBusinessTypeDetail || data.otherBusinessTypeDetail.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other business type", path: ["otherBusinessTypeDetail"] });
  }
});

export const AuditAndAssuranceServicesRequiredSchema = z.object({
  statutoryAudit: z.boolean().optional().default(false),
  taxAudit: z.boolean().optional().default(false),
  internalAudit: z.boolean().optional().default(false),
  managementAudit: z.boolean().optional().default(false),
  stockAudit: z.boolean().optional().default(false),
  dueDiligence: z.boolean().optional().default(false),
  otherAuditService: z.boolean().optional().default(false),
  otherAuditServiceDetail: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.otherAuditService && (!data.otherAuditServiceDetail || data.otherAuditServiceDetail.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify other service details.", path: ["otherAuditServiceDetail"] });
  }
  const { otherAuditServiceDetail, ...services } = data;
  if (!Object.values(services).some(val => val === true)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "At least one audit service must be selected.", path: ["statutoryAudit"] });
  }
});

export const AuditAndAssuranceDocumentUploadSchema = z.object({
  gstCertificate: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).optional(),
  lastFinancials: stringOrFileSchema(ACCOUNTING_ACCEPTED_TYPES),
  bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  existingAuditorDetails: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES).optional(),
  otherSupportingDocs: stringOrFileSchema(ACCOUNTING_ACCEPTED_TYPES).optional(),
});

export const AuditAndAssuranceFormSchema = z.object({
  personalDetails: PersonalDetailsSchema,
  businessDetails: AuditAndAssuranceBusinessDetailsSchema,
  servicesRequired: AuditAndAssuranceServicesRequiredSchema,
  kycDocuments: KycDocumentsSchema,
  documentUploads: AuditAndAssuranceDocumentUploadSchema.optional(),
});
export type AuditAndAssuranceFormData = z.infer<typeof AuditAndAssuranceFormSchema>;

// #endregion

// #region --- AUTHENTICATION SCHEMAS ---

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters long"),
});

const referralPartnerSchema = z.object({
  businessModel: z.literal('referral'),
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Invalid mobile number (must be 10 digits)"),
}).merge(passwordSchema);

const dsaPartnerSchema = z.object({
  businessModel: z.literal('dsa'),
  personalDetails: PersonalDetailsSchema,
  professionalFinancial: z.object({
    highestQualification: z.string().min(1, "Highest qualification is required"),
    presentOccupation: z.string().min(1, "Present occupation is required"),
    yearsInOccupation: z.preprocess((val) => val ? Number(val) : undefined, z.number().min(0)),
    bankAccountNumber: z.string().min(1, "Bank account number is required"),
    bankIfscCode: z.string().min(1, "IFSC code is required"),
    bankName: z.string().min(1, "Bank name is required"),
    annualIncome: z.preprocess((val) => val ? Number(val) : undefined, z.number().min(0)),
  }),
  businessScope: z.object({
    constitution: z.enum(['individual', 'proprietorship', 'partnership'], { required_error: "Constitution is required" }),
    operatingLocation: z.string().min(1, "Operating location is required"),
    productsOfInterest: z.object({
      homeLoan: z.boolean().default(false),
      personalLoan: z.boolean().default(false),
      businessLoan: z.boolean().default(false),
      creditCard: z.boolean().default(false),
    }).refine(data => Object.values(data).some(v => v), { message: 'Select at least one product of interest', path: ['homeLoan'] }),
  }),
  dsaDocumentUploads: z.object({
    panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).refine(val => val, { message: "PAN Card is required." }),
    aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).refine(val => val, { message: "Aadhaar Card is required." }),
    photograph: stringOrFileSchema(ACCEPTED_IMAGE_TYPES).refine(val => val, { message: "Photograph is required." }),
    bankStatement: stringOrFileSchema(ACCEPTED_BANK_STATEMENT_TYPES),
  }),
  declaration: z.boolean().refine(v => v === true, { message: 'You must agree to the declaration.' }),
}).merge(passwordSchema);

const merchantPartnerSchema = z.object({
  businessModel: z.literal('merchant'),
  personalDetails: PersonalDetailsSchema,
  businessInformation: z.object({
    legalBusinessName: z.string().min(1, "Legal business name is required"),
    businessType: z.enum(['proprietorship', 'partnership', 'pvt_ltd'], { required_error: "Business type is required" }),
    industry: z.string().min(1, "Industry is required"),
    businessAddress: z.string().min(1, "Business address is required"),
    gstNumber: z.preprocess(
      (val) => (typeof val === 'string' ? val.toUpperCase() : val),
      z.string()
        .min(1, "GST Number is required.")
        .regex(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
          "Invalid GST format. Please enter a valid 15-character GSTIN."
        )
    ),
  }),
  merchantDocumentUploads: z.object({
    panCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).refine(val => val, { message: "Proprietor's PAN Card is required." }),
    aadhaarCard: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES).refine(val => val, { message: "Proprietor's Aadhaar Card is required." }),
    photograph: stringOrFileSchema(ACCEPTED_IMAGE_TYPES).refine(val => val, { message: "Proprietor's Photograph is required." }),
    gstCertificate: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
    businessRegistration: stringOrFileSchema(ACCEPTED_DOCUMENT_TYPES),
  }),
  declaration: z.boolean().refine(v => v === true, { message: 'You must agree to the declaration.' }),
}).merge(passwordSchema);


export const PartnerSignUpSchema = z.discriminatedUnion('businessModel', [
  referralPartnerSchema,
  dsaPartnerSchema,
  merchantPartnerSchema,
]).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
export type PartnerSignUpFormData = z.infer<typeof PartnerSignUpSchema>;


export const PartnerLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export type PartnerLoginFormData = z.infer<typeof PartnerLoginSchema>;

export const UserSignUpSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Invalid mobile number (must be 10 digits)"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters long"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
export type UserSignUpFormData = z.infer<typeof UserSignUpSchema>;

export const UserLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export type UserLoginFormData = z.infer<typeof UserLoginSchema>;

// #endregion
