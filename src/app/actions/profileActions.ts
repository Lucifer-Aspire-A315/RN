
'use server';

import { doc, getDoc, type Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { checkSessionAction } from './authActions';
import type { PartnerSignUpFormData, UserSignUpFormData } from '@/lib/schemas';

// This will be a union of all possible user data structures from sign up
export type UserProfileData = (Omit<UserSignUpFormData, 'password'|'confirmPassword'> | Omit<PartnerSignUpFormData, 'password'|'confirmPassword'>) & {
    id: string;
    type: 'partner' | 'normal';
    isAdmin?: boolean;
    createdAt: string;
    // Add optional top-level fields that the action will populate
    fullName?: string;
    email?: string;
    mobileNumber?: string;
};

export async function getUserProfileDetails(): Promise<UserProfileData | null> {
    const sessionUser = await checkSessionAction();
    if (!sessionUser) {
        return null;
    }

    const { id, type } = sessionUser;
    const collectionName = type === 'partner' ? 'partners' : 'users';

    try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.warn(`[ProfileActions] User document not found for ID: ${id} in collection: ${collectionName}`);
            return null;
        }

        const data = docSnap.data();
        
        // Remove sensitive information like password before returning
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...profileData } = data;
        
        const createdAtTimestamp = data.createdAt as Timestamp;

        const result: UserProfileData = {
            id: docSnap.id,
            ...profileData,
            createdAt: createdAtTimestamp?.toDate().toISOString() || new Date().toISOString(),
        } as UserProfileData;
        
        // Standardize top-level fields for display consistency
        if (type === 'partner') {
             const partnerData = result as PartnerSignUpFormData;
             result.fullName = partnerData.fullName || partnerData.personalDetails?.fullName;
             result.mobileNumber = partnerData.mobileNumber || partnerData.personalDetails?.mobileNumber;
             result.email = partnerData.email || partnerData.personalDetails?.email;
        }

        return result;

    } catch (error: any) {
        console.error(`[ProfileActions] Error fetching profile details for user ${id}:`, error.message);
        return null;
    }
}
