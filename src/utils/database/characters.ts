import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import { Character, CreateCharacter, CharacterSchema, CharacterBio } from "@/types";
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
    client?: SupabaseClient
): Promise<{ characters: Character[]; error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { data, error } = await supabase
        .from('characters')
        .select(`
            *,
            character_subscription_counts (
                subscriber_count
            )
        `)
        .eq('public', true)
        .order('created_at', { ascending: false });
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
): Promise<{ error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { error } = await supabase
        .from('characters')
        .insert(character);
    return { error };
}

export async function updateCharacterBio(
    id: string,
    characterBio: CharacterBio,
    client?: SupabaseClient
): Promise<{ error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { error } = await supabase
        .from('characters')
        .update(characterBio)
        .eq('id', id);

    return { error };
}
