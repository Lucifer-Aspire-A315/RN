
'use server';

import { doc, getDoc, updateDoc, Timestamp, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { checkSessionAction } from './authActions';
import type { UserApplication } from '@/lib/types';
import { getCollectionName } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

interface ServerActionResponse {
  success: boolean;
  message: string;
  applicationId?: string;
  errors?: Record<string, string[]>;
}

export async function submitApplicationAction(
  formData: any,
  serviceCategory: UserApplication['serviceCategory'],
  applicationType: string,
  schemeNameForDisplay?: string
): Promise<ServerActionResponse> {
  console.log(`[AppSubmitAction] Received application for category "${serviceCategory}", type "${applicationType}".`);

  try {
    const submitter = await checkSessionAction();
    if (!submitter) {
      console.error(`[AppSubmitAction] Critical user info missing for ${serviceCategory} application.`);
      return { success: false, message: 'User authentication details missing. Please log in again.' };
    }

    const { id: submitterUserId, fullName: submitterUserName, email: submitterUserEmail, type: submitterUserType } = submitter;
    
    const partnerId = submitterUserType === 'partner' ? submitterUserId : null;
    const applicantUserId = submitterUserType === 'normal' ? submitterUserId : null;

    // Standardized access to applicant's personal details
    const personalDetails = formData.personalDetails;
    if (!personalDetails || !personalDetails.fullName || !personalDetails.email) {
      return { success: false, message: 'Applicant name or email could not be determined from form data.' };
    }
    
    const { fullName: applicantFullName, email: applicantEmail } = personalDetails;
    
    // File processing is now expected to be done on the client before calling this action.
    // The `formData` received here should already have URLs instead of File objects.

    const applicationData = {
      applicantDetails: {
        userId: applicantUserId,
        fullName: applicantFullName,
        email: applicantEmail,
      },
      submittedBy: {
        userId: submitterUserId,
        userName: submitterUserName,
        userEmail: submitterUserEmail,
        userType: submitterUserType,
      },
      partnerId,
      applicationType,
      serviceCategory,
      ...(schemeNameForDisplay && { schemeNameForDisplay }),
      formData: formData, // Use the client-processed formData directly
      status: 'submitted',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const collectionName = getCollectionName(serviceCategory);
    if (!collectionName) {
      throw new Error(`Invalid service category for submission: ${serviceCategory}`);
    }

    console.log(`[AppSubmitAction] Saving to collection "${collectionName}".`);
    const docRef = await addDoc(collection(db, collectionName), applicationData);
    console.log(`[AppSubmitAction] Application stored with ID: ${docRef.id}`);

    return {
      success: true,
      message: `${applicationType} application submitted successfully! Your application ID is ${docRef.id}.`,
      applicationId: docRef.id,
    };
  } catch (error: any) {
    console.error(`[AppSubmitAction] Error submitting application for type "${applicationType}" to Firestore:`);
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    
    const safeErrorMessage = (typeof error.message === 'string' && error.message)
      ? error.message
      : `An internal server error occurred while submitting your ${applicationType} application. Please check server logs for details.`;

    return {
      success: false,
      message: safeErrorMessage,
    };
  }
}

export async function getApplicationDetails(
  applicationId: string,
  serviceCategory: UserApplication['serviceCategory']
): Promise<any | null> {
  console.log(`[AppDetailsAction] Fetching details for app ${applicationId} in category ${serviceCategory}`);
  const user = await checkSessionAction();
  if (!user) {
    console.error('[AppDetailsAction] Unauthorized: No user session found.');
    throw new Error('Unauthorized: You must be logged in to view application details.');
  }

  try {
    const collectionName = getCollectionName(serviceCategory);
    if (!collectionName) {
        throw new Error(`Invalid service category provided: ${serviceCategory}`);
    }

    const appRef = doc(db, collectionName, applicationId);
    const docSnap = await getDoc(appRef);

    if (!docSnap.exists()) {
      console.warn(`[AppDetailsAction] Application not found: ${applicationId} in ${collectionName}`);
      return null;
    }

    const applicationData = docSnap.data();
    const submitterId = applicationData.submittedBy?.userId;

    if (user.id !== submitterId && !user.isAdmin) {
      console.error(`[AppDetailsAction] Forbidden: User ${user.id} tried to access application ${applicationId} owned by ${submitterId}.`);
      throw new Error('Forbidden: You do not have permission to view this application.');
    }
    
    console.log(`[AppDetailsAction] Successfully fetched and authorized access for ${applicationId}.`);
    return JSON.parse(JSON.stringify(applicationData, (key, value) => {
        if (value && value.toDate) {
            return value.toDate().toISOString();
        }
        return value;
    }));

  } catch (error: any) {
    console.error(`[AppDetailsAction] Error fetching application details for ${applicationId}:`, error.message, error.stack);
    throw new Error('Failed to fetch application details.');
  }
}

export async function updateApplicationAction(
  applicationId: string,
  serviceCategory: UserApplication['serviceCategory'],
  data: any
): Promise<{ success: boolean; message: string; errors?: Record<string, string[]> }> {
  console.log(`[AppUpdateAction] Updating app ${applicationId} in category ${serviceCategory}`);

  const user = await checkSessionAction();
  if (!user) {
    throw new Error('Unauthorized: You must be logged in to update an application.');
  }

  const collectionName = getCollectionName(serviceCategory);
  if (!collectionName) {
    return { success: false, message: 'Invalid service category.' };
  }

  try {
    const appRef = doc(db, collectionName, applicationId);
    const docSnap = await getDoc(appRef);

    if (!docSnap.exists()) {
      throw new Error('Application not found.');
    }

    const existingApplicationData = docSnap.data();
    const submitterId = existingApplicationData.submittedBy?.userId;
    const submitterType = existingApplicationData.submittedBy?.userType;

    if (user.id !== submitterId && !user.isAdmin) {
      throw new Error('Unauthorized: You do not have permission to perform this action.');
    }
    
    // Intelligent payload shaping: If the incoming data is the raw form data, wrap it.
    // This makes the action robust to being called from different places.
    const payloadForServer = data.formData ? data : { formData: data };
    
    const applicantUserId = submitterType === 'normal' ? submitterId : null;

    // Standardized update of applicantDetails at the root of the application
    if (payloadForServer.formData && payloadForServer.formData.personalDetails) {
        payloadForServer.applicantDetails = {
            userId: applicantUserId,
            fullName: payloadForServer.formData.personalDetails.fullName,
            email: payloadForServer.formData.personalDetails.email,
        };
    }

    payloadForServer.updatedAt = Timestamp.now();
    
    await updateDoc(appRef, payloadForServer);

    console.log(`[AppUpdateAction] Successfully updated application ${applicationId}`);
    revalidatePath('/admin/dashboard');
    revalidatePath('/dashboard');
    revalidatePath(`/admin/application/${applicationId}`);
    revalidatePath(`/dashboard/application/${applicationId}`);
    
    return { success: true, message: 'Application updated successfully!' };

  } catch (error: any)
{
    console.error(`[AppUpdateAction] Error updating application ${applicationId}:`, error.message, error.stack);
    return { success: false, message: error.message || 'Failed to update application.' };
  }
}
