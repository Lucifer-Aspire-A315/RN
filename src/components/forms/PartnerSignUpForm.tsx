
"use client";

import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PartnerSignUpSchema, type PartnerSignUpFormData } from '@/lib/schemas';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useFormField } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { processFileUploads } from '@/lib/form-helpers';
import { Loader2, UserPlus, Handshake, Store, Users, UploadCloud, ArrowLeft } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import { partnerSignUpAction } from '@/app/actions/authActions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormProgress } from '../shared/FormProgress';


// Helper function to safely extract field keys from a Zod schema
const getKeysFromZodObject = (schema: z.ZodTypeAny): string[] => {
    if (schema instanceof z.ZodObject) {
        return Object.keys(schema.shape);
    }
    // Handle ZodEffects (e.g., from .refine() or .superRefine())
    if ('innerType' in schema._def) {
        return getKeysFromZodObject(schema._def.innerType);
    }
    return [];
};

// Reusable File Input Component
interface FormFileInputProps {
  fieldLabel: React.ReactNode;
  form: ReturnType<typeof useForm<PartnerSignUpFormData>>;
  fieldName: any; // Allow any nested path
  accept?: string;
}

const FormFileInput: React.FC<FormFileInputProps> = ({ fieldLabel, form, fieldName, accept }) => {
  const { control, setValue, watch } = form;
  const selectedFile = watch(fieldName);
  const { formItemId } = useFormField();

  return (
    <FormItem>
      <FormLabel htmlFor={formItemId} className="flex items-center">
        <UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" /> {fieldLabel}
      </FormLabel>
      <Controller
        name={fieldName}
        control={control}
        render={({ field: { onChange, onBlur, name, ref } }) => (
          <Input
            id={formItemId}
            type="file"
            ref={ref}
            name={name}
            onBlur={onBlur}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              onChange(file);
              setValue(fieldName, file, { shouldValidate: true, shouldDirty: true });
            }}
            accept={accept || ".pdf,.jpg,.jpeg,.png"}
            className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
          />
        )}
      />
      {selectedFile instanceof File && (
        <p className="text-xs text-muted-foreground mt-1">
          Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
        </p>
      )}
      <FormMessage />
    </FormItem>
  );
};


export function PartnerSignUpForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<PartnerSignUpFormData>({
    resolver: zodResolver(PartnerSignUpSchema),
    defaultValues: {
      businessModel: 'referral',
    },
    mode: 'onTouched',
  });

  const { control, handleSubmit, watch, formState: { errors }, setValue, setError, trigger } = form;
  const businessModel = watch('businessModel');

  const allSections = useMemo(() => {
    // Access the underlying discriminated union schema
     if (!(PartnerSignUpSchema._def.schema instanceof z.ZodDiscriminatedUnion)) {
        return {};
     }
    const discriminatedUnionSchema = PartnerSignUpSchema._def.schema;
    const dsaSchema = discriminatedUnionSchema.optionsMap.get('dsa');
    const merchantSchema = discriminatedUnionSchema.optionsMap.get('merchant');
    const referralSchema = discriminatedUnionSchema.optionsMap.get('referral');

    const dsaShape = dsaSchema?._def.shape() as z.ZodObject<any>['shape'] | undefined;
    const merchantShape = merchantSchema?._def.shape() as z.ZodObject<any>['shape'] | undefined;
    const referralShape = referralSchema?._def.shape() as z.ZodObject<any>['shape'] | undefined;

    // Safely extract field names
    const dsaPersonalFields = dsaShape?.personalDetails ? getKeysFromZodObject(dsaShape.personalDetails) : [];
    const dsaProfessionalFields = dsaShape?.professionalFinancial ? getKeysFromZodObject(dsaShape.professionalFinancial) : [];
    const dsaScopeFields = dsaShape?.businessScope ? getKeysFromZodObject(dsaShape.businessScope) : [];
    const dsaDocsFields = dsaShape?.dsaDocumentUploads ? getKeysFromZodObject(dsaShape.dsaDocumentUploads) : [];
    
    const merchantInfoFields = merchantShape?.businessInformation ? getKeysFromZodObject(merchantShape.businessInformation) : [];
    const merchantPersonalFields = merchantShape?.personalDetails ? getKeysFromZodObject(merchantShape.personalDetails) : [];
    const merchantDocsFields = merchantShape?.merchantDocumentUploads ? getKeysFromZodObject(merchantShape.merchantDocumentUploads) : [];

    const referralFields = referralShape ? getKeysFromZodObject(referralSchema) : [];
    
    const passwordFields = ['password', 'confirmPassword'];

    return {
      modelSelection: {
          title: "1. Select Your Business Model",
          subtitle: "Choose how you'd like to partner with us.",
          fields: ['businessModel']
      },
      referralInfo: {
          title: "2. Basic Information",
          subtitle: "Provide your details to get started.",
          fields: referralFields.filter(f => f !== 'businessModel')
      },
      dsaPersonal: {
          title: "DSA: Personal Details",
          subtitle: "Provide your verifiable personal information.",
          fields: [...dsaPersonalFields.map(f => `personalDetails.${f}`), ...passwordFields]
      },
      dsaProfessional: {
          title: "DSA: Professional & Financial Background",
          fields: dsaProfessionalFields.map(f => `professionalFinancial.${f}`)
      },
      dsaScope: {
          title: "DSA: Business Scope",
          fields: dsaScopeFields.map(f => `businessScope.${f}`)
      },
      dsaDocs: {
          title: "DSA: Document Uploads",
          subtitle: "Please upload clear copies of the following documents.",
          fields: [...dsaDocsFields.map(f => `dsaDocumentUploads.${f}`), 'declaration']
      },
      merchantPersonal: {
          title: "Merchant: Proprietor's Details",
          subtitle: "Provide the personal details of the primary business owner.",
          fields: [...merchantPersonalFields.map(f => `personalDetails.${f}`), ...passwordFields]
      },
      merchantInfo: {
          title: "Merchant: Business Information",
          fields: merchantInfoFields.map(f => `businessInformation.${f}`)
      },
      merchantDocs: {
          title: "Merchant: Document Uploads",
          subtitle: "Please upload business verification documents.",
          fields: [...merchantDocsFields.map(f => `merchantDocumentUploads.${f}`), 'declaration']
      }
    };
  }, []);

  const steps = useMemo(() => {
    if (!allSections.modelSelection) return []; // Guard against initial render
    const { modelSelection, referralInfo, dsaPersonal, dsaProfessional, dsaScope, dsaDocs, merchantPersonal, merchantInfo, merchantDocs } = allSections;
    if (businessModel === 'dsa') {
      return [modelSelection, dsaPersonal, dsaProfessional, dsaScope, dsaDocs];
    }
    if (businessModel === 'merchant') {
      return [modelSelection, merchantPersonal, merchantInfo, merchantDocs];
    }
    // Referral
    return [modelSelection, referralInfo];
  }, [businessModel, allSections]);
  
  const handleNextStep = async () => {
    const currentFields = steps[currentStep].fields;
    const isValid = await trigger(currentFields as any, { shouldFocus: true });
    
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill out all required fields in this section correctly.",
      });
    }
  };

  const handlePrevStep = () => {
     if (currentStep > 0) {
        setCurrentStep(prev => prev - 1);
     }
  };


  async function onSubmit(data: PartnerSignUpFormData) {
    setIsSubmitting(true);
    let dataToSubmit = JSON.parse(JSON.stringify(data));

    try {
        if (data.businessModel === 'dsa' && data.dsaDocumentUploads) {
            const uploadedUrls = await processFileUploads(data.dsaDocumentUploads, toast);
            Object.assign(dataToSubmit.dsaDocumentUploads, uploadedUrls);
        }
        if (data.businessModel === 'merchant' && data.merchantDocumentUploads) {
            const uploadedUrls = await processFileUploads(data.merchantDocumentUploads, toast);
            Object.assign(dataToSubmit.merchantDocumentUploads, uploadedUrls);
        }

      const result = await partnerSignUpAction(dataToSubmit);
      if (result.success && result.user) {
        toast({
          title: "Sign Up Successful",
          description: result.message || "Your account has been created and is pending approval.",
        });
        form.reset();
        router.push('/');
      } else {
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: result.message || "An unknown error occurred.",
        });
        if (result.errors) {
          Object.entries(result.errors).forEach(([fieldName, errorMessages]) => {
            setError(fieldName as any, { type: 'manual', message: (errorMessages as string[]).join(', ') });
          });
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: error.message || "An unexpected error occurred during sign up.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-card p-6 md:p-10 rounded-2xl shadow-xl">
      <div className="text-center mb-4">
        <Handshake className="w-12 h-12 mx-auto text-primary mb-2" />
        <h2 className="text-3xl font-bold text-card-foreground">Partner Registration</h2>
        <p className="text-muted-foreground mt-1">
          Join our network. Choose the partner type that best suits you.
        </p>
      </div>
      
      {steps.length > 0 && <FormProgress currentStep={currentStep} totalSteps={steps.length} />}

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          
          <div className={currentStep === 0 ? 'block' : 'hidden'}>
            <FormSection title={allSections.modelSelection?.title || "Business Model"} subtitle={allSections.modelSelection?.subtitle}>
                <FormField
                control={control}
                name="businessModel"
                render={({ field }) => (
                    <RadioGroup
                    onValueChange={(value) => {
                        field.onChange(value);
                        setCurrentStep(0); // Reset to first step if model changes
                    }}
                    defaultValue={field.value}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2"
                    >
                    <FormItem>
                        <FormControl>
                            <RadioGroupItem value="referral" id="referral" className="sr-only" />
                        </FormControl>
                        <Label htmlFor="referral" className={`flex flex-col items-center justify-center text-center p-4 border-2 rounded-lg cursor-pointer transition-all ${field.value === 'referral' ? 'border-primary bg-primary/10' : 'border-muted-foreground/20'}`}>
                        <Users className="w-8 h-8 mb-2" />
                        <span className="font-bold">Referral Partner</span>
                        <span className="text-xs text-muted-foreground">Refer clients and earn.</span>
                        </Label>
                    </FormItem>
                    <FormItem>
                        <FormControl>
                            <RadioGroupItem value="dsa" id="dsa" className="sr-only" />
                        </FormControl>
                        <Label htmlFor="dsa" className={`flex flex-col items-center justify-center text-center p-4 border-2 rounded-lg cursor-pointer transition-all ${field.value === 'dsa' ? 'border-primary bg-primary/10' : 'border-muted-foreground/20'}`}>
                        <UserPlus className="w-8 h-8 mb-2" />
                        <span className="font-bold">DSA Partner</span>
                        <span className="text-xs text-muted-foreground">Direct selling agent.</span>
                        </Label>
                    </FormItem>
                    <FormItem>
                        <FormControl>
                        <RadioGroupItem value="merchant" id="merchant" className="sr-only" />
                        </FormControl>
                        <Label htmlFor="merchant" className={`flex flex-col items-center justify-center text-center p-4 border-2 rounded-lg cursor-pointer transition-all ${field.value === 'merchant' ? 'border-primary bg-primary/10' : 'border-muted-foreground/20'}`}>
                        <Store className="w-8 h-8 mb-2" />
                        <span className="font-bold">Merchant Partner</span>
                        <span className="text-xs text-muted-foreground">Offer loans at your business.</span>
                        </Label>
                    </FormItem>
                    </RadioGroup>
                )}
                />
            </FormSection>
          </div>

          {businessModel === 'referral' && (
            <div className={currentStep === 1 ? 'block' : 'hidden'}>
                <FormSection title={allSections.referralInfo?.title || ''} subtitle={allSections.referralInfo?.subtitle}>
                    <FormField control={control} name="fullName" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your Full Name" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email ID</FormLabel><FormControl><Input type="email" placeholder="your.email@example.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="mobileNumber" render={({ field }) => ( <FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input type="tel" placeholder="10-digit mobile number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="password" render={({ field }) => ( <FormItem><FormLabel>Create Password</FormLabel><FormControl><Input type="password" placeholder="Create a strong password" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="confirmPassword" render={({ field }) => ( <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" placeholder="Confirm your password" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </FormSection>
            </div>
          )}

          {businessModel === 'dsa' && (
            <>
                <div className={currentStep === 1 ? 'block' : 'hidden'}>
                     <FormSection title={allSections.dsaPersonal?.title || ''} subtitle={allSections.dsaPersonal?.subtitle}>
                        <FormField control={control} name="personalDetails.fullName" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your Full Name" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="personalDetails.email" render={({ field }) => ( <FormItem><FormLabel>Email ID</FormLabel><FormControl><Input type="email" placeholder="your.email@example.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="personalDetails.mobileNumber" render={({ field }) => ( <FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input type="tel" placeholder="10-digit mobile number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="personalDetails.fatherOrHusbandName" render={({ field }) => ( <FormItem><FormLabel>Father's / Husband's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="personalDetails.dob" render={({ field }) => ( <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="personalDetails.gender" render={({ field }) => ( <FormItem><FormLabel>Gender</FormLabel><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="male" /></FormControl><FormLabel className="font-normal">Male</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="female" /></FormControl><FormLabel className="font-normal">Female</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="other" /></FormControl><FormLabel className="font-normal">Other</FormLabel></FormItem></RadioGroup><FormMessage /></FormItem> )} />
                        <FormField control={control} name="personalDetails.panNumber" render={({ field }) => ( <FormItem><FormLabel>PAN Number</FormLabel><FormControl><Input placeholder="ABCDE1234F" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="personalDetails.aadhaarNumber" render={({ field }) => ( <FormItem><FormLabel>Aadhaar Number</FormLabel><FormControl><Input placeholder="12-digit number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="password" render={({ field }) => ( <FormItem><FormLabel>Create Password</FormLabel><FormControl><Input type="password" placeholder="Create a strong password" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="confirmPassword" render={({ field }) => ( <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" placeholder="Confirm your password" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </FormSection>
                </div>
                <div className={currentStep === 2 ? 'block' : 'hidden'}>
                     <FormSection title={allSections.dsaProfessional?.title || ''}>
                        <FormField control={control} name="professionalFinancial.highestQualification" render={({ field }) => ( <FormItem><FormLabel>Highest Qualification</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="professionalFinancial.presentOccupation" render={({ field }) => ( <FormItem><FormLabel>Present Occupation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="professionalFinancial.yearsInOccupation" render={({ field }) => ( <FormItem><FormLabel>Years in Occupation</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="professionalFinancial.annualIncome" render={({ field }) => ( <FormItem><FormLabel>Annual Income (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="professionalFinancial.bankName" render={({ field }) => ( <FormItem><FormLabel>Bank Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="professionalFinancial.bankAccountNumber" render={({ field }) => ( <FormItem><FormLabel>Bank Account Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="professionalFinancial.bankIfscCode" render={({ field }) => ( <FormItem><FormLabel>Bank IFSC Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </FormSection>
                </div>
                 <div className={currentStep === 3 ? 'block' : 'hidden'}>
                    <FormSection title={allSections.dsaScope?.title || ''}>
                        <FormField control={control} name="businessScope.constitution" render={({ field }) => ( <FormItem><FormLabel>Constitution</FormLabel><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="individual" /></FormControl><FormLabel className="font-normal">Individual</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="proprietorship" /></FormControl><FormLabel className="font-normal">Proprietorship</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="partnership" /></FormControl><FormLabel className="font-normal">Partnership</FormLabel></FormItem></RadioGroup><FormMessage /></FormItem> )} />
                        <FormField control={control} name="businessScope.operatingLocation" render={({ field }) => ( <FormItem><FormLabel>Preferred Operating Location</FormLabel><FormControl><Input placeholder="e.g., Pune" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormFieldWrapper className="md:col-span-2">
                            <FormItem>
                                <FormLabel>Loan Products of Interest</FormLabel>
                                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                                    <FormField control={control} name="businessScope.productsOfInterest.homeLoan" render={({ field }) => ( <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Home Loan</FormLabel></FormItem> )} />
                                    <FormField control={control} name="businessScope.productsOfInterest.personalLoan" render={({ field }) => ( <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Personal Loan</FormLabel></FormItem> )} />
                                    <FormField control={control} name="businessScope.productsOfInterest.businessLoan" render={({ field }) => ( <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Business Loan</FormLabel></FormItem> )} />
                                    <FormField control={control} name="businessScope.productsOfInterest.creditCard" render={({ field }) => ( <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Credit Card</FormLabel></FormItem> )} />
                                </div>
                                <FormMessage>{errors.businessScope?.productsOfInterest?.message}</FormMessage>
                            </FormItem>
                        </FormFieldWrapper>
                    </FormSection>
                 </div>
                 <div className={currentStep === 4 ? 'block' : 'hidden'}>
                     <FormSection title={allSections.dsaDocs?.title || ''} subtitle={allSections.dsaDocs?.subtitle}>
                        <FormField control={control} name="dsaDocumentUploads.panCard" render={() => <FormFileInput fieldLabel="PAN Card Copy" form={form} fieldName="dsaDocumentUploads.panCard" />} />
                        <FormField control={control} name="dsaDocumentUploads.aadhaarCard" render={() => <FormFileInput fieldLabel="Aadhaar Card Copy" form={form} fieldName="dsaDocumentUploads.aadhaarCard" />} />
                        <FormField control={control} name="dsaDocumentUploads.photograph" render={() => <FormFileInput fieldLabel="Recent Photograph" form={form} fieldName="dsaDocumentUploads.photograph" accept="image/*" />} />
                        <FormField control={control} name="dsaDocumentUploads.bankStatement" render={() => <FormFileInput fieldLabel="Bank Statement (Last 6 Months)" form={form} fieldName="dsaDocumentUploads.bankStatement" />} />
                    </FormSection>
                    <FormField
                        control={control}
                        name="declaration"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm md:col-span-2 mt-6">
                            <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel>Declaration and Undertaking</FormLabel>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground">
                                I hereby declare that the details and documents submitted are true and correct. I authorize RN FinTech to process this application.
                            </p>
                            </div>
                        </FormItem>
                        )}
                    />
                 </div>
            </>
          )}

          {businessModel === 'merchant' && (
            <>
                <div className={currentStep === 1 ? 'block' : 'hidden'}>
                     <FormSection title={allSections.merchantPersonal?.title || ''} subtitle={allSections.merchantPersonal?.subtitle}>
                        <FormField control={control} name="personalDetails.fullName" render={({ field }) => ( <FormItem><FormLabel>Proprietor's Full Name</FormLabel><FormControl><Input placeholder="Your Full Name" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="personalDetails.email" render={({ field }) => ( <FormItem><FormLabel>Email ID</FormLabel><FormControl><Input type="email" placeholder="your.email@example.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="personalDetails.mobileNumber" render={({ field }) => ( <FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input type="tel" placeholder="10-digit mobile number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="personalDetails.fatherOrHusbandName" render={({ field }) => ( <FormItem><FormLabel>Father's / Husband's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="personalDetails.dob" render={({ field }) => ( <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="personalDetails.gender" render={({ field }) => ( <FormItem><FormLabel>Gender</FormLabel><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="male" /></FormControl><FormLabel className="font-normal">Male</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="female" /></FormControl><FormLabel className="font-normal">Female</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="other" /></FormControl><FormLabel className="font-normal">Other</FormLabel></FormItem></RadioGroup><FormMessage /></FormItem> )} />
                        <FormField control={control} name="personalDetails.panNumber" render={({ field }) => ( <FormItem><FormLabel>PAN Number</FormLabel><FormControl><Input placeholder="ABCDE1234F" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="personalDetails.aadhaarNumber" render={({ field }) => ( <FormItem><FormLabel>Aadhaar Number</FormLabel><FormControl><Input placeholder="12-digit number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="password" render={({ field }) => ( <FormItem><FormLabel>Create Password</FormLabel><FormControl><Input type="password" placeholder="Create a strong password" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="confirmPassword" render={({ field }) => ( <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" placeholder="Confirm your password" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </FormSection>
                </div>
                <div className={currentStep === 2 ? 'block' : 'hidden'}>
                    <FormSection title={allSections.merchantInfo?.title || ''}>
                        <FormField control={control} name="businessInformation.legalBusinessName" render={({ field }) => ( <FormItem><FormLabel>Legal Business Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="businessInformation.businessType" render={({ field }) => ( <FormItem><FormLabel>Business Type</FormLabel><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="proprietorship" /></FormControl><FormLabel className="font-normal">Proprietorship</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="partnership" /></FormControl><FormLabel className="font-normal">Partnership</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="pvt_ltd" /></FormControl><FormLabel className="font-normal">Pvt. Ltd.</FormLabel></FormItem></RadioGroup><FormMessage /></FormItem> )} />
                        <FormField control={control} name="businessInformation.industry" render={({ field }) => ( <FormItem><FormLabel>Industry / Nature of Business</FormLabel><FormControl><Input placeholder="e.g., Electronics Retail" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={control} name="businessInformation.gstNumber" render={({ field }) => ( <FormItem><FormLabel>GST Number</FormLabel><FormControl><Input placeholder="Your business GSTIN" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormFieldWrapper className="md:col-span-2">
                        <FormField control={control} name="businessInformation.businessAddress" render={({ field }) => ( <FormItem><FormLabel>Full Business Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
                        </FormFieldWrapper>
                    </FormSection>
                </div>
                 <div className={currentStep === 3 ? 'block' : 'hidden'}>
                    <FormSection title={allSections.merchantDocs?.title || ''} subtitle={allSections.merchantDocs?.subtitle}>
                        <FormField control={control} name="merchantDocumentUploads.gstCertificate" render={() => <FormFileInput fieldLabel="GST Certificate" form={form} fieldName="merchantDocumentUploads.gstCertificate" />} />
                        <FormField control={control} name="merchantDocumentUploads.businessRegistration" render={() => <FormFileInput fieldLabel="Business Registration Proof" form={form} fieldName="merchantDocumentUploads.businessRegistration" />} />
                        <FormField control={control} name="merchantDocumentUploads.panCard" render={() => <FormFileInput fieldLabel="Proprietor's PAN Card" form={form} fieldName="merchantDocumentUploads.panCard" />} />
                        <FormField control={control} name="merchantDocumentUploads.aadhaarCard" render={() => <FormFileInput fieldLabel="Proprietor's Aadhaar Card" form={form} fieldName="merchantDocumentUploads.aadhaarCard" />} />
                        <FormField control={control} name="merchantDocumentUploads.photograph" render={() => <FormFileInput fieldLabel="Proprietor's Photograph" form={form} fieldName="merchantDocumentUploads.photograph" accept="image/*" />} />
                    </FormSection>
                     <FormField
                        control={control}
                        name="declaration"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm md:col-span-2 mt-6">
                            <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel>Declaration and Undertaking</FormLabel>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground">
                                I hereby declare that the details and documents submitted are true and correct. I authorize RN FinTech to process this application.
                            </p>
                            </div>
                        </FormItem>
                        )}
                    />
                </div>
            </>
          )}

          <div className="mt-10 pt-6 border-t flex items-center justify-between">
            <div>
                {currentStep > 0 && (
                     <Button type="button" variant="outline" onClick={handlePrevStep} disabled={isSubmitting}>
                       <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                )}
            </div>
            <div>
                {currentStep < steps.length - 1 && (
                    <Button type="button" className="cta-button" onClick={handleNextStep}>
                        Next Step
                    </Button>
                )}
                 {currentStep === steps.length - 1 && (
                    <Button type="submit" className="w-full md:w-auto cta-button" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting Application...</> : 'Complete Registration'}
                    </Button>
                 )}
            </div>
          </div>
        </form>
      </Form>
       {currentStep === steps.length - 1 && (
            <p className="text-sm text-muted-foreground mt-6 text-center">
                Already a partner?{' '}
                <Link href="/partner-login" className="font-medium text-primary hover:underline">
                Login here
                </Link>
            </p>
        )}
    </div>
  );
}
