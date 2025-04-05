import { database } from '.';

/**
 * Uploads an image file to Supabase storage and returns the public URL
 * @param file The file to upload
 * @param bucketName The Supabase storage bucket name
 * @returns The public URL of the uploaded file, or null if upload failed
 */
export async function uploadImage(file: File, bucketName: string): Promise<string | null> {
    try {
        // Generate a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const filePath = `${fileName}.${fileExt}`;

        // Upload file to storage
        const { publicUrl, error } = await database.upload(bucketName, filePath, file);
        if (error) throw error;
        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
} 