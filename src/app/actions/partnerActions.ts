
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  documentId,
  getDoc,
  type DocumentData,
  Timestamp,
} from 'firebase/firestore';
import { checkSessionAction } from './authActions';
import type { UserProfileData } from './profileActions';
import type { UserApplication, UserData } from '@/lib/types';
import { formatApplication } from '@/lib/utils';

// This is the new, simplified client data structure for the UI
export interface PartnerClient {
    id: string;
    fullName: string;
    email: string;
    createdAt: string; // ISO string date
}


// Helper to verify that the logged-in user is a partner
async function verifyPartner() {
  const user = await checkSessionAction();
  if (!user || user.type !== 'partner') {
    throw new Error('Unauthorized: You must be a logged-in partner to perform this action.');
  }
  return user;
}

/**
 * Fetches a simple list of all users who have selected the current partner.
 * This replaces the complex pending/approved logic.
 */
export async function getPartnerClients(): Promise<PartnerClient[]> {
    const partner = await verifyPartner();
    console.log(`[PartnerActions] Fetching clients for partner ID: ${partner.id}`);

    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('partnerId', '==', partner.id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log(`[PartnerActions] No clients found for partner ${partner.id}.`);
            return [];
        }

        const clients = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const createdAtTimestamp = data.createdAt as Timestamp;
            return {
                id: doc.id,
                fullName: data.fullName,
                email: data.email,
                createdAt: createdAtTimestamp?.toDate().toISOString() || new Date().toISOString(),
            };
        });
        
        clients.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        console.log(`[PartnerActions] Found ${clients.length} clients for partner ${partner.id}.`);
        return clients;

    } catch (error: any) {
        console.error(`[PartnerActions] Error fetching clients for partner ${partner.id}:`, error.message);
        return [];
    }
}


/**
 * Helper function to get an array of client user IDs for a given partner.
 * This now queries the 'users' collection directly.
 * @param partnerId The ID of the partner.
 * @returns A promise that resolves to an array of client user IDs.
 */
export async function getPartnerClientIds(partnerId: string): Promise<string[]> {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('partnerId', '==', partnerId));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            return [];
        }
        
        return querySnapshot.docs.map(doc => doc.id);
    } catch (error) {
        console.error(`[PartnerActions] Error fetching client IDs for partner ${partnerId}:`, error);
        return [];
    }
}

/**
 * Fetches and calculates all necessary data for the partner's analytics dashboard.
 */
export async function getPartnerAnalytics(): Promise<{ applications: UserApplication[] }> {
    const partner = await verifyPartner();
    const partnerId = partner.id;

    try {
        const allCollections = ['loanApplications', 'caServiceApplications', 'governmentSchemeApplications'];
        const clientIds = await getPartnerClientIds(partnerId);

        const appPromises: Promise<DocumentData[]>[] = [];

        // Query for apps submitted BY the partner
        for (const coll of allCollections) {
            const q = query(collection(db, coll), where('submittedBy.userId', '==', partnerId));
            appPromises.push(getDocs(q).then(snap => snap.docs));
        }

        // Query for apps submitted BY the partner's clients
        if (clientIds.length > 0) {
            for (const coll of allCollections) {
                const q = query(collection(db, coll), where('applicantDetails.userId', 'in', clientIds));
                appPromises.push(getDocs(q).then(snap => snap.docs));
            }
        }
        
        const snapshots = await Promise.all(appPromises);
        const allDocs = snapshots.flat();

        const uniqueAppMap = new Map<string, UserApplication>();
        allDocs.forEach(doc => {
            let category: UserApplication['serviceCategory'] = 'Unknown';
            if (doc.ref.parent.id.startsWith('loan')) category = 'loan';
            else if (doc.ref.parent.id.startsWith('caService')) category = 'caService';
            else if (doc.ref.parent.id.startsWith('governmentScheme')) category = 'governmentScheme';
            
            const formattedApp = formatApplication(doc, category);
            uniqueAppMap.set(formattedApp.id, formattedApp);
        });

        const allApplications = Array.from(uniqueAppMap.values())
            .filter(app => app.status !== 'Archived')
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return { applications: allApplications };

    } catch (error: any) {
        console.error(`[PartnerActions] Error fetching analytics for partner ${partnerId}:`, error);
        return { applications: [] };
    }
}


/**
 * Allows a partner to disassociate a client from their account.
 * This does not delete the client, but makes them an independent user.
 */
export async function disassociateClientAction(clientId: string): Promise<{ success: boolean; message: string }> {
    const partner = await verifyPartner();
    console.log(`[PartnerActions] Partner ${partner.id} attempting to disassociate client ${clientId}.`);

    try {
        const clientIds = await getPartnerClientIds(partner.id);
        if (!clientIds.includes(clientId)) {
            return { success: false, message: "Forbidden: This client is not managed by you." };
        }

        const clientRef = doc(db, 'users', clientId);
        await updateDoc(clientRef, {
            partnerId: null
        });
        
        revalidatePath('/dashboard?tab=my_clients');
        return { success: true, message: "Client has been successfully disassociated." };

    } catch (error: any) {
        console.error(`[PartnerActions] Error disassociating client ${clientId}:`, error);
        return { success: false, message: "Failed to disassociate client due to a server error." };
    }
}

/**
 * Fetches full details for a specific client, but only if they belong to the current partner.
 */
export async function getPartnerClientDetails(clientId: string): Promise<{ client: UserProfileData; applications: UserApplication[] } | null> {
    const partner = await verifyPartner();
    console.log(`[PartnerActions] Partner ${partner.id} fetching details for client ${clientId}.`);
    
    try {
        const clientIds = await getPartnerClientIds(partner.id);
        if (!clientIds.includes(clientId)) {
            throw new Error("Forbidden: You do not have permission to view this client.");
        }

        const clientRef = doc(db, 'users', clientId);
        const clientSnap = await getDoc(clientRef);
        if (!clientSnap.exists()) {
            return null;
        }

        const clientData = clientSnap.data();
        const profileData = {
            id: clientSnap.id,
            ...clientData,
            createdAt: clientData.createdAt.toDate().toISOString(),
        } as UserProfileData;


        const userSpecificConstraints = [where('applicantDetails.userId', '==', clientId)];
        const allCollections = ['loanApplications', 'caServiceApplications', 'governmentSchemeApplications'];
        const appPromises = allCollections.map(coll => getDocs(query(collection(db, coll), ...userSpecificConstraints)));

        const appSnapshots = await Promise.all(appPromises);
        const applications = appSnapshots.flatMap((snapshot, index) => {
            const category = allCollections[index].includes('loan') ? 'loan' : allCollections[index].includes('caService') ? 'caService' : 'governmentScheme';
            return snapshot.docs.map(doc => formatApplication(doc, category));
        });
        applications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return { client: profileData, applications };
    } catch (error: any) {
        console.error(`[PartnerActions] Error fetching client details for partner ${partner.id}:`, error);
        return null;
    }
}
