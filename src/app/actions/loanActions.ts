
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp }  from 'firebase/firestore';
import { cookies } from 'next/headers';
import { updateApplicationAction } from './applicationActions';
import type { UserApplication } from '@/lib/types';


interface ServerActionResponse {
  success: boolean;
  message: string; 
  applicationId?: string;
  errors?: Record<string, string[]>; // For Zod validation errors
}

export async function submitLoanApplicationAction<T extends Record<string, any>>(
  data: T,
  loanType: string // This will now be applicationType
): Promise<ServerActionResponse> {
  console.log(`[Server Action - Loan] Received application for type "${loanType}".`);

  try {
    await cookies().get('priming-cookie-loan'); // Priming read
    const submitterUserId = cookies().get('user_id')?.value;
    const submitterUserName = cookies().get('user_name')?.value;
    const submitterUserEmail = cookies().get('user_email')?.value;
    const submitterUserType = cookies().get('user_type')?.value as 'normal' | 'partner' | undefined;

    if (!submitterUserId || !submitterUserName || !submitterUserEmail || !submitterUserType) {
      console.error(`[Server Action - Loan] Critical user information missing from cookies for loan type "${loanType}".`);
      return {
        success: false,
        message: 'User authentication details are missing. Please log in again.',
      };
    }

    // Get applicant info from the form data. All loan schemas use `applicantDetails`.
    const applicantDataFromForm = data.applicantDetails;
    if (!applicantDataFromForm) {
      return { success: false, message: 'Applicant details are missing from the form submission.' };
    }

    const partnerId = submitterUserType === 'partner' ? submitterUserId : null;

    const applicationData = {
      applicantDetails: {
        // A client of a partner may not have a userId yet. This is captured in submittedBy.
        userId: null, 
        fullName: applicantDataFromForm.name, // Loan schemas use 'name'
        email: applicantDataFromForm.email,   // Loan schemas use 'email'
      },
      submittedBy: {
        userId: submitterUserId,
        userName: submitterUserName,
        userEmail: submitterUserEmail,
        userType: submitterUserType,
      },
      partnerId: partnerId,
      applicationType: loanType, // Renamed from loanType for consistency
      serviceCategory: 'loan', // Added for broader categorization
      formData: data, 
      status: 'submitted', 
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    console.log(`[Server Action - Loan] Attempting to save to Firestore for type "${loanType}".`);

    const docRef = await addDoc(collection(db, 'loanApplications'), applicationData);
    
    console.log(`[Server Action - Loan] Application stored in 'loanApplications' with ID: ${docRef.id}`);

    return {
      success: true,
      message: `${loanType} application submitted successfully! Your application ID is ${docRef.id}. We will review your application and get back to you.`,
      applicationId: docRef.id,
    };

  } catch (error: any) {
    console.error(`[Server Action - Loan] Error submitting application for type "${loanType}" to Firestore:`);
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    if (error.code) console.error("Error Code:", error.code);
    if (error.details) console.error("Error Details:", error.details);
    
    const safeErrorMessage = (typeof error.message === 'string' && error.message) 
      ? error.message 
      : `An internal server error occurred while submitting your ${loanType} application. Please check server logs for details.`;
    
    return {
      success: false,
      message: safeErrorMessage,
    };
  }
}

export async function updateLoanApplicationAction(applicationId: string, data: any) {
    // This is a wrapper to call the generic update action with the correct category.
    // The main action is now smart enough to handle the raw form data.
    return updateApplicationAction(applicationId, 'loan' as UserApplication['serviceCategory'], data);
}
    
