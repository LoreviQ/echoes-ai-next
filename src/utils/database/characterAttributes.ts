import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils";
import { CharacterAttributes, CharacterAttributesSchema } from "@/types";

export async function insertCharacterAttributes(
    attributes: CharacterAttributesSchema,
    client?: SupabaseClient
): Promise<{ error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { error } = await supabase
        .from('character_attributes')
        .insert(attributes);
    return { error };
}

export async function updateCharacterAttributes(
    character_id: string,
    attributes: CharacterAttributes,
    client?: SupabaseClient
): Promise<{ error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { error } = await supabase
        .from('character_attributes')
        .update(attributes)
        .eq('character_id', character_id);
    return { error };
}

export async function getCharacterAttributes(
    character_id: string,
    client?: SupabaseClient
): Promise<{ attributes: CharacterAttributes | null; error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { data, error } = await supabase
        .from('character_attributes')
        .select('*')
        .eq('character_id', character_id)
        .single();

    // Remove character_id from the returned data to match CharacterAttributes type
    if (data) {
        const { character_id: _, ...attributes } = data;
        return { attributes, error };
    }

    return { attributes: null, error };
}
