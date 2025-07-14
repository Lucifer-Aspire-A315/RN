
'use server';

import { doc, getDoc, updateDoc, Timestamp, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
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

// Security Check helper. 
async function canUserViewApplication(user: UserData, applicationData: any): Promise<boolean> {
  // Admin can view anything.
  if (user.isAdmin) {
    return true;
  }
  
  // The user who submitted it can view it.
  const submitterId = applicationData.submittedBy?.userId;
  if (user.id === submitterId) {
    return true;
  }
  
  // A partner can view it if the applicant is one of their approved clients.
  if (user.type === 'partner') {
    const applicantId = applicationData.applicantDetails?.userId;
    if (!applicantId) {
      return false; // No applicant associated, partner cannot view.
    }
    const clientIds = await getPartnerClientIds(user.id);
    return clientIds.includes(applicantId);
  }
  
  // The applicant themselves can view it.
  const applicantId = applicationData.applicantDetails?.userId;
  if(user.id === applicantId) {
      return true;
  }
  
  return false;
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
    
    // Centralized Security Check
    const isAllowed = await canUserViewApplication(user, applicationData);

    if (!isAllowed) {
      console.error(`[AppDetailsAction] Forbidden: User ${user.id} tried to access application ${applicationId}.`);
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

    // Security check to ensure only owner or admin can update
    const existingApplicationData = docSnap.data();
    const isAllowed = await canUserViewApplication(user, existingApplicationData);
    if (!isAllowed) {
        throw new Error('Unauthorized: You do not have permission to perform this action.');
    }
    
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
