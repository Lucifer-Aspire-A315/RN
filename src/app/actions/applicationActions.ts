
'use server';

import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { checkSessionAction } from './authActions';
import type { UserApplication } from '@/lib/types';
import { getCollectionName } from '@/lib/utils';
import { processFileUploads } from '@/lib/form-helpers';
import { revalidatePath } from 'next/cache';

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

    // Security check: User must be the one who submitted it OR an admin
    if (user.id !== submitterId && !user.isAdmin) {
      console.error(`[AppDetailsAction] Forbidden: User ${user.id} tried to access application ${applicationId} owned by ${submitterId}.`);
      throw new Error('Forbidden: You do not have permission to view this application.');
    }
    
    console.log(`[AppDetailsAction] Successfully fetched and authorized access for ${applicationId}.`);
    // Convert Timestamps to ISO strings for serialization
    return JSON.parse(JSON.stringify(applicationData, (key, value) => {
        if (value && value.toDate) { // Firestore Timestamp check
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
    // Authorize user: Check if user is admin or original submitter
    const appRef = doc(db, collectionName, applicationId);
    const docSnap = await getDoc(appRef);

    if (!docSnap.exists()) {
      throw new Error('Application not found.');
    }

    const applicationData = docSnap.data();
    const submitterId = applicationData.submittedBy?.userId;

    if (user.id !== submitterId && !user.isAdmin) {
      throw new Error('Unauthorized: You do not have permission to perform this action.');
    }

    // Proceed with update logic
    const payloadForServer = JSON.parse(JSON.stringify(data));
    
    const findDocumentUploadsKey = (obj: any): string | null => {
      if (!obj || typeof obj !== 'object') return null;
      for (const key in obj) {
        if (key.toLowerCase().includes('documentuploads')) {
          return key;
        }
      }
      return null;
    };

    const documentUploadsKey = findDocumentUploadsKey(payloadForServer.formData);

    if (documentUploadsKey && payloadForServer.formData[documentUploadsKey]) {
        const uploadedUrls = await processFileUploads(payloadForServer.formData[documentUploadsKey], () => {});
        Object.assign(payloadForServer.formData[documentUploadsKey], uploadedUrls);
    }
    
    if (serviceCategory === 'loan' && payloadForServer.formData.applicantDetails) {
        payloadForServer.applicantDetails = {
            userId: null, 
            fullName: payloadForServer.formData.applicantDetails.name,
            email: payloadForServer.formData.applicantDetails.email,
        };
    } else if (serviceCategory === 'caService' && payloadForServer.formData.applicantDetails) {
        payloadForServer.applicantDetails = {
            userId: null,
            fullName: payloadForServer.formData.applicantDetails.fullName,
            email: payloadForServer.formData.applicantDetails.emailId,
        };
    } else if (serviceCategory === 'governmentScheme' && payloadForServer.formData.applicantDetailsGov) {
         payloadForServer.applicantDetails = {
            userId: null,
            fullName: payloadForServer.formData.applicantDetailsGov.fullName,
            email: payloadForServer.formData.applicantDetailsGov.emailId,
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

  } catch (error: any) {
    console.error(`[AppUpdateAction] Error updating application ${applicationId}:`, error.message, error.stack);
    return { success: false, message: error.message || 'Failed to update application.' };
  }
}
