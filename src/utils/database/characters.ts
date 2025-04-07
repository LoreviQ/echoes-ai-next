import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import { Character, CreateCharacter, CharacterSchema, NsfwFilter, UpdateCharacter } from "@/types";
import { createClient } from "@/utils";

type CharacterWithSubscriptionCount = CharacterSchema & {
    character_subscription_counts?: {
        subscriber_count: number;
    }[] | null;
}

function transformCharacterData(data: CharacterWithSubscriptionCount | null): Character | null {
    if (!data) return null;

    return {
        ...data,
        subscriber_count: data.character_subscription_counts?.[0]?.subscriber_count ?? 0
    };
}

export async function getCharacter(
    id: string,
    client?: SupabaseClient
): Promise<{ character: Character | null; error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { data, error } = await supabase
        .from('characters')
        .select(`
            *,
            character_subscription_counts (
                subscriber_count
            )
        `)
        .eq('id', id)
        .single();
    return { character: transformCharacterData(data), error };
}

export async function getCharacterByPath(
    path: string,
    client?: SupabaseClient
): Promise<{ character: Character | null; error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { data, error } = await supabase
        .from('characters')
        .select(`
            *,
            character_subscription_counts (
                subscriber_count
            )
        `)
        .eq('path', path)
        .single();

    return { character: transformCharacterData(data), error };
}

export async function getCharacters(
    nsfwFilter: NsfwFilter = 'hide',
    client?: SupabaseClient
): Promise<{ characters: Character[]; error: PostgrestError | null }> {
    const supabase = client || createClient();
    const charactersQuery = supabase
        .from('characters')
        .select(`
            *,
            character_subscription_counts (
                subscriber_count
            )
        `)
        .eq('public', true)
    // if nsfwFilter is hide, hide nsfw characters
    if (nsfwFilter === 'hide') {
        charactersQuery.neq('nsfw', true);
    }

    const { data, error } = await charactersQuery.order('created_at', { ascending: false });;
    return {
        characters: (data || []).map(transformCharacterData) as Character[],
        error
    };
}

/**
 * Inserts a new character into the database (user_id is automatically logged in user due to supabase function triggers)
 * @param character - The character to insert
 * @param client - The Supabase client to use
 * @returns A promise that resolves to the error or null
 */
export async function insertCharacter(
    character: CreateCharacter,
    client?: SupabaseClient
): Promise<{ character_id: string | null; error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { data, error } = await supabase
        .from('characters')
        .insert(character)
        .select('id')
        .single();
    return { character_id: data?.id, error };
}

/**
 * Updates any fields of a character in the database
 * @param id - The ID of the character to update
 * @param updates - Partial object containing any character fields to update
 * @param client - Optional Supabase client
 */
export async function updateCharacter(
    id: string,
    updates: UpdateCharacter,
    client?: SupabaseClient
): Promise<{ error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { error } = await supabase
        .from('characters')
        .update(updates)
        .eq('id', id);
    return { error };
}