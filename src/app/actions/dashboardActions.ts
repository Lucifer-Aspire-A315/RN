
'use server';

import { cookies } from 'next/headers';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, type QueryConstraint } from 'firebase/firestore';
import type { UserApplication } from '@/lib/types';
import type { DocumentData } from 'firebase/firestore';


function formatApplication(doc: DocumentData, defaultCategory: UserApplication['serviceCategory']): UserApplication {
    const data = doc.data();
    const createdAtTimestamp = data.createdAt as Timestamp;

    // Determine the application type for display
    let applicationTypeDisplay = data.applicationType;
    if (defaultCategory === 'governmentScheme' && data.schemeNameForDisplay) {
        applicationTypeDisplay = data.schemeNameForDisplay;
    }
    
    // Prioritize client details from applicantDetails, fallback to submitter info for display.
    // This ensures the client's name is shown on the partner dashboard.
    const applicantFullName = data.applicantDetails?.fullName || data.submittedBy?.userName || 'N/A';
    const applicantEmail = data.applicantDetails?.email || data.applicantDetails?.emailId || data.submittedBy?.userEmail || 'N/A';
    const applicantUserId = data.applicantDetails?.userId || 'N/A';

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


export async function getUserApplications(): Promise<UserApplication[]> {
  console.log('[DashboardActions] Fetching user applications...');
  const userId = cookies().get('user_id')?.value;

  if (!userId) {
    console.warn('[DashboardActions] No user ID found in cookies. Returning empty array.');
    return [];
  }
  
  console.log(`[DashboardActions] User ID: ${userId}. Querying collections...`);

  try {
    const loanApplicationsRef = collection(db, 'loanApplications');
    const caServiceApplicationsRef = collection(db, 'caServiceApplications');
    const governmentSchemeApplicationsRef = collection(db, 'governmentSchemeApplications');

    // This single query works for both normal users and partners, as `submittedBy.userId`
    // is always the ID of the logged-in user who created the application.
    // We remove the status check from the query to make it more reliable and avoid indexing issues.
    const userSpecificConstraints: QueryConstraint[] = [
        where('submittedBy.userId', '==', userId),
    ];

    const qLoan = query(loanApplicationsRef, ...userSpecificConstraints);
    const qCa = query(caServiceApplicationsRef, ...userSpecificConstraints);
    const qGov = query(governmentSchemeApplicationsRef, ...userSpecificConstraints);


    const [loanSnapshot, caSnapshot, govSnapshot] = await Promise.all([
      getDocs(qLoan),
      getDocs(qCa),
      getDocs(qGov),
    ]);
    
    console.log(`[DashboardActions] Found ${loanSnapshot.size} loan, ${caSnapshot.size} CA, and ${govSnapshot.size} gov scheme applications before filtering.`);


    const loanApplications = loanSnapshot.docs.map(doc => formatApplication(doc, 'loan'));
    const caApplications = caSnapshot.docs.map(doc => formatApplication(doc, 'caService'));
    const govApplications = govSnapshot.docs.map(doc => formatApplication(doc, 'governmentScheme'));

    const allApplications = [...loanApplications, ...caApplications, ...govApplications];
    
    // We now filter out archived applications in the code, which is more reliable.
    const activeApplications = allApplications.filter(app => app.status.toLowerCase() !== 'archived');

    // Sort all applications by date, descending
    activeApplications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log(`[DashboardActions] Successfully fetched and merged ${activeApplications.length} active applications.`);
    return activeApplications;

  } catch (error: any) {
    console.error('[DashboardActions] Error fetching user applications from Firestore:', error.message, error.stack);
    // In case of error, return an empty array to prevent the page from crashing.
    return [];
  }
}
