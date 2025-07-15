
'use server';

import { doc, getDoc, updateDoc, Timestamp, addDoc, collection, query, where, getDocs, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { checkSessionAction } from './authActions';
import type { UserApplication, UserData } from '@/lib/types';
import { getCollectionName } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/lib/email';
import { ApplicationSubmittedEmail } from '@/components/emails/ApplicationSubmittedEmail';
import { getPartnerClientIds } from './partnerActions';

interface ServerActionResponse {
  success: boolean;
  message: string;
  applicationId?: string;
  errors?: Record<string, string[]>;
}

// =================================================================
// NEW CENTRALIZED SECURITY VERIFICATION FUNCTION
// =================================================================
/**
 * Verifies if the current user has permission to access a specific application.
 * Throws an error if permission is denied.
 * @returns The session user and the application data if permission is granted.
 */
export async function verifyApplicationPermission(
  applicationId: string,
  serviceCategory: UserApplication['serviceCategory']
): Promise<{ user: UserData; applicationData: DocumentData }> {
  const user = await checkSessionAction();
  if (!user) {
    throw new Error('Unauthorized: You must be logged in to perform this action.');
  }

  const collectionName = getCollectionName(serviceCategory);
  if (!collectionName) {
    throw new Error(`Invalid service category provided: ${serviceCategory}`);
  }

  const appRef = doc(db, collectionName, applicationId);
  const docSnap = await getDoc(appRef);

  if (!docSnap.exists()) {
    throw new Error('Application not found.');
  }

  const applicationData = docSnap.data();

  // The single source of truth for authorization logic
  const isOwner = applicationData.submittedBy?.userId === user.id;
  const isApplicant = applicationData.applicantDetails?.userId === user.id;
  
  let isManagingPartner = false;
  if (user.type === 'partner') {
    const applicantId = applicationData.applicantDetails?.userId;
    if (applicantId) {
      const clientIds = await getPartnerClientIds(user.id);
      isManagingPartner = clientIds.includes(applicantId);
    }
  }

  if (user.isAdmin || isOwner || isApplicant || isManagingPartner) {
    return { user, applicationData };
  }

  // If none of the conditions are met, deny access.
  console.error(`[Security] Forbidden: User ${user.id} tried to access application ${applicationId}.`);
  throw new Error('Forbidden: You do not have permission to access this application.');
}


// Helper to find a user by email from the 'users' collection
async function findUserByEmail(email: string): Promise<{ id: string; data: DocumentData } | null> {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, data: userDoc.data() };
    }
    return null;
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
    
    // Standardized access to applicant's personal details from the form
    const personalDetails = formData.personalDetails;
    if (!personalDetails || !personalDetails.fullName || !personalDetails.email) {
      return { success: false, message: 'Applicant name or email could not be determined from form data.' };
    }
    const { fullName: applicantFullName, email: applicantEmail } = personalDetails;

    // --- CRITICAL LOGIC FIX ---
    // Determine the applicant's user ID.
    let applicantUserId: string | null = null;
    if (submitterUserType === 'normal') {
        // If a normal user submits, they are the applicant.
        applicantUserId = submitterUserId;
    } else if (submitterUserType === 'partner') {
        // If a partner submits, we need to find the client's user ID from their email.
        const clientUser = await findUserByEmail(applicantEmail);
        if (clientUser) {
            applicantUserId = clientUser.id;
        } else {
             console.log(`[AppSubmitAction] Partner submitted for a non-registered user: ${applicantEmail}. No applicant user ID will be linked.`);
        }
    }

    const applicationData = {
      applicantDetails: {
        userId: applicantUserId, // This now correctly links the application to the client user.
        fullName: applicantFullName,
        email: applicantEmail,
      },
      submittedBy: {
        userId: submitterUserId,
        userName: submitterUserName,
        userEmail: submitterUserEmail,
        userType: submitterUserType,
      },
      applicationType,
      serviceCategory,
      ...(schemeNameForDisplay && { schemeNameForDisplay }),
      formData: formData, 
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
    
    // Send confirmation email to the submitter
    await sendEmail({
      to: submitterUserEmail,
      subject: `Your ${applicationType} Application has been Received!`,
      react: ApplicationSubmittedEmail({
        name: submitterUserName,
        applicationType: schemeNameForDisplay || applicationType,
        applicationId: docRef.id,
      }),
    });


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

  try {
    // REFACTORED: Use the centralized security function
    const { applicationData } = await verifyApplicationPermission(applicationId, serviceCategory);
    
    console.log(`[AppDetailsAction] Successfully fetched and authorized access for ${applicationId}.`);
    // Return a serializable version of the data
    return JSON.parse(JSON.stringify(applicationData, (key, value) => {
        if (value && value.toDate) {
            return value.toDate().toISOString();
        }
        return value;
    }));

  } catch (error: any) {
    console.error(`[AppDetailsAction] Error fetching application details for ${applicationId}:`, error.message, error.stack);
    // Let the error propagate to be handled by the calling component (e.g., show a not found page)
    throw error;
  }
}

export async function updateApplicationAction(
  applicationId: string,
  serviceCategory: UserApplication['serviceCategory'],
  data: any
): Promise<{ success: boolean; message: string; errors?: Record<string, string[]> }> {
  console.log(`[AppUpdateAction] Updating app ${applicationId} in category ${serviceCategory}`);

  try {
    // REFACTORED: Use the centralized security function
    const { applicationData: existingApplicationData } = await verifyApplicationPermission(applicationId, serviceCategory);

    const collectionName = getCollectionName(serviceCategory)!;
    const appRef = doc(db, collectionName, applicationId);
    
    const payloadForServer = data.formData ? data : { formData: data };
    
    // --- CRITICAL LOGIC FIX ---
    // Ensure applicantDetails are updated with the correct user ID if possible
    if (payloadForServer.formData && payloadForServer.formData.personalDetails) {
        const applicantEmail = payloadForServer.formData.personalDetails.email;
        const clientUser = await findUserByEmail(applicantEmail);

        payloadForServer.applicantDetails = {
            userId: clientUser?.id || existingApplicationData.applicantDetails?.userId || null,
            fullName: payloadForServer.formData.personalDetails.fullName,
            email: applicantEmail,
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
