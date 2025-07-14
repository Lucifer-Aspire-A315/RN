
'use server';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, type QueryConstraint, type DocumentData } from 'firebase/firestore';
import type { UserApplication, UserData } from '@/lib/types';
import { formatApplication } from '@/lib/utils';
import { checkSessionAction } from './authActions';
import { getPartnerClientIds } from './partnerActions';


export async function getUserApplications(): Promise<UserApplication[]> {
  const user = await checkSessionAction();
  if (!user) {
    console.warn('[DashboardActions] No user session found. Returning empty array.');
    return [];
  }

  console.log(`[DashboardActions] User ID: ${user.id}, Type: ${user.type}. Querying collections...`);

  try {
    const allCollections = ['loanApplications', 'caServiceApplications', 'governmentSchemeApplications'];
    let allApplications: UserApplication[] = [];

    if (user.type === 'partner') {
        const clientIds = await getPartnerClientIds(user.id);
        
        const appPromises: Promise<DocumentData[]>[] = [];

        // Query for apps submitted BY the partner
        for (const coll of allCollections) {
            const q = query(collection(db, coll), where('submittedBy.userId', '==', user.id));
            appPromises.push(getDocs(q).then(snap => snap.docs));
        }

        // Query for apps submitted BY the partner's clients, if any exist
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
        
        allApplications = Array.from(uniqueAppMap.values());

    } else {
        // --- Normal User Logic ---
        const userSpecificConstraints: QueryConstraint[] = [
            where('applicantDetails.userId', '==', user.id),
        ];

        const qLoan = query(collection(db, 'loanApplications'), ...userSpecificConstraints);
        const qCa = query(collection(db, 'caServiceApplications'), ...userSpecificConstraints);
        const qGov = query(collection(db, 'governmentSchemeApplications'), ...userSpecificConstraints);

        const [loanSnapshot, caSnapshot, govSnapshot] = await Promise.all([
            getDocs(qLoan),
            getDocs(qCa),
            getDocs(qGov),
        ]);

        allApplications = [
            ...loanSnapshot.docs.map(doc => formatApplication(doc, 'loan')),
            ...caSnapshot.docs.map(doc => formatApplication(doc, 'caService')),
            ...govSnapshot.docs.map(doc => formatApplication(doc, 'governmentScheme')),
        ];
    }
    
    // Filter out archived applications and sort for all user types
    const nonArchivedApplications = allApplications.filter(app => app.status !== 'Archived');
    nonArchivedApplications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log(`[DashboardActions] Successfully fetched and merged ${nonArchivedApplications.length} non-archived applications for user ${user.id}.`);
    return nonArchivedApplications;

  } catch (error: any) {
    console.error('[DashboardActions] Error fetching user applications from Firestore:', error.message, error.stack);
    // In case of error, return an empty array to prevent the page from crashing.
    return [];
  }
}
