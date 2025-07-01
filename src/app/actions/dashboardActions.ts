'use server';

import { cookies } from 'next/headers';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, type QueryConstraint } from 'firebase/firestore';
import type { UserApplication } from '@/lib/types';
import { formatApplication } from '@/lib/utils';


export async function getUserApplications(): Promise<UserApplication[]> {
  console.log('[DashboardActions] Fetching user applications...');
  const userId = cookies().get('user_id')?.value;
  const userType = cookies().get('user_type')?.value;

  if (!userId) {
    console.warn('[DashboardActions] No user ID found in cookies. Returning empty array.');
    return [];
  }
  
  console.log(`[DashboardActions] User ID: ${userId}, Type: ${userType}. Querying collections...`);

  try {
    const loanApplicationsRef = collection(db, 'loanApplications');
    const caServiceApplicationsRef = collection(db, 'caServiceApplications');
    const governmentSchemeApplicationsRef = collection(db, 'governmentSchemeApplications');

    // This single query works for both normal users and partners.
    // We will fetch all applications for the user and filter out 'Archived' ones in the code
    // to avoid potential Firestore indexing issues with inequality filters.
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

    // Map and filter applications in code
    const loanApplications = loanSnapshot.docs
      .map(doc => formatApplication(doc, 'loan'))
      .filter(app => app.status !== 'Archived');
      
    const caApplications = caSnapshot.docs
      .map(doc => formatApplication(doc, 'caService'))
      .filter(app => app.status !== 'Archived');

    const govApplications = govSnapshot.docs
      .map(doc => formatApplication(doc, 'governmentScheme'))
      .filter(app => app.status !== 'Archived');

    const allApplications = [...loanApplications, ...caApplications, ...govApplications];
    
    // Sort all applications by date, descending
    allApplications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log(`[DashboardActions] Successfully fetched and merged ${allApplications.length} non-archived applications.`);
    return allApplications;

  } catch (error: any) {
    console.error('[DashboardActions] Error fetching user applications from Firestore:', error.message, error.stack);
    // In case of error, return an empty array to prevent the page from crashing.
    return [];
  }
}
