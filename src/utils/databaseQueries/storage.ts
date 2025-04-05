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

