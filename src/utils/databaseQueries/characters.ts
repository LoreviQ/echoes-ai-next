import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import { Character } from "@/types";
import { createClient } from "@/utils";

export async function getCharacter(
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