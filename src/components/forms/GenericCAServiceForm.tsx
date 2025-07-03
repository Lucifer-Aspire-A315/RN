
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType, ZodTypeDef } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Loader2, UploadCloud } from 'lucide-react';
import { FormSection, FormFieldWrapper } from './FormSection';
import { processNestedFileUploads } from '@/lib/form-helpers';
import { useRouter } from 'next/navigation';
import { FormProgress } from '../shared/FormProgress';

// Field and Section Configuration Types
interface FieldConfig {
  name: string;
  label: React.ReactNode;
  type: 'text' | 'email' | 'tel' | 'date' | 'number' | 'radio' | 'checkbox' | 'textarea' | 'file';
  placeholder?: string;
  options?: { value: string; label: string }[];
  prefix?: string;
  colSpan?: 1 | 2;
  accept?: string;
  dependsOn?: { field: string; value: any };
  rows?: number;
}

interface SectionConfig {
  title: string;
  subtitle?: string;
  fields: FieldConfig[];
}

interface GenericCAServiceFormProps<T extends Record<string, any>> {
  onBack?: () => void;
  formTitle: string;
  formSubtitle: string;
  formIcon: React.ReactNode;
  schema: ZodType<T, ZodTypeDef, T>;
  defaultValues: T;
  sections: SectionConfig[];
  submitAction: (data: T) => Promise<{ success: boolean; message: string; errors?: Record<string, string[]> }>;
  updateAction?: (applicationId: string, data: T) => Promise<{ success: boolean; message: string; errors?: Record<string, string[]> }>;
  mode?: 'create' | 'edit';
  applicationId?: string;
}

export function GenericCAServiceForm<TData extends Record<string, any>>({
  onBack,
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
}: GenericCAServiceFormProps<TData>) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<TData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { control, handleSubmit, reset, watch, setError, trigger, setValue } = form;

  const getNestedValue = (obj: any, path: string) => path.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
  
  const watchedValues = watch();

  const visibleSections = useMemo(() => {
    return sections.filter(section => 
      section.fields.some(field => {
        if (!field.dependsOn) return true;
        const dependentValue = getNestedValue(watchedValues, field.dependsOn.field);
        return dependentValue === field.dependsOn.value;
      })
    );
  }, [sections, watchedValues]);

  useEffect(() => {
    if (currentStep >= visibleSections.length) {
      setCurrentStep(Math.max(0, visibleSections.length - 1));
    }
  }, [visibleSections, currentStep]);

  
  const handleBackClick = onBack || (mode === 'edit' ? () => router.back() : undefined);


  async function onSubmit(data: TData) {
    setIsSubmitting(true);
    if (!currentUser) {
      toast({ variant: "destructive", title: "Authentication Required", description: "Please log in to submit your application." });
      setIsSubmitting(false);
      return;
    }

    try {
      const dataToSubmit = await processNestedFileUploads(JSON.parse(JSON.stringify(data)));
      
      let result;
      if (mode === 'edit' && applicationId && updateAction) {
        result = await updateAction(applicationId, dataToSubmit);
      } else {
        result = await submitAction(dataToSubmit);
      }

      if (result.success) {
        toast({ title: mode === 'edit' ? "Application Updated!" : "Application Submitted!", description: result.message, duration: 5000 });
        
        setTimeout(() => {
          if (handleBackClick) {
            handleBackClick();
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
            Object.entries(result.errors).forEach(([fieldName, messages]) => {
                setError(fieldName as any, { type: 'manual', message: (messages as string[]).join(', ') });
            });
        }
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Submission Error", description: error.message || "An unexpected error occurred.", duration: 9000 });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleNextClick = async () => {
    const currentFields = visibleSections[currentStep].fields.map(field => field.name);
    const isValid = await trigger(currentFields as any);

    if(isValid) {
       if (currentStep < visibleSections.length - 1) {
          setCurrentStep(prev => prev + 1);
       }
    } else {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please correct the errors in this section before proceeding."
      });
    }
  };

  const handlePreviousClick = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };
  
  const renderField = (fieldConfig: FieldConfig) => {
    return (
      <FormField key={fieldConfig.name} control={control} name={fieldConfig.name as any}
        render={({ field }) => {
          switch (fieldConfig.type) {
            case 'file':
              return (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <UploadCloud className="w-5 h-5 mr-2 inline-block text-muted-foreground" />
                    {fieldConfig.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept={fieldConfig.accept || ".pdf,.jpg,.jpeg,.png"}
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                      onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                    />
                  </FormControl>
                  {field.value instanceof File && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Selected: {field.value.name} ({(field.value.size / 1024).toFixed(2)} KB)
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
            case 'checkbox':
                 return (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal leading-snug">{fieldConfig.label}</FormLabel>
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
                  <FormLabel>{fieldConfig.label}</FormLabel>
                  <FormControl>
                    <Input type={fieldConfig.type} placeholder={fieldConfig.placeholder} {...field} value={field.value ?? ''} />
                  </FormControl>
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
        {handleBackClick && (
            <Button variant="ghost" onClick={handleBackClick} className="inline-flex items-center mb-8 text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-5 h-5 mr-2" />
             {mode === 'edit' ? 'Back to Details' : 'Back'}
            </Button>
        )}
        <div className="max-w-4xl mx-auto bg-card p-6 md:p-10 rounded-2xl shadow-xl">
          <div className="text-center mb-4">
            {formIcon}
            <h2 className="text-3xl font-bold text-card-foreground">{formTitle}</h2>
            <p className="text-muted-foreground mt-1">{formSubtitle}</p>
          </div>

          <FormProgress currentStep={currentStep} totalSteps={visibleSections.length} />

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {visibleSections.map((section, idx) => (
                 <div key={idx} className={currentStep === idx ? 'block' : 'hidden'}>
                    <FormSection title={section.title} subtitle={section.subtitle}>
                      {section.fields.map(fieldConfig => {
                        if (fieldConfig.dependsOn) {
                          const watchedValue = getNestedValue(watch(), fieldConfig.dependsOn.field);
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
              <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
                {currentStep > 0 && (
                    <Button type="button" variant="outline" onClick={handlePreviousClick}>
                        Previous
                    </Button>
                )}
                <div className="flex-grow" />
                {currentStep < visibleSections.length - 1 && (
                    <Button type="button" className="cta-button" onClick={handleNextClick}>
                        Next
                    </Button>
                )}
                {currentStep === visibleSections.length - 1 && (
                    <Button type="submit" className="w-full md:w-auto cta-button" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {mode === 'edit' ? 'Updating...' : 'Submitting...'}</> : (mode === 'edit' ? 'Update Application' : 'Submit Application')}
                    </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
