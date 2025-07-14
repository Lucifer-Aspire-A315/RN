
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
import type { UserApplication } from '@/lib/types';
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
