
'use server';

import { cookies } from 'next/headers';
import { adminStorage } from '@/lib/firebaseAdmin';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';

interface FileUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadFileAction(formData: FormData): Promise<FileUploadResponse> {
  console.log("[FileUploadAction - Stream] Action initiated.");

  if (!adminStorage) {
    const adminInitError = "SERVER CONFIGURATION ERROR: Firebase Admin Storage not initialized. This means the Firebase Admin SDK failed to initialize when the server started. PLEASE CHECK YOUR SERVER LOGS (terminal output from `npm run dev`) for detailed error messages from 'src/lib/firebaseAdmin.ts'. Common causes: incorrect GOOGLE_APPLICATION_CREDENTIALS path, invalid service account key, or missing NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET environment variable. The file cannot be uploaded.";
    console.error("[FileUploadAction - Stream] CRITICAL ERROR:", adminInitError);
    return { success: false, error: adminInitError };
  }
  
  const file = formData.get('file') as File | null;
  const fileName = formData.get('fileName') as string | null;

  if (!file || !fileName) {
    console.error("[FileUploadAction - Stream] Critical error: No file or filename provided in FormData.");
    return { success: false, error: 'No file or filename provided.' };
  }
  
  const cookieStore = cookies();
  const userIdCookie = await cookieStore.get('user_id');
  const userId = userIdCookie?.value;
  
  let uploadPath: string;
  const uniqueFileName = `${Date.now()}-${encodeURIComponent(fileName)}`;

  if (userId) {
    console.log(`[FileUploadAction - Stream] User ${userId} attempting to upload file: ${fileName} (Size: ${file.size} bytes, Type: ${file.type})`);
    uploadPath = `uploads/${userId}/${uniqueFileName}`;
  } else {
    const tempId = randomUUID();
    uploadPath = `uploads/pending-partners/${tempId}/${uniqueFileName}`;
    console.log(`[FileUploadAction - Stream] No user session found. Uploading to temporary path: ${uploadPath}`);
  }

  try {
    const bucket = adminStorage.bucket(); 
    const fileUploadRef = bucket.file(uploadPath);

    console.log(`[FileUploadAction - Stream] Starting stream upload to Firebase Storage path: ${uploadPath}`);
    
    // Convert the web stream to a Node.js Readable stream
    const nodeStream = Readable.fromWeb(file.stream() as any);

    // Create a promise that resolves when the stream finishes or rejects on error
    await new Promise((resolve, reject) => {
        const writeStream = fileUploadRef.createWriteStream({
            metadata: {
                contentType: file.type,
            },
        });

        writeStream.on('finish', () => {
            console.log(`[FileUploadAction - Stream] Write stream finished for ${uploadPath}.`);
            resolve(true);
        });

        writeStream.on('error', (err) => {
            console.error(`[FileUploadAction - Stream] Write stream error for ${uploadPath}:`, err);
            reject(new Error(`Failed to stream file to storage: ${err.message}`));
        });
        
        nodeStream.pipe(writeStream);
    });

    console.log(`[FileUploadAction - Stream] File uploaded successfully via stream to path: ${uploadPath}.`);

    const [downloadUrl] = await fileUploadRef.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    console.log(`[FileUploadAction - Stream] Generated signed URL for ${uploadPath}: ${downloadUrl.substring(0, 100)}...`);

    return {
      success: true,
      url: downloadUrl,
    };

  } catch (error: any) {
    console.error(`[FileUploadAction - Stream] Firebase Admin SDK Storage stream upload error for file ${fileName}:`);
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Code:", error.code);
    console.error("Error Stack:", error.stack);

    let userFriendlyMessage = 'Failed to upload file using a stream due to a server error.';
    
    if (error.message) {
        userFriendlyMessage = error.message;
    }
    
    if (error.message && error.message.includes('Could not load the default credentials')) {
        userFriendlyMessage += ' This strongly indicates an issue with Firebase Admin SDK initialization - service account credentials (GOOGLE_APPLICATION_CREDENTIALS) might be missing, path incorrect, or file invalid. Check server logs!';
    }
    
     if (error.message && error.message.includes('Forbidden') || (error.code && error.code === 403)) {
        userFriendlyMessage += ' "Forbidden" or "Permission denied" from Admin SDK usually points to IAM permission issues for the service account on Google Cloud. Ensure it has "Storage Object Admin" role or equivalent for the target bucket.';
    }

    return { success: false, error: userFriendlyMessage };
  }
}
