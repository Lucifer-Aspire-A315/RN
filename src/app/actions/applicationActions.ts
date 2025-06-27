
'use server';

import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { checkSessionAction } from './authActions';
import type { UserApplication } from '@/lib/types';
import { getCollectionName } from '@/lib/utils';
import { processFileUploads } from '@/lib/form-helpers';
import { revalidatePath } from 'next/cache';

async function verifyAdmin() {
  const user = await checkSessionAction();
  if (!user?.isAdmin) {
    throw new Error('Unauthorized: You do not have permission to perform this action.');
  }
  return user;
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
  await verifyAdmin();
  console.log(`[AppUpdateAction] Updating app ${applicationId} in category ${serviceCategory}`);

  const collectionName = getCollectionName(serviceCategory);
  if (!collectionName) {
    return { success: false, message: 'Invalid service category.' };
  }

  const payloadForServer = JSON.parse(JSON.stringify(data));
  
  // This helper finds the key for the document uploads object (e.g., 'documentUploads', 'dsaDocumentUploads')
  const findDocumentUploadsKey = (obj: any): string | null => {
    if (!obj || typeof obj !== 'object') return null;
    for (const key in obj) {
      if (key.toLowerCase().includes('documentuploads')) {
        return key;
      }
    }
    return null;
  };

  try {
    const documentUploadsKey = findDocumentUploadsKey(payloadForServer.formData);

    if (documentUploadsKey && payloadForServer.formData[documentUploadsKey]) {
        // processFileUploads is smart enough to only upload new File objects and ignore existing URL strings
        const uploadedUrls = await processFileUploads(payloadForServer.formData[documentUploadsKey], () => {}); // Using a dummy toast function
        
        // Merge new URLs with existing ones
        Object.assign(payloadForServer.formData[documentUploadsKey], uploadedUrls);
    }
    
    // Add applicant details based on form type (this logic is duplicated from create actions, might be refactored)
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
    
    const appRef = doc(db, collectionName, applicationId);
    await updateDoc(appRef, payloadForServer);

    console.log(`[AppUpdateAction] Successfully updated application ${applicationId}`);
    revalidatePath('/admin/dashboard');
    revalidatePath(`/admin/application/${applicationId}`);
    
    return { success: true, message: 'Application updated successfully!' };

  } catch (error: any) {
    console.error(`[AppUpdateAction] Error updating application ${applicationId}:`, error.message, error.stack);
    return { success: false, message: 'Failed to update application.' };
  }
}
