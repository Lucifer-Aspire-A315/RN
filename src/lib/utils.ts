
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
    if (data.serviceCategory === 'governmentScheme' && data.schemeNameForDisplay) {
        applicationTypeDisplay = data.schemeNameForDisplay;
    }
    
    // With standardized schemas, we can now reliably get applicant details.
    const applicantInfo = data.applicantDetails;
    const submittedByInfo = data.submittedBy;


    return {
        id: doc.id,
        applicantDetails: {
            userId: applicantInfo?.userId || null,
            fullName: applicantInfo?.fullName || 'N/A',
            email: applicantInfo?.email || 'N/A',
        },
         submittedBy: {
            userId: submittedByInfo?.userId || 'N/A',
            userName: submittedByInfo?.userName || 'N/A',
            userEmail: submittedByInfo?.userEmail || 'N/A',
        },
        serviceCategory: data.serviceCategory || defaultCategory,
        applicationType: applicationTypeDisplay,
        createdAt: createdAtTimestamp?.toDate().toISOString() || new Date().toISOString(),
        status: data.status || 'Unknown',
        formData: data.formData, // Pass along full form data
    };
}
