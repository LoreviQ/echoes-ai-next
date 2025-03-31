import { createClient } from '@/utils/supabase.client';

/**
 * Uploads an image file to Supabase storage and returns the public URL
 * @param file The file to upload
 * @param bucketName The Supabase storage bucket name
 * @returns The public URL of the uploaded file, or null if upload failed
 */
export async function uploadImage(file: File, bucketName: string): Promise<string | null> {
    try {
        const supabase = createClient();

        // Generate a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const filePath = `${fileName}.${fileExt}`;

        // Upload file to storage
        const { error: uploadError } = await supabase
            .storage
            .from(bucketName)
            .upload(filePath, file, {
                upsert: true
            });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from(bucketName)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
} 