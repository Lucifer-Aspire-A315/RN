
import { uploadFileAsStringAction } from '@/app/actions/fileUploadActions';
import type { useToast } from "@/hooks/use-toast";

type ToastFn = ReturnType<typeof useToast>['toast'];

/**
 * Reads a File object from the browser and returns its content as a Base64 encoded data URI.
 * @param file The File object to read.
 * @returns A promise that resolves with the data URI string.
 */
function fileToDataUri(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}


/**
 * Processes and uploads a dictionary of files by sending them as Base64 strings to a server action.
 * 1. Converts each file to a Base64 data URI string on the client.
 * 2. Calls a server action to handle the upload to Firebase Storage.
 * 3. The server action decodes the string and saves the file.
 * This method avoids client-side CORS issues associated with direct-to-storage uploads.
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
            toast({ title: `Uploading ${file.name}...`, description: "Please keep this window open." });

            // 1. Convert the file to a Base64 data URI on the client
            const dataUri = await fileToDataUri(file);

            // 2. Send the data URI to the server action for upload
            const uploadResponse = await uploadFileAsStringAction(dataUri, file.name);

            if (!uploadResponse.success || !uploadResponse.publicUrl) {
                throw new Error(uploadResponse.error || `Server failed to upload ${file.name}.`);
            }
            
            // 3. Store the permanent public URL for saving to the database
            uploadedFileUrls[key] = uploadResponse.publicUrl;
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
