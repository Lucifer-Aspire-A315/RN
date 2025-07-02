
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
        
        // Standardize fullName for display consistency
        if (type === 'partner' && (result as PartnerSignUpFormData).personalDetails?.fullName) {
             result.fullName = (result as PartnerSignUpFormData).personalDetails.fullName;
        }

        return result;

    } catch (error: any) {
        console.error(`[ProfileActions] Error fetching profile details for user ${id}:`, error.message);
        return null;
    }
}
