
'use server';

import { cookies } from 'next/headers';
import type { PartnerSignUpFormData, PartnerLoginFormData, UserSignUpFormData, UserLoginFormData } from '@/lib/schemas';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, type DocumentData } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import type { UserData } from '@/lib/types';

// #region --- TYPES AND CONSTANTS ---

interface AuthServerActionResponse {
  success: boolean;
  message?: string;
  user?: UserData;
  errors?: Record<string, string[]>;
}

interface CustomCookieSetOptions {
  domain?: string;
  path?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  priority?: 'low' | 'medium' | 'high';
}

const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds
const SALT_ROUNDS = 10;

// #endregion

// #region --- INTERNAL HELPER FUNCTIONS ---

async function setSessionCookies(userData: UserData) {
  const cookieOptions: CustomCookieSetOptions = {
    httpOnly: true,
    secure: true,
    maxAge: SESSION_DURATION,
    path: '/',
    sameSite: 'none' as const,
  };
  
  const sessionToken = `mock-secure-session-token-${userData.id}-${Date.now()}`;

  cookies().set('session_token', sessionToken, cookieOptions);
  cookies().set('user_id', userData.id, cookieOptions);
  cookies().set('user_name', userData.fullName, cookieOptions);
  cookies().set('user_email', userData.email, cookieOptions);
  cookies().set('user_type', userData.type, cookieOptions);
  
  if (userData.businessModel) {
    cookies().set('business_model', userData.businessModel, cookieOptions);
  }
  if (userData.isAdmin) {
    cookies().set('is_admin', 'true', cookieOptions);
  } else {
    cookies().set('is_admin', '', { ...cookieOptions, maxAge: 0, expires: new Date(0) });
  }
}

async function clearSessionCookies() {
  const cookieNames = ['session_token', 'user_id', 'user_name', 'user_email', 'user_type', 'is_admin', 'business_model'];
  const clearOptions: CustomCookieSetOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none' as const,
    path: '/',
    expires: new Date(0),
    maxAge: 0,
  };
  cookieNames.forEach(name => cookies().set(name, '', clearOptions));
}

async function _findUserByEmail(email: string, collectionName: 'partners' | 'users'): Promise<DocumentData | null> {
    const ref = collection(db, collectionName);
    const q = query(ref, where('email', '==', email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return null;
    }
    return snapshot.docs[0];
}

async function _signUpUser(data: UserSignUpFormData | PartnerSignUpFormData, collectionName: 'partners' | 'users'): Promise<AuthServerActionResponse> {
    try {
        const existingUser = await _findUserByEmail(data.email, collectionName);
        if (existingUser) {
            return { success: false, message: 'This email address is already registered.' };
        }

        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...dataToSubmit } = data;

        const userToSave: Record<string, any> = {
            ...dataToSubmit,
            password: hashedPassword,
            createdAt: Timestamp.fromDate(new Date()),
            type: collectionName === 'partners' ? 'partner' : 'normal',
        };

        if (collectionName === 'partners') {
            userToSave.isApproved = false; // Partners require approval
        } else {
            userToSave.isAdmin = false; // Normal users are never admins by default
        }
        
        const docRef = await addDoc(collection(db, collectionName), userToSave);

        const newUser: UserData = {
            id: docRef.id,
            fullName: data.fullName,
            email: data.email,
            type: userToSave.type,
            isAdmin: userToSave.isAdmin,
            businessModel: (data as PartnerSignUpFormData).businessModel,
        };
        
        if (collectionName === 'users') {
             await setSessionCookies(newUser);
             return { success: true, message: 'Sign-up successful! Welcome to RN FinTech.', user: newUser };
        } else {
            return { success: true, message: 'Partner application submitted! Your application is pending approval.', user: newUser };
        }
    } catch (error: any) {
        console.error(`[AuthActions - _signUpUser] Error for ${collectionName}:`, error.message, error.stack);
        return { success: false, message: 'An unexpected error occurred during sign-up.' };
    }
}

async function _loginUser(data: UserLoginFormData, collectionName: 'partners' | 'users'): Promise<AuthServerActionResponse> {
    try {
        const userDoc = await _findUserByEmail(data.email, collectionName);
        if (!userDoc) {
            return { success: false, message: 'Invalid email or password.' };
        }

        const userData = userDoc.data();
        const passwordIsValid = await bcrypt.compare(data.password, userData.password);

        if (!passwordIsValid) {
            return { success: false, message: 'Invalid email or password.' };
        }

        if (collectionName === 'partners' && !userData.isApproved) {
            return { success: false, message: 'Your partner account is pending approval. Please contact support.' };
        }
        
        const loggedInUser: UserData = {
            id: userDoc.id,
            fullName: userData.fullName,
            email: userData.email,
            type: collectionName === 'partners' ? 'partner' : 'normal',
            isAdmin: !!userData.isAdmin,
            businessModel: userData.businessModel,
        };
        
        await setSessionCookies(loggedInUser);

        return { success: true, message: 'Login successful!', user: loggedInUser };

    } catch (error: any) {
        console.error(`[AuthActions - _loginUser] Error for ${collectionName}:`, error.message, error.stack);
        return { success: false, message: 'An unexpected error occurred during login.' };
    }
}

// #endregion

// #region --- EXPORTED SERVER ACTIONS ---

export async function partnerSignUpAction(data: PartnerSignUpFormData): Promise<AuthServerActionResponse> {
  console.log('[AuthActions - partnerSignUpAction] Initiated for email:', data.email);
  return _signUpUser(data, 'partners');
}

export async function partnerLoginAction(data: PartnerLoginFormData): Promise<AuthServerActionResponse> {
  console.log('[AuthActions - partnerLoginAction] Initiated for email:', data.email);
  return _loginUser(data, 'partners');
}

export async function userSignUpAction(data: UserSignUpFormData): Promise<AuthServerActionResponse> {
  console.log('[AuthActions - userSignUpAction] Initiated for email:', data.email);
  return _signUpUser(data, 'users');
}

export async function userLoginAction(data: UserLoginFormData): Promise<AuthServerActionResponse> {
  console.log('[AuthActions - userLoginAction] Initiated for email:', data.email);
  return _loginUser(data, 'users');
}

export async function logoutAction(): Promise<AuthServerActionResponse> {
  console.log('[AuthActions - logoutAction] Initiated.');
  try {
    await clearSessionCookies();
    return { success: true, message: "Logged out successfully." };
  } catch (error: any) {
    console.error('[AuthActions - logoutAction] Error:', error.message, error.stack);
    return { success: false, message: 'Logout failed due to a server error.' };
  }
}

export async function checkSessionAction(): Promise<UserData | null> {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('user_id')?.value;
    const userName = cookieStore.get('user_name')?.value;
    const userEmail = cookieStore.get('user_email')?.value;
    const userType = (cookieStore.get('user_type')?.value === 'partner' || cookieStore.get('user_type')?.value === 'normal') ? cookieStore.get('user_type')?.value : undefined;
    const sessionToken = cookieStore.get('session_token')?.value;
    const isAdmin = cookieStore.get('is_admin')?.value === 'true';
    const businessModel = cookieStore.get('business_model')?.value as UserData['businessModel'] | undefined;

    if (userId && userName && userEmail && userType && sessionToken) {
      return {
        id: userId,
        fullName: userName,
        email: userEmail,
        type: userType,
        isAdmin: isAdmin,
        businessModel: businessModel,
      };
    }
    return null;
  } catch (error: any) {
    console.error('[AuthActions - checkSessionAction] Error checking session:', error.message);
    return null;
  }
}

// #endregion
