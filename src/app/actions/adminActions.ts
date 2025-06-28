
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, doc, updateDoc, writeBatch, documentId, getDoc, deleteDoc } from 'firebase/firestore';
import type { UserApplication, PartnerData } from '@/lib/types';
import type { DocumentData } from 'firebase/firestore';
import { checkSessionAction } from './authActions';
import { getApplicationDetails } from './applicationActions';
import { deleteFilesByUrlAction } from './fileUploadActions';
import { getCollectionName } from '@/lib/utils';

// Helper function to ensure only admins can execute these actions
async function verifyAdmin() {
  const user = await checkSessionAction();
  if (!user?.isAdmin) {
    throw new Error('Unauthorized: You do not have permission to perform this action.');
  }
  return user;
}


function formatApplication(doc: DocumentData, defaultCategory: UserApplication['serviceCategory']): UserApplication {
    const data = doc.data();
    const createdAtTimestamp = data.createdAt as Timestamp;

    let applicationTypeDisplay = data.applicationType;
    if (defaultCategory === 'governmentScheme' && data.schemeNameForDisplay) {
        applicationTypeDisplay = data.schemeNameForDisplay;
    }
    
    const applicantInfo = data.applicantDetails || data.submittedBy;
    const applicantFullName = applicantInfo?.fullName || applicantInfo?.userName || 'N/A';
    const applicantEmail = applicantInfo?.email || applicantInfo?.userEmail || 'N/A';
    const applicantUserId = applicantInfo?.userId || 'N/A';

    return {
        id: doc.id,
        applicantDetails: {
            userId: applicantUserId,
            fullName: applicantFullName,
            email: applicantEmail,
        },
        serviceCategory: data.serviceCategory || defaultCategory,
        applicationType: applicationTypeDisplay,
        createdAt: createdAtTimestamp?.toDate().toISOString() || new Date().toISOString(),
        status: data.status || 'Unknown',
    };
}


function formatPartnerData(doc: DocumentData): PartnerData {
    const data = doc.data();
    const createdAtTimestamp = data.createdAt as Timestamp;
    return {
        id: doc.id,
        fullName: data.fullName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        businessModel: data.businessModel,
        createdAt: createdAtTimestamp?.toDate().toISOString() || new Date().toISOString(),
        isApproved: data.isApproved,
    };
}


export async function getAllApplications(): Promise<UserApplication[]> {
  await verifyAdmin();
  console.log('[AdminActions] Fetching all user applications...');

  try {
    const loanApplicationsRef = collection(db, 'loanApplications');
    const caServiceApplicationsRef = collection(db, 'caServiceApplications');
    const governmentSchemeApplicationsRef = collection(db, 'governmentSchemeApplications');

    const qLoan = query(loanApplicationsRef, where('status', '!=', 'Archived'));
    const qCa = query(caServiceApplicationsRef, where('status', '!=', 'Archived'));
    const qGov = query(governmentSchemeApplicationsRef, where('status', '!=', 'Archived'));


    const [loanSnapshot, caSnapshot, govSnapshot] = await Promise.all([
      getDocs(qLoan),
      getDocs(qCa),
      getDocs(qGov),
    ]);
    
    console.log(`[AdminActions] Found ${loanSnapshot.size} loan, ${caSnapshot.size} CA, and ${govSnapshot.size} gov scheme applications.`);

    const loanApplications = loanSnapshot.docs.map(doc => formatApplication(doc, 'loan'));
    const caApplications = caSnapshot.docs.map(doc => formatApplication(doc, 'caService'));
    const govApplications = govSnapshot.docs.map(doc => formatApplication(doc, 'governmentScheme'));

    const allApplications = [...loanApplications, ...caApplications, ...govApplications];
    allApplications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log(`[AdminActions] Successfully fetched and merged ${allApplications.length} applications.`);
    return allApplications;

  } catch (error: any) {
    console.error('[AdminActions] Error fetching all applications from Firestore:', error.message, error.stack);
    return [];
  }
}

export async function getPendingPartners(): Promise<PartnerData[]> {
    await verifyAdmin();
    console.log('[AdminActions] Fetching pending partners...');

    try {
        const partnersRef = collection(db, 'partners');
        const q = query(partnersRef, where('isApproved', '==', false));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log('[AdminActions] No pending partners found.');
            return [];
        }

        const pendingPartners = querySnapshot.docs.map(formatPartnerData);

        console.log(`[AdminActions] Found ${pendingPartners.length} pending partners.`);
        return pendingPartners;

    } catch (error: any) {
        console.error('[AdminActions] Error fetching pending partners:', error.message, error.stack);
        return [];
    }
}

export async function getAllPartners(): Promise<PartnerData[]> {
    await verifyAdmin();
    console.log('[AdminActions] Fetching all approved partners...');

    try {
        const partnersRef = collection(db, 'partners');
        const q = query(partnersRef, where('isApproved', '==', true));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log('[AdminActions] No approved partners found.');
            return [];
        }

        const allPartners = querySnapshot.docs.map(formatPartnerData);

        allPartners.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        console.log(`[AdminActions] Found ${allPartners.length} approved partners.`);
        return allPartners;

    } catch (error: any) {
        console.error('[AdminActions] Error fetching all partners:', error.message, error.stack);
        return [];
    }
}


export async function approvePartner(partnerId: string): Promise<{ success: boolean; message: string }> {
    await verifyAdmin();
    console.log(`[AdminActions] Attempting to approve partner with ID: ${partnerId}`);

    try {
        const partnerRef = doc(db, 'partners', partnerId);
        await updateDoc(partnerRef, {
            isApproved: true
        });
        
        console.log(`[AdminActions] Successfully approved partner: ${partnerId}`);
        revalidatePath('/admin/dashboard');
        return { success: true, message: 'Partner approved successfully.' };
    } catch (error: any) {
        console.error(`[AdminActions] Error approving partner ${partnerId}:`, error.message, error.stack);
        return { success: false, message: 'Failed to approve partner.' };
    }
}


export async function updateApplicationStatus(
  applicationId: string,
  serviceCategory: UserApplication['serviceCategory'],
  newStatus: string
): Promise<{ success: boolean; message: string }> {
  await verifyAdmin();
  console.log(`[AdminActions] Attempting to update status for app ${applicationId} in category ${serviceCategory} to ${newStatus}`);
  
  const collectionName = getCollectionName(serviceCategory);
  if (!collectionName) {
      console.error(`[AdminActions] Invalid service category provided: ${serviceCategory}`);
      return { success: false, message: 'Invalid service category.' };
  }

  try {
    const appRef = doc(db, collectionName, applicationId);
    await updateDoc(appRef, {
      status: newStatus,
      updatedAt: Timestamp.now(),
    });

    console.log(`[AdminActions] Successfully updated status for ${applicationId}`);
    revalidatePath('/admin/dashboard');
    revalidatePath('/dashboard');
    return { success: true, message: `Application status updated to ${newStatus}.` };
  } catch (error: any) {
    console.error(`[AdminActions] Error updating status for ${applicationId}:`, error.message, error.stack);
    return { success: false, message: 'Failed to update application status.' };
  }
}

function findFileUrls(data: any): string[] {
    const urls: string[] = [];
    if (!data || typeof data !== 'object') {
        return urls;
    }

    for (const key in data) {
        const value = data[key];
        if (typeof value === 'string' && value.startsWith('https://firebasestorage.googleapis.com')) {
            urls.push(value);
        } else if (typeof value === 'object') {
            urls.push(...findFileUrls(value));
        }
    }
    return urls;
}

export async function archiveApplicationAction(
  applicationId: string,
  serviceCategory: UserApplication['serviceCategory']
): Promise<{ success: boolean; message: string }> {
    await verifyAdmin();
    console.log(`[AdminActions] Archiving application ${applicationId} in category ${serviceCategory}...`);

    try {
        // Step 1: Get full application data to find file URLs
        const applicationData = await getApplicationDetails(applicationId, serviceCategory);
        if (!applicationData) {
            throw new Error('Application not found or you do not have permission.');
        }

        // Step 2: Find all file URLs within the form data
        const fileUrls = findFileUrls(applicationData.formData);
        console.log(`[AdminActions] Found ${fileUrls.length} files to delete for application ${applicationId}.`);

        // Step 3: Delete files from Firebase Storage if any are found
        if (fileUrls.length > 0) {
            const deleteResult = await deleteFilesByUrlAction(fileUrls);
            if (!deleteResult.success) {
                // Log error but continue to archive the application record
                console.error(`[AdminActions] Failed to delete some files, but proceeding with archival. Error: ${deleteResult.error}`);
            }
        }

        // Step 4: Update the application status to 'Archived' in Firestore
        const collectionName = getCollectionName(serviceCategory);
        const appRef = doc(db, collectionName, applicationId);
        await updateDoc(appRef, {
            status: 'Archived',
            updatedAt: Timestamp.now(),
        });
        
        console.log(`[AdminActions] Successfully archived application ${applicationId}.`);
        revalidatePath('/admin/dashboard');
        revalidatePath('/dashboard');
        return { success: true, message: 'Application archived successfully. Associated files have been deleted.' };

    } catch (error: any) {
        console.error(`[AdminActions] Error archiving application ${applicationId}:`, error.message, error.stack);
        return { success: false, message: 'Failed to archive application.' };
    }
}

export async function getPartnerDetails(partnerId: string): Promise<PartnerData | null> {
    await verifyAdmin();
    console.log(`[AdminActions] Fetching details for partner ID: ${partnerId}`);

    try {
        const partnerRef = doc(db, 'partners', partnerId);
        const docSnap = await getDoc(partnerRef);

        if (!docSnap.exists()) {
            console.warn(`[AdminActions] Partner not found: ${partnerId}`);
            return null;
        }

        return formatPartnerData(docSnap);
    } catch (error: any) {
        console.error(`[AdminActions] Error fetching partner details for ${partnerId}:`, error.message, error.stack);
        return null;
    }
}

export async function getApplicationsByPartner(partnerId: string): Promise<UserApplication[]> {
    await verifyAdmin();
    console.log(`[AdminActions] Fetching applications for partner ID: ${partnerId}`);

    try {
        const loanApplicationsRef = collection(db, 'loanApplications');
        const caServiceApplicationsRef = collection(db, 'caServiceApplications');
        const governmentSchemeApplicationsRef = collection(db, 'governmentSchemeApplications');

        const partnerQueryConstraints = [
            where('submittedBy.userId', '==', partnerId)
        ];

        const qLoan = query(loanApplicationsRef, ...partnerQueryConstraints);
        const qCa = query(caServiceApplicationsRef, ...partnerQueryConstraints);
        const qGov = query(governmentSchemeApplicationsRef, ...partnerQueryConstraints);
        
        const [loanSnapshot, caSnapshot, govSnapshot] = await Promise.all([
            getDocs(qLoan),
            getDocs(qCa),
            getDocs(qGov),
        ]);

        const loanApplications = loanSnapshot.docs.map(doc => formatApplication(doc, 'loan'));
        const caApplications = caSnapshot.docs.map(doc => formatApplication(doc, 'caService'));
        const govApplications = govSnapshot.docs.map(doc => formatApplication(doc, 'governmentScheme'));

        const allApplications = [...loanApplications, ...caApplications, ...govApplications];
        allApplications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        console.log(`[AdminActions] Found ${allApplications.length} applications for partner ${partnerId}.`);
        return allApplications;

    } catch (error: any) {
        console.error(`[AdminActions] Error fetching applications for partner ${partnerId}:`, error.message, error.stack);
        return [];
    }
}

export async function removePartnerAction(partnerId: string): Promise<{ success: boolean; message: string }> {
    await verifyAdmin();
    console.log(`[AdminActions] Attempting to remove partner with ID: ${partnerId}`);

    try {
        const partnerRef = doc(db, 'partners', partnerId);
        await deleteDoc(partnerRef);

        console.log(`[AdminActions] Successfully removed partner: ${partnerId}`);
        revalidatePath('/admin/dashboard');
        return { success: true, message: 'Partner removed successfully.' };
    } catch (error: any) {
        console.error(`[AdminActions] Error removing partner ${partnerId}:`, error.message, error.stack);
        return { success: false, message: 'Failed to remove partner.' };
    }
}
