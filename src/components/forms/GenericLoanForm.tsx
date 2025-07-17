

"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType, ZodTypeDef } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { validateIdentificationDetails, type ValidateIdentificationDetailsOutput } from '@/ai/flows/validate-identification-details';
import { ArrowLeft, Loader2, Info, UploadCloud } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '../ui/textarea';
import { processNestedFileUploads } from '@/lib/form-helpers';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FormStepper } from '../shared/FormStepper';

interface FieldConfig {
  name: string;
  label: React.ReactNode; 
  type: 'text' | 'email' | 'tel' | 'date' | 'number' | 'radio' | 'file' | 'textarea';
  placeholder?: string;
  options?: { value: string; label: string }[];
  isPAN?: boolean;
  isAadhaar?: boolean;
  prefix?: string; 
  colSpan?: 1 | 2;
  accept?: string;
  dependsOn?: { field: string; value: any };
  rows?: number;
  disabled?: boolean;
}

interface SectionConfig {
  title: string;
  subtitle?: string;
  fields: FieldConfig[];
}

interface ServerActionResponse {
  success: boolean;
  message: string; 
  applicationId?: string;
  errors?: Record<string, string[]>;
}

interface GenericLoanFormProps<T extends Record<string, any>> {
  onBack?: () => void;
  backButtonText?: string;
  formTitle: string;
  formSubtitle?: string;
  formIcon?: React.ReactNode;
  schema: ZodType<T, ZodTypeDef, T>;
  defaultValues: T;
  sections: SectionConfig[];
  submitAction: (data: T) => Promise<ServerActionResponse>;
  updateAction?: (applicationId: string, data: T) => Promise<ServerActionResponse>;
  mode?: 'create' | 'edit';
  applicationId?: string;
  submitButtonText?: string;
  isAdmin?: boolean;
}

export function GenericLoanForm<TData extends Record<string, any>>({ 
  onBack,
  backButtonText,
  formTitle, 
  formSubtitle, 
  formIcon,
  schema, 
  defaultValues, 
  sections,
  submitAction,
  updateAction,
  mode = 'create',
  applicationId,
  submitButtonText = "Submit Application",
  isAdmin = false,
}: GenericLoanFormProps<TData>) {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { currentUser } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingID, setIsVerifyingID] = useState(false);
  const [highestValidatedStep, setHighestValidatedStep] = useState(0);

  const storageKey = useMemo(() => `form-data-${pathname}-${applicationId || ''}`, [pathname, applicationId]);

  const currentStep = useMemo(() => {
    const step = parseInt(searchParams.get('step') || '0', 10);
    return isNaN(step) ? 0 : step;
  }, [searchParams]);

  const form = useForm<TData>({
    resolver: zodResolver(schema),
    defaultValues: (() => {
        if (typeof window !== 'undefined') {
            const savedData = sessionStorage.getItem(storageKey);
            if (savedData) {
                try {
                    return JSON.parse(savedData);
                } catch (e) {
                    console.error("Failed to parse saved form data", e);
                }
            }
        }
        return defaultValues;
    })(),
  });

  const { control, handleSubmit, getValues, setError, clearErrors, trigger, reset, watch } = form;
  
  const getNestedValue = (obj: any, path: string) => path.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
  
  const watchedValues = watch();
  
  useEffect(() => {
    const subscription = watch((value) => {
        try {
          const serializableValue = JSON.parse(JSON.stringify(value, (key, val) => (val instanceof File ? undefined : val)));
          sessionStorage.setItem(storageKey, JSON.stringify(serializableValue));
        } catch (e) {
          console.error("Could not save form data to session storage", e);
        }
    });
    return () => subscription.unsubscribe();
  }, [watch, storageKey]);

  const visibleSections = useMemo(() => {
    return sections.filter(section => 
      section.fields.some(field => {
        if (!field.dependsOn) return true;
        const dependentValue = getNestedValue(watchedValues, field.dependsOn.field);
        return dependentValue === field.dependsOn.value;
      })
    );
  }, [sections, watchedValues]);

  const stepLabels = useMemo(() => visibleSections.map(s => s.title), [visibleSections]);

  const onInvalid = () => {
    toast({
        variant: "destructive",
        title: "Incomplete Form",
        description: "Please review all steps for errors before submitting the application.",
    });
  };
  
  const handleBackClick = useCallback(() => {
    if (mode === 'edit' && applicationId) {
        const detailPageUrl = isAdmin 
            ? `/admin/application/${applicationId}?category=loan`
            : `/dashboard/application/${applicationId}?category=loan`;
        router.push(detailPageUrl);
    } else {
        router.back();
    }
  }, [mode, isAdmin, applicationId, router]);

  async function onSubmit(data: TData) {
    setIsSubmitting(true);

    if (!currentUser) {
      toast({ variant: "destructive", title: "Authentication Required", description: "Please log in to submit your application." });
      setIsSubmitting(false);
      return;
    }

    try {
      const payloadForServer = await processNestedFileUploads(data);
      
      let result: ServerActionResponse;
      if (mode === 'edit' && applicationId && updateAction) {
          result = await updateAction(applicationId, payloadForServer);
      } else {
          result = await submitAction(payloadForServer);
      }

      if (result.success) {
        toast({ title: mode === 'edit' ? "Application Updated!" : "Application Submitted!", description: result.message, duration: 5000 });
        sessionStorage.removeItem(storageKey);
        
        setTimeout(() => {
            if (mode === 'edit' && applicationId) {
                const detailPageUrl = isAdmin 
                    ? `/admin/application/${applicationId}?category=loan`
                    : `/dashboard/application/${applicationId}?category=loan`;
                router.push(detailPageUrl);
            } else {
                router.push('/dashboard');
            }
        }, 1500);

        if (mode === 'create') {
            reset(); 
        }

      } else {
        toast({ variant: "destructive", title: mode === 'edit' ? "Update Failed" : "Application Failed", description: result.message || "An unknown error occurred.", duration: 9000 });
        if (result.errors) {
          Object.entries(result.errors).forEach(([fieldName, errorMessages]) => {
            setError(fieldName as any, { type: 'manual', message: (errorMessages as string[]).join(', ') });
          });
        }
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Submission Error", description: error.message || "An unexpected error occurred.", duration: 9000 });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const handleIDValidation = async () => {
    const panPath = 'personalDetails.panNumber';
    const aadhaarPath = 'personalDetails.aadhaarNumber';

    const [panIsValid, aadhaarIsValid] = await Promise.all([
        trigger(panPath as any),
        trigger(aadhaarPath as any)
    ]);

    if (!panIsValid || !aadhaarIsValid) return;

    const panNumber = getValues(panPath as any);
    const aadhaarNumber = getValues(aadhaarPath as any);

    if (!panNumber || !aadhaarNumber) return;

    setIsVerifyingID(true);
    try {
      const result: ValidateIdentificationDetailsOutput = await validateIdentificationDetails({ panNumber, aadhaarNumber });
      
      if (result.isValid) {
        toast({ title: "ID Verification Success", description: result.validationDetails });
        clearErrors([panPath as any, aadhaarPath as any]); 
      } else {
        setError(aadhaarPath as any, { type: "manual", message: result.validationDetails });
        toast({ variant: "destructive", title: "ID Verification Failed", description: result.validationDetails, duration: 9000 });
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast({ variant: "destructive", title: "Validation Error", description: "Could not validate ID details.", duration: 9000 });
      setError(aadhaarPath as any, { type: "manual", message: "AI validation failed." });
    } finally {
      setIsVerifyingID(false);
    }
  };

  const navigateToStep = useCallback((step: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('step', String(step));
      router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);
  
  useEffect(() => {
    const savedStep = parseInt(searchParams.get('step') || '0', 10);
     if (savedStep > highestValidatedStep) {
        setHighestValidatedStep(savedStep);
     }
  }, [searchParams, highestValidatedStep]);

  const handleNextClick = useCallback(async () => {
    const fieldsInSection = visibleSections[currentStep]?.fields.map(field => field.name) || [];
    const isValid = await trigger(fieldsInSection as any, { shouldFocus: true });
    
    if (isValid) {
      if (currentStep < visibleSections.length - 1) {
        const nextStep = currentStep + 1;
        if(nextStep > highestValidatedStep) {
            setHighestValidatedStep(nextStep);
        }
        navigateToStep(nextStep);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill out all required fields in this section correctly.",
      });
    }
  }, [currentStep, highestValidatedStep, navigateToStep, trigger, visibleSections, toast]);

  const handlePreviousClick = useCallback(() => {
     if (currentStep > 0) {
        navigateToStep(currentStep - 1);
    }
  }, [currentStep, navigateToStep]);
  
  const handleStepClick = useCallback((stepIndex: number) => {
    if (stepIndex <= highestValidatedStep && stepIndex !== currentStep) {
      navigateToStep(stepIndex);
    }
  }, [currentStep, highestValidatedStep, navigateToStep]);
  
  const renderField = (fieldConfig: FieldConfig) => {
    const onBlur = fieldConfig.isAadhaar ? handleIDValidation : undefined;
    
    return (
      <FormField
        key={fieldConfig.name}
        control={control}
        name={fieldConfig.name as any}
        render={({ field }) => {
          switch (fieldConfig.type) {
            case 'file':
              const { value, onChange, ...restOfField } = field;
              return (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" />
                    {fieldConfig.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      {...restOfField}
                      onChange={(event) => onChange(event.target.files?.[0] ?? null)}
                      accept={fieldConfig.accept || ".pdf,.jpg,.jpeg,.png"}
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 file:text-transparent"
                    />
                  </FormControl>
                  {value instanceof File && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Selected: {value.name} ({(value.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                   {typeof value === 'string' && value.startsWith('http') && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View current file</a>
                      </p>
                    )}
                  <FormMessage />
                </FormItem>
              );
            case 'radio':
              return (
                <FormItem>
                  <FormLabel>{fieldConfig.label}</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                      {fieldConfig.options?.map(opt => (
                        <FormItem key={opt.value} className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value={opt.value} />
                          </FormControl>
                          <FormLabel className="font-normal">{opt.label}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            case 'textarea':
                return (
                    <FormItem>
                        <FormLabel>{fieldConfig.label}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={fieldConfig.placeholder} {...field} rows={fieldConfig.rows || 3} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                );
            default:
              return (
                <FormItem>
                  <FormLabel className="flex items-center">
                      {fieldConfig.label}
                      {(fieldConfig.isPAN || fieldConfig.isAadhaar) && isVerifyingID && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                  </FormLabel>
                   {fieldConfig.prefix ? (
                      <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">{fieldConfig.prefix}</span>
                      <FormControl>
                        <Input 
                            type={fieldConfig.type} placeholder={fieldConfig.placeholder} {...field}
                            value={field.value ?? ''}
                            onBlur={() => { field.onBlur(); onBlur?.(); }}
                            className="pl-7"
                            disabled={fieldConfig.disabled}
                        />
                      </FormControl>
                      </div>
                  ) : (
                    <FormControl>
                      <Input 
                        type={fieldConfig.type} placeholder={fieldConfig.placeholder} {...field}
                        value={field.value ?? ''} 
                        onBlur={() => { field.onBlur(); onBlur?.(); }}
                        disabled={fieldConfig.disabled}
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              );
          }
        }}
      />
    );
  };

  return (
    <section className="bg-secondary py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <Button variant="ghost" onClick={handleBackClick} className="inline-flex items-center mb-8 text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-5 h-5 mr-2" />
            {backButtonText || (mode === 'edit' ? 'Back to Details' : 'Back to Home')}
        </Button>
        <div className="max-w-4xl mx-auto bg-card p-6 md:p-10 rounded-2xl shadow-xl">
          <div className="text-center mb-4">
            {formIcon || <Info className="w-12 h-12 mx-auto text-primary mb-2" />}
            <h2 className="text-3xl font-bold text-card-foreground">{formTitle}</h2>
            {formSubtitle && <p className="text-muted-foreground mt-1">{formSubtitle}</p>}
          </div>
          
          <FormStepper 
            steps={stepLabels} 
            currentStep={currentStep}
            highestValidatedStep={highestValidatedStep} 
            onStepClick={handleStepClick}
          />

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-10">
              {visibleSections.map((section, sectionIdx) => (
                  <div key={sectionIdx} className={currentStep === sectionIdx ? 'block' : 'hidden'}>
                    <FormSection title={section.title} subtitle={section.subtitle}>
                      {section.fields.map(fieldConfig => {
                        if (fieldConfig.dependsOn) {
                          const watchedValue = getNestedValue(watchedValues, fieldConfig.dependsOn.field);
                          if (watchedValue !== fieldConfig.dependsOn.value) return null;
                        }
                        return (
                          <FormFieldWrapper key={fieldConfig.name} className={fieldConfig.colSpan === 2 ? 'md:col-span-2' : ''}>
                            {renderField(fieldConfig)}
                          </FormFieldWrapper>
                        );
                      })}
                    </FormSection>
                  </div>
                ))}
              
              <div className={currentStep === visibleSections.length -1 ? 'block' : 'hidden'}>
                <p className="text-xs text-muted-foreground mt-6 px-1">
                  🔐 All information and documents submitted will remain confidential and will be used solely for loan processing purposes.
                </p>
                <p className="text-xs text-muted-foreground mt-2 mb-4 px-1">
                  📝 I hereby declare that all the information and documents provided above are true and correct to the best of my knowledge.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                <div>
                    {currentStep > 0 && (
                        <Button type="button" variant="outline" onClick={handlePreviousClick} disabled={isSubmitting}>
                            Previous
                        </Button>
                    )}
                </div>
                <div>
                    {currentStep < visibleSections.length - 1 && (
                        <Button type="button" className="cta-button" onClick={handleNextClick}>
                            Next
                        </Button>
                    )}
                    {currentStep === visibleSections.length - 1 && (
                        <Button type="submit" className="cta-button" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {mode === 'edit' ? 'Updating...' : 'Submitting...'}</> : (mode === 'edit' ? 'Update Application' : submitButtonText)}
                        </Button>
                    )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
