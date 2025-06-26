
import { getSignedUploadUrlAction } from '@/app/actions/fileUploadActions';
import type { useToast } from "@/hooks/use-toast";

type ToastFn = ReturnType<typeof useToast>['toast'];

/**
 * Processes and uploads a dictionary of files directly from the client to cloud storage.
 * 1. Gets a secure, one-time upload URL from the server for each file.
 * 2. Uses the browser's `fetch` API to upload the file directly to that URL.
 * 3. Returns a map of field keys to their permanent, accessible public URLs.
 * This method avoids passing large files through the Next.js server, preventing timeout/size limit errors.
 * 
 * @param documentUploadsData A record where keys are field names and values are File objects or other data.
 * @param toast A function to display toast notifications for progress and errors.
 * @returns A promise that resolves to a record of field keys to their uploaded URLs.
 * @throws An error if any file upload fails, which should be caught by the calling form.
 */
export async function processFileUploads(
  documentUploadsData: Record<string, any>,
  toast: ToastFn
): Promise<Record<string, string>> {
  
  const uploadedFileUrls: Record<string, string> = {};

  const filesToUpload = Object.entries(documentUploadsData)
    .filter(([, value]) => value instanceof File);
  
  if (filesToUpload.length === 0) {
    return {};
  }

  for (const [key, file] of filesToUpload) {
    if (file instanceof File) {
        try {
            toast({ title: `Preparing to upload ${file.name}...` });

            // 1. Get the signed URL from our server action
            const signedUrlResponse = await getSignedUploadUrlAction(file.name, file.type);
            if (!signedUrlResponse.success || !signedUrlResponse.uploadUrl || !signedUrlResponse.publicUrl) {
                throw new Error(signedUrlResponse.error || `Could not get an upload URL for ${file.name}.`);
            }

            toast({ title: `Uploading ${file.name}...`, description: "Please keep this window open." });

            // 2. Upload the file directly to Google Cloud Storage from the browser
            const uploadResponse = await fetch(signedUrlResponse.uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                console.error('Direct upload failed response:', errorText);
                throw new Error(`Upload failed for ${file.name}. Server responded with: ${uploadResponse.statusText}`);
            }

            // 3. Store the permanent public URL for saving to the database
            uploadedFileUrls[key] = signedUrlResponse.publicUrl;
            toast({ title: `Successfully uploaded ${file.name}!` });

        } catch (error: any) {
            console.error(`Upload process failed for field "${key}":`, error);
            toast({ variant: 'destructive', title: `Upload Failed for ${file.name}`, description: error.message, duration: 9000 });
            // Stop the entire form submission if one file fails by re-throwing the error
            throw error;
        }
    }
  }
  
  return uploadedFileUrls;
}
