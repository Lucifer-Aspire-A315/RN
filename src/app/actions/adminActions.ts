
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, doc, updateDoc, writeBatch, documentId, getDoc, deleteDoc } from 'firebase/firestore';
import type { UserApplication, PartnerData, UserData } from '@/lib/types';
import type { DocumentData } from 'firebase/firestore';
import { checkSessionAction } from './authActions';
import { verifyApplicationPermission } from './applicationActions';
import { deleteFilesByUrlAction } from './fileUploadActions';
import { getCollectionName, formatApplication } from '@/lib/utils';
import { sendEmail } from '@/lib/email';
import { PartnerApprovedEmail } from '@/components/emails/PartnerApprovedEmail';
import { ApplicationStatusUpdateEmail } from '@/components/emails/ApplicationStatusUpdateEmail';
import { getPartnerClientIds } from './partnerActions';
import { PartnerClient } from './partnerActions';

// Helper function to ensure only admins can execute these actions
async function verifyAdmin() {
  const user = await checkSessionAction();
  if (!user?.isAdmin) {
    throw new Error('Unauthorized: You do not have permission to perform this action.');
  }
  return user;
}


function formatPartnerData(doc: DocumentData): PartnerData {
    const data = doc.data();
    const createdAtTimestamp = data.createdAt as Timestamp;
    // Defensive check for mobile number to support old and new data structures
    const mobileNumber = data.mobileNumber || data.personalDetails?.mobileNumber || 'N/A';
    
    return {
        id: doc.id,
        fullName: data.fullName,
        email: data.email,
        mobileNumber: mobileNumber,
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

        const allPartners = querySnapshot.docs
            .filter(doc => doc.data().isAdmin !== true) // Exclude admins from the partner list
            .map(formatPartnerData);

        allPartners.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        console.log(`[AdminActions] Found ${allPartners.length} approved partners (excluding admins).`);
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
        const partnerSnap = await getDoc(partnerRef);
        if(!partnerSnap.exists()) {
            return { success: false, message: 'Partner not found.' };
        }
        const partnerData = partnerSnap.data() as PartnerData;

        await updateDoc(partnerRef, {
            isApproved: true
        });
        
        // Send approval email
        await sendEmail({
            to: partnerData.email,
            subject: 'Congratulations! Your RN FinTech Partner Account is Approved!',
            react: PartnerApprovedEmail({ name: partnerData.fullName }),
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
  console.log(`[MultiAccessActions] Attempting to update status for app ${applicationId}`);
  
  try {
    // REFACTORED: Use the centralized security function
    const { applicationData: appData } = await verifyApplicationPermission(applicationId, serviceCategory);

    const collectionName = getCollectionName(serviceCategory)!;
    const appRef = doc(db, collectionName, applicationId);

    await updateDoc(appRef, {
      status: newStatus,
      updatedAt: Timestamp.now(),
    });
    
    // Send status update email
    if (appData.submittedBy?.userEmail) {
        await sendEmail({
            to: appData.submittedBy.userEmail,
            subject: `Update on your ${appData.applicationType} application`,
            react: ApplicationStatusUpdateEmail({
                name: appData.submittedBy.userName,
                applicationType: appData.schemeNameForDisplay || appData.applicationType,
                applicationId: applicationId,
                newStatus: newStatus,
            }),
        });
    }

    console.log(`[MultiAccessActions] Successfully updated status for ${applicationId}`);
    revalidatePath('/admin/dashboard');
    revalidatePath('/dashboard');
    return { success: true, message: `Application status updated to ${newStatus}.` };
  } catch (error: any) {
    console.error(`[MultiAccessActions] Error updating status for ${applicationId}:`, error.message, error.stack);
    return { success: false, message: error.message || 'Failed to update application status.' };
  }
}

function findFileUrls(data: any): string[] {
    const urls: string[] = [];
    if (!data || typeof data !== 'object') {
        return urls;
    }

    for (const key in data) {
        const value = data[key];
        if (typeof value === 'string' && value.startsWith('https://storage.googleapis.com')) {
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
    console.log(`[MultiAccessActions] Archiving application ${applicationId}...`);

    try {
        // REFACTORED: Use the centralized security function
        const { applicationData } = await verifyApplicationPermission(applicationId, serviceCategory);
        
        // Find all file URLs within the form data
        const fileUrls = findFileUrls(applicationData.formData);
        console.log(`[MultiAccessActions] Found ${fileUrls.length} files to delete for application ${applicationId}.`);

        // Delete files from Firebase Storage if any are found
        if (fileUrls.length > 0) {
            const deleteResult = await deleteFilesByUrlAction(fileUrls);
            if (!deleteResult.success) {
                // Log error but continue to archive the application record
                console.error(`[MultiAccessActions] Failed to delete some files, but proceeding with archival. Error: ${deleteResult.error}`);
            }
        }

        // Update the application status to 'Archived' in Firestore
        const appRef = doc(db, getCollectionName(serviceCategory)!, applicationId);
        await updateDoc(appRef, {
            status: 'Archived',
            updatedAt: Timestamp.now(),
        });
        
        console.log(`[MultiAccessActions] Successfully archived application ${applicationId}.`);
        revalidatePath('/admin/dashboard');
        revalidatePath('/dashboard');
        return { success: true, message: 'Application archived successfully. Associated files have been deleted.' };

    } catch (error: any) {
        console.error(`[MultiAccessActions] Error archiving application ${applicationId}:`, error.message, error.stack);
        return { success: false, message: error.message || 'Failed to archive application.' };
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
    console.log(`[AdminActions] Attempting to deactivate partner with ID: ${partnerId}`);

    try {
        const partnerRef = doc(db, 'partners', partnerId);
        await updateDoc(partnerRef, {
            isApproved: false
        });

        console.log(`[AdminActions] Successfully deactivated partner: ${partnerId}`);
        revalidatePath('/admin/dashboard');
        return { success: true, message: 'Partner has been deactivated and moved to the pending list.' };
    } catch (error: any) {
        console.error(`[AdminActions] Error deactivating partner ${partnerId}:`, error.message, error.stack);
        return { success: false, message: 'Failed to deactivate partner.' };
    }
}

/**
 * Fetches a lightweight list of approved partners, suitable for populating a dropdown menu.
 * This function is public and does not require admin authentication.
 */
export async function getApprovedPartnerList(): Promise<{ id: string; fullName: string; businessModel: 'referral' | 'dsa' | 'merchant' }[]> {
    try {
        const partnersRef = collection(db, 'partners');
        const q = query(partnersRef, where('isApproved', '==', true));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs
            .filter(doc => doc.data().isAdmin !== true)
            .map(doc => ({
                id: doc.id,
                fullName: doc.data().fullName,
                businessModel: doc.data().businessModel,
            }));
            
    } catch (error) {
        console.error('[AdminActions] Error fetching approved partner list:', error);
        return [];
    }
}

export interface AdminClientData extends PartnerClient {
    partnerName: string | null;
}

export async function getAllClientsForAdmin(): Promise<AdminClientData[]> {
    await verifyAdmin();
    console.log('[AdminActions] Fetching all clients for admin view...');
    
    try {
        const [partnersSnapshot, usersSnapshot] = await Promise.all([
            getDocs(query(collection(db, 'partners'), where('isApproved', '==', true))),
            getDocs(collection(db, 'users'))
        ]);
        
        const partnerMap = new Map<string, string>();
        partnersSnapshot.forEach(doc => {
            partnerMap.set(doc.id, doc.data().fullName);
        });

        const allClients: AdminClientData[] = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            const partnerId = data.partnerId;
            const createdAtTimestamp = data.createdAt as Timestamp;
            return {
                id: doc.id,
                fullName: data.fullName,
                email: data.email,
                createdAt: createdAtTimestamp?.toDate().toISOString() || new Date().toISOString(),
                partnerName: partnerId ? partnerMap.get(partnerId) || 'Partner Not Found' : 'No Partner'
            };
        });
        
        allClients.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        console.log(`[AdminActions] Found ${allClients.length} total clients.`);
        return allClients;

    } catch (error: any) {
        console.error('[AdminActions] Error fetching clients for admin:', error);
        return [];
    }
}
