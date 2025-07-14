
export interface UserData {
  id: string;
  fullName: string;
  email: string;
  type: 'partner' | 'normal';
  isAdmin?: boolean;
  businessModel?: 'referral' | 'dsa' | 'merchant';
  partnerId?: string; // ID of the partner this user is linked to
}

export interface UserApplication {
  id:string;
  applicantDetails?: {
    userId: string | null;
    fullName: string;
    email: string;
  };
  submittedBy?: {
    userId: string;
    userName: string;
    userEmail: string;
  };
  serviceCategory: 'loan' | 'caService' | 'governmentScheme' | 'Unknown';
  applicationType: string;
  createdAt: string; // ISO string date
  status: 'Submitted' | 'In Review' | 'Approved' | 'Rejected' | 'Archived' | string;
  // This will hold the entire form data, which now has a standardized structure
  formData: Record<string, any>; 
}

export interface PartnerData {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  createdAt: string; // ISO string date
  isApproved: boolean;
  businessModel?: 'referral' | 'dsa' | 'merchant';
}
