import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import { Post } from "@/types";
import { createClient } from "@/utils";

export async function getPost(
    id: string,
    client?: SupabaseClient
): Promise<{ post: Post | null; error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
    return { post: data, error };
}

export async function getPostsByCharacterId(
    id: string,
    client?: SupabaseClient
): Promise<{ posts: Post[]; error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('character_id', id)
        .order('created_at', { ascending: false });
    return { posts: data || [], error };
}