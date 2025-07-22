
'use server';

import { cookies } from 'next/headers';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, type DocumentData, doc, updateDoc, getDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import type { UserData } from '@/lib/types';
import type { PartnerSignUpFormData, PartnerLoginFormData, UserSignUpFormData, UserLoginFormData } from '@/lib/schemas';
import { randomUUID } from 'crypto';
import { sendEmail } from '@/lib/email';
import { ResetPasswordEmail } from '@/components/emails/ResetPasswordEmail';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';
import { PartnerWelcomeEmail } from '@/components/emails/PartnerWelcomeEmail';
import { AdminNewPartnerNotificationEmail } from '@/components/emails/AdminNewPartnerNotificationEmail';
import { PartnerNewClientNotificationEmail } from '@/components/emails/PartnerNewClientNotificationEmail';


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
const PASSWORD_RESET_EXPIRATION = 60 * 60 * 1000; // 1 hour in milliseconds

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
        const dataToSubmit = { ...data };
        
        let emailToSearch: string;
        let fullName: string;
        let mobileNumber: string;
        let partnerId: string | null = (data as UserSignUpFormData).partnerId || null;

        if (collectionName === 'partners') {
            const partnerData = data as PartnerSignUpFormData;
            if (partnerData.businessModel === 'referral') {
                emailToSearch = partnerData.email;
                fullName = partnerData.fullName;
                mobileNumber = partnerData.mobileNumber;
            } else {
                emailToSearch = partnerData.personalDetails.email;
                fullName = partnerData.personalDetails.fullName;
                mobileNumber = partnerData.personalDetails.mobileNumber;
            }
        } else {
            const userData = data as UserSignUpFormData;
            emailToSearch = userData.email;
            fullName = userData.fullName;
            mobileNumber = userData.mobileNumber;
        }

        const existingUser = await _findUserByEmail(emailToSearch, collectionName);
        if (existingUser) {
            return { success: false, message: 'This email address is already registered.' };
        }

        const hashedPassword = await bcrypt.hash(dataToSubmit.password, SALT_ROUNDS);
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...finalData } = dataToSubmit;

        const userToSave: Record<string, any> = {
            ...finalData,
            password: hashedPassword,
            createdAt: Timestamp.fromDate(new Date()),
            type: collectionName === 'partners' ? 'partner' : 'normal',
        };

        if (collectionName === 'partners') {
            userToSave.isApproved = false; // Partners require approval
            userToSave.fullName = fullName;
            userToSave.email = emailToSearch;
            userToSave.mobileNumber = mobileNumber;
        } else {
            userToSave.isAdmin = false;
            // NEW LOGIC: Assign to House Account if no partnerId is provided
            if (!partnerId) {
                partnerId = process.env.HOUSE_ACCOUNT_PARTNER_ID || null;
                if(partnerId) {
                    console.log(`[AuthActions] No partner selected. Assigning new user ${emailToSearch} to House Account.`);
                } else {
                     console.warn(`[AuthActions] HOUSE_ACCOUNT_PARTNER_ID is not set. New user ${emailToSearch} is unassigned.`);
                }
            }
            userToSave.partnerId = partnerId;
        }
        
        const docRef = await addDoc(collection(db, collectionName), userToSave);
        
        const newUser: UserData = {
            id: docRef.id,
            fullName: fullName,
            email: emailToSearch,
            type: userToSave.type,
            isAdmin: userToSave.isAdmin,
            businessModel: (data as PartnerSignUpFormData).businessModel,
            partnerId: userToSave.partnerId,
        };
        
        // Notify partner if a user was explicitly linked to them (not house account)
        if (collectionName === 'users' && partnerId && partnerId !== process.env.HOUSE_ACCOUNT_PARTNER_ID) {
            console.log(`[AuthActions] User ${docRef.id} linked to partner ${partnerId}. Notifying partner.`);
            
            const partnerRef = doc(db, 'partners', partnerId);
            const partnerSnap = await getDoc(partnerRef);
            if(partnerSnap.exists()) {
                const partnerData = partnerSnap.data();
                await sendEmail({
                    to: partnerData.email,
                    subject: 'A New Client Has Joined You on RN FinTech!',
                    react: PartnerNewClientNotificationEmail({
                        partnerName: partnerData.fullName,
                        clientName: newUser.fullName,
                        clientEmail: newUser.email,
                    }),
                });
            } else {
                 console.warn(`[AuthActions] Could not find partner ${partnerId} to send new client notification.`);
            }
        }
        
        if (collectionName === 'users') {
             await setSessionCookies(newUser);
             await sendEmail({
                to: newUser.email,
                subject: 'Welcome to RN FinTech!',
                react: WelcomeEmail({ name: newUser.fullName }),
             });
             return { success: true, message: 'Sign-up successful! Welcome to RN FinTech.', user: newUser };
        } else {
            await sendEmail({
                to: newUser.email,
                subject: 'RN FinTech Partner Application Received',
                react: PartnerWelcomeEmail({ name: newUser.fullName }),
            });
            
            const adminEmail = process.env.ADMIN_EMAIL_ADDRESS;
            if(adminEmail) {
                 await sendEmail({
                    to: adminEmail,
                    subject: '[Action Required] New Partner Registration',
                    react: AdminNewPartnerNotificationEmail({
                        partnerName: newUser.fullName,
                        partnerEmail: newUser.email,
                        businessModel: newUser.businessModel || 'N/A',
                    }),
                });
            }
            
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
            fullName: userData.fullName, // Now standardized at the top level
            email: userData.email,
            type: collectionName === 'partners' ? 'partner' : 'normal',
            isAdmin: !!userData.isAdmin,
            businessModel: userData.businessModel,
            partnerId: userData.partnerId,
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
  const email = data.businessModel === 'referral' ? data.email : data.personalDetails.email;
  console.log('[AuthActions - partnerSignUpAction] Initiated for email:', email);
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
      const userRef = doc(db, userType === 'partner' ? 'partners' : 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        return {
            id: userId,
            fullName: userName,
            email: userEmail,
            type: userType as 'partner' | 'normal',
            isAdmin: isAdmin,
            businessModel: businessModel,
            partnerId: userData.partnerId || undefined,
        };
      }
    }
    return null;
  } catch (error: any) {
    console.error('[AuthActions - checkSessionAction] Error checking session:', error.message);
    return null;
  }
}

export async function sendPasswordResetLinkAction(email: string): Promise<{ success: boolean, message: string }> {
  console.log(`[AuthActions] Password reset requested for: ${email}`);
  try {
    // Determine if the user is a 'user' or a 'partner'
    let userDoc: DocumentData | null = null;
    let collectionName: 'users' | 'partners' | null = null;

    userDoc = await _findUserByEmail(email, 'users');
    if (userDoc) {
      collectionName = 'users';
    } else {
      userDoc = await _findUserByEmail(email, 'partners');
      if (userDoc) {
        collectionName = 'partners';
      }
    }

    if (!userDoc || !collectionName) {
      // Security: Do not reveal if an email exists or not.
      return { success: true, message: "If an account with this email exists, a password reset link has been sent." };
    }
    
    const userData = userDoc.data();
    const token = randomUUID();
    const expires = new Date(Date.now() + PASSWORD_RESET_EXPIRATION);

    await updateDoc(doc(db, collectionName, userDoc.id), {
        passwordResetToken: token,
        passwordResetTokenExpires: Timestamp.fromDate(expires),
    });

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

    const emailResult = await sendEmail({
        to: userData.email,
        subject: 'Reset Your RN FinTech Password',
        react: ResetPasswordEmail({ name: userData.fullName, resetLink }),
    });

    if (emailResult.success) {
        return { success: true, message: "If an account with this email exists, a password reset link has been sent." };
    } else {
        console.error(`[AuthActions] Failed to send password reset email for ${email}:`, emailResult.message);
        return { success: false, message: "Could not send the password reset email. Please try again later." };
    }

  } catch (error: any) {
    console.error("[AuthActions] Error in sendPasswordResetLinkAction: ", error);
    // Security: Do not reveal internal errors.
    return { success: false, message: "An unexpected server error occurred." };
  }
}


export async function resetPasswordAction(token: string, newPassword: string):Promise<{ success: boolean; message: string }> {
    console.log(`[AuthActions] Attempting to reset password with token: ${token.substring(0, 10)}...`);

    if (!token) {
        return { success: false, message: "Invalid or missing token." };
    }
    
    try {
        let userDoc: DocumentData | null = null;
        let collectionName: 'users' | 'partners' | null = null;
        
        const userQuery = query(collection(db, 'users'), where('passwordResetToken', '==', token));
        const userSnapshot = await getDocs(userQuery);
        
        if (!userSnapshot.empty) {
            userDoc = userSnapshot.docs[0];
            collectionName = 'users';
        } else {
            const partnerQuery = query(collection(db, 'partners'), where('passwordResetToken', '==', token));
            const partnerSnapshot = await getDocs(partnerQuery);
            if(!partnerSnapshot.empty) {
                userDoc = partnerSnapshot.docs[0];
                collectionName = 'partners';
            }
        }

        if (!userDoc || !collectionName) {
            return { success: false, message: "Invalid or expired password reset token." };
        }

        const userData = userDoc.data();
        const expires = userData.passwordResetTokenExpires?.toDate();

        if (!expires || expires < new Date()) {
            return { success: false, message: "Password reset token has expired. Please request a new one." };
        }

        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        await updateDoc(doc(db, collectionName, userDoc.id), {
            password: hashedPassword,
            passwordResetToken: null, // Invalidate the token after use
            passwordResetTokenExpires: null,
        });

        console.log(`[AuthActions] Successfully reset password for user ID: ${userDoc.id}`);
        return { success: true, message: "Your password has been reset successfully. You can now log in." };

    } catch (error: any) {
        console.error("[AuthActions] Error in resetPasswordAction: ", error);
        return { success: false, message: "An unexpected server error occurred." };
    }
}


// #endregion
