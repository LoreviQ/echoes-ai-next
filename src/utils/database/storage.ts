import { SupabaseClient } from "@supabase/supabase-js";
import { StorageError } from "@supabase/storage-js";

import { createClient } from "@/utils";


export async function upload(
    bucketName: string,
    filePath: string,
    file: File,
    client?: SupabaseClient
): Promise<{ publicUrl: string; error: StorageError | null }> {
    const supabase = client || createClient();
    // upload file to storage
    const { error } = await supabase
        .storage
        .from(bucketName)
        .upload(filePath, file, {
            upsert: true
        });

    // get public url
    const { data: { publicUrl } } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(filePath);

    return { publicUrl, error };
}

export async function uploadAuth(
    subPath: string,
    file: File,
    client?: SupabaseClient
): Promise<{ publicUrl: string; error: StorageError | null }> {
    const supabase = client || createClient();

    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    // Build the path: user_data/user_id/subPath
    const bucketName = "user-data";
    const filePath = `${user.id}/${subPath}`;

    // Upload file to storage
    const { error } = await supabase
        .storage
        .from(bucketName)
        .upload(filePath, file, {
            upsert: true
        });

    // Get public URL
    const { data: { publicUrl } } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(filePath);

    return { publicUrl, error };
}

