
'use server';

import { cookies } from 'next/headers';
import { adminStorage } from '@/lib/firebaseAdmin';
import { randomUUID } from 'crypto';

interface UploadResponse {
  success: boolean;
  publicUrl?: string;
  error?: string;
}

/**
 * Uploads a file, provided as a Base64 data URI string, to Firebase Storage.
 * This method is used to bypass client-side CORS issues with direct uploads.
 * The Next.js server acts as a proxy to stream the file to storage.
 * @param dataUri The file encoded as a data URI string (e.g., "data:image/png;base64,...").
 * @param fileName The original name of the file.
 * @returns An object containing the final public URL of the uploaded file.
 */
export async function uploadFileAsStringAction(dataUri: string, fileName: string): Promise<UploadResponse> {
  console.log(`[UploadAction] Request received for ${fileName}`);

  if (!adminStorage) {
    const adminInitError = "SERVER CONFIGURATION ERROR: Firebase Admin Storage not initialized. Please check server logs for 'src/lib/firebaseAdmin.ts' initialization errors.";
    console.error("[UploadAction] CRITICAL ERROR:", adminInitError);
    return { success: false, error: adminInitError };
  }

  const cookieStore = cookies();
  const userId = cookieStore.get('user_id')?.value;
  const uniqueFileName = `${Date.now()}-${randomUUID()}-${encodeURIComponent(fileName)}`;
  
  let uploadPath: string;
  if (userId) {
    uploadPath = `uploads/${userId}/${uniqueFileName}`;
  } else {
    const tempId = randomUUID();
    uploadPath = `uploads/pending-users/${tempId}/${uniqueFileName}`;
  }
  
  try {
    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(uploadPath);

    // Decode the data URI
    const matches = dataUri.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid data URI format.');
    }
    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    console.log(`[UploadAction] Uploading ${fileName} (${(buffer.length / 1024).toFixed(2)} KB) to ${uploadPath}`);

    // Upload the buffer to Firebase Storage
    await fileRef.save(buffer, {
      metadata: {
        contentType: contentType,
      },
    });

    // Generate a long-lived signed URL for reading
    const [publicUrl] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-09-2491', // A very distant future date
    });

    console.log(`[UploadAction] Successfully uploaded ${fileName}. Public URL created.`);
    return { success: true, publicUrl };

  } catch (error: any) {
    console.error(`[UploadAction] Firebase Admin SDK Storage upload error for ${fileName}:`, error);
    let userFriendlyMessage = 'Failed to upload file due to a server error.';
    if (error.message?.includes('credential')) {
        userFriendlyMessage += ' This could be an issue with server credentials.';
    }
    return { success: false, error: userFriendlyMessage };
  }
}


/**
 * Deletes files from Firebase Storage based on their public URLs.
 * This is an admin-only action.
 * @param urls An array of public URLs of the files to delete.
 * @returns An object indicating success or failure.
 */
export async function deleteFilesByUrlAction(urls: string[]): Promise<{ success: boolean; error?: string }> {
  console.log(`[DeleteFilesAction] Request received for ${urls.length} files.`);
  
  if (!adminStorage) {
    const adminInitError = "SERVER CONFIGURATION ERROR: Firebase Admin Storage not initialized.";
    console.error("[DeleteFilesAction] CRITICAL ERROR:", adminInitError);
    return { success: false, error: adminInitError };
  }

  const bucket = adminStorage.bucket();
  const deletionPromises: Promise<any>[] = [];

  for (const url of urls) {
    try {
      // Extract the file path from the URL. Example: /b/your-bucket.appspot.com/o/uploads%2F...
      const urlObject = new URL(url);
      // The pathname starts with a slash, which we need to remove.
      // It's also URL-encoded, so we decode it.
      const filePath = decodeURIComponent(urlObject.pathname).substring(1);
      
      // The SDK expects the path without the bucket prefix, e.g., 'uploads/...'
      const pathWithoutBucket = filePath.replace(`${bucket.name}/o/`, '');

      if (pathWithoutBucket) {
        console.log(`[DeleteFilesAction] Queuing deletion for: ${pathWithoutBucket}`);
        deletionPromises.push(bucket.file(pathWithoutBucket).delete());
      }
    } catch (error) {
      console.error(`[DeleteFilesAction] Skipping invalid or unparsable URL: ${url}`);
    }
  }

  if (deletionPromises.length === 0) {
    console.log('[DeleteFilesAction] No valid file paths found to delete.');
    return { success: true };
  }

  try {
    await Promise.all(deletionPromises);
    console.log(`[DeleteFilesAction] Successfully deleted ${deletionPromises.length} files.`);
    return { success: true };
  } catch (error: any) {
    console.error('[DeleteFilesAction] Error deleting one or more files from storage:', error);
    // Even if some fail, we don't want to block the whole process.
    // The calling function will decide how to handle partial failure.
    return { success: false, error: 'One or more files could not be deleted.' };
  }
}
