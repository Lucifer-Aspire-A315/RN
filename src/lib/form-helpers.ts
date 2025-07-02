
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
 * Recursively traverses a data object, finds all `File` instances,
 * uploads them via a server action, and replaces the `File` object
 * with the returned public URL.
 * 
 * @param data The data object to process (e.g., the form data).
 * @returns A promise that resolves to a new object with Files replaced by URLs.
 * @throws An error if any file upload fails, which should be caught by the calling form.
 */
export async function processNestedFileUploads(data: any): Promise<any> {
    if (!data || typeof data !== 'object') {
        return data;
    }

    const processedData = Array.isArray(data) ? [...data] : { ...data };

    for (const key in processedData) {
        if (Object.prototype.hasOwnProperty.call(processedData, key)) {
            const value = processedData[key];

            if (value instanceof File) {
                try {
                    const dataUri = await fileToDataUri(value);
                    const uploadResponse = await uploadFileAsStringAction(dataUri, value.name);
                    if (!uploadResponse.success || !uploadResponse.publicUrl) {
                        throw new Error(uploadResponse.error || `Server failed to upload ${value.name}.`);
                    }
                    processedData[key] = uploadResponse.publicUrl;
                } catch (error: any) {
                    console.error(`Upload process failed for field "${key}":`, error);
                    // Re-throw to be caught by the form's submit handler
                    throw new Error(`Upload Failed for ${value.name}: ${error.message}`);
                }
            } else if (typeof value === 'object' && value !== null) {
                processedData[key] = await processNestedFileUploads(value);
            }
        }
    }

    return processedData;
}
