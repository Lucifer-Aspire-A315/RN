
'use server';

import { cookies } from 'next/headers';
import { adminStorage } from '@/lib/firebaseAdmin';
import { randomUUID } from 'crypto';

interface SignedUrlResponse {
  success: boolean;
  uploadUrl?: string;
  publicUrl?: string;
  error?: string;
}

/**
 * Creates a signed URL that allows the client to directly upload a file to Firebase Storage.
 * This avoids passing the file through the Next.js server, bypassing body size limits.
 * @param fileName The original name of the file to be uploaded.
 * @param fileType The MIME type of the file.
 * @returns An object containing the upload URL and the final public URL for the file.
 */
export async function getSignedUploadUrlAction(fileName: string, fileType: string): Promise<SignedUrlResponse> {
  console.log(`[SignedUrlAction] Request received for ${fileName} (${fileType})`);

  if (!adminStorage) {
    const adminInitError = "SERVER CONFIGURATION ERROR: Firebase Admin Storage not initialized. This means the Firebase Admin SDK failed to initialize when the server started. PLEASE CHECK YOUR SERVER LOGS for detailed error messages from 'src/lib/firebaseAdmin.ts'.";
    console.error("[SignedUrlAction] CRITICAL ERROR:", adminInitError);
    return { success: false, error: adminInitError };
  }

  const cookieStore = cookies();
  const userId = cookieStore.get('user_id')?.value;
  
  let uploadPath: string;
  const uniqueFileName = `${Date.now()}-${encodeURIComponent(fileName)}`;

  if (userId) {
    console.log(`[SignedUrlAction] User ${userId} is generating URL for file: ${fileName}`);
    uploadPath = `uploads/${userId}/${uniqueFileName}`;
  } else {
    // This case might be for partner sign-ups before a user ID is created
    const tempId = randomUUID();
    uploadPath = `uploads/pending-partners/${tempId}/${uniqueFileName}`;
    console.log(`[SignedUrlAction] No user session found. Generating URL for temporary path: ${uploadPath}`);
  }

  try {
    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(uploadPath);

    console.log(`[SignedUrlAction] Generating v4 signed URL for writing to: ${uploadPath}`);
    
    // Generate a short-lived signed URL for writing (uploading)
    const [uploadUrl] = await fileRef.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: fileType,
    });

    // Generate a long-lived signed URL for reading (for storing in DB and accessing later)
    const [publicUrl] = await fileRef.getSignedUrl({
        action: 'read',
        expires: '03-09-2491', // A date far in the future
    });

    console.log(`[SignedUrlAction] Successfully generated URLs for ${fileName}.`);
    return { success: true, uploadUrl, publicUrl };

  } catch (error: any) {
    console.error(`[SignedUrlAction] Firebase Admin SDK Storage URL signing error for file ${fileName}:`, error);
    let userFriendlyMessage = 'Failed to generate a secure upload link due to a server error.';
    if (error.message?.includes('credential')) {
        userFriendlyMessage += ' This could be an issue with server credentials.';
    }
    return { success: false, error: userFriendlyMessage };
  }
}
