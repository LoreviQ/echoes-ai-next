import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import { Character, CreateCharacter } from "@/types";
import { createClient } from "@/utils";

export async function getCharacter(
    id: string,
    client?: SupabaseClient
): Promise<{ character: Character | null; error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .single();
    return { character: data, error };
}

export async function getCharacterByPath(
    path: string,
    client?: SupabaseClient
): Promise<{ character: Character | null; error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('path', path)
        .single();

    return { character: data, error };
}

export async function getCharacters(
    client?: SupabaseClient
): Promise<{ characters: Character[]; error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('public', true)
        .order('created_at', { ascending: false });
    return { characters: data || [], error };
}


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
