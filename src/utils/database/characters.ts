import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import { Character } from "@/types";
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
    character: Character,
    client?: SupabaseClient
): Promise<{ error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { error } = await supabase
        .from('characters')
        .insert({
            user_id: character.user_id,
            name: character.name,
            path: character.path,
            bio: character.bio || null,
            description: character.description || null,
            public: character.public,
            nsfw: character.nsfw,
            avatar_url: character.avatar_url,
            banner_url: character.banner_url,
            tags: character.tags,
            gender: character.gender
        });

    return { error };
}
