
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { UserApplication } from "./types";
import type { DocumentData, Timestamp } from 'firebase/firestore';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCollectionName(serviceCategory: UserApplication['serviceCategory']): string | null {
  switch (serviceCategory) {
    case 'loan': return 'loanApplications';
    case 'caService': return 'caServiceApplications';
    case 'governmentScheme': return 'governmentSchemeApplications';
    default: return null;
  }
}


export function formatApplication(doc: DocumentData, defaultCategory: UserApplication['serviceCategory']): UserApplication {
    const data = doc.data();
    const createdAtTimestamp = data.createdAt as Timestamp;

    // Determine the application type for display
    let applicationTypeDisplay = data.applicationType;
    if (defaultCategory === 'governmentScheme' && data.schemeNameForDisplay) {
        applicationTypeDisplay = data.schemeNameForDisplay;
    }
    
    // Prioritize client details from applicantDetails, fallback to submitter info for display.
    // This ensures the client's name is shown on the partner dashboard.
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
