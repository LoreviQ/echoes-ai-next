import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import { Thread, CreateThread } from '@/types';
import { createClient } from '@/utils';

/**
 * Get all threads for a character
 * @param characterId - The ID of the character to get threads for
 * @param client - The Supabase client to use
 * @returns A promise that resolves to an object containing the threads and an error
 */
export async function getThreads(characterId: string, client?: SupabaseClient): Promise<{ threads: Thread[], error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { data, error } = await supabase
        .from('threads')
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: false });
    return { threads: data || [], error };
}

/**
 * Creates a thread for a character
 * @param thread - The thread data to create
 * @param client - The Supabase client to use
 * @returns A promise that resolves to the created thread and any error
 */
export async function insertThread(thread: CreateThread, client?: SupabaseClient): Promise<{ thread: Thread, error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { data, error } = await supabase
        .from('threads')
        .insert(thread)
        .select()
        .single();
    return { thread: data, error };
}