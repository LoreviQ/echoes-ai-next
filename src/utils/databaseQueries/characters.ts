import { Character } from "@/types/character";
import { createClient } from "../supabase.client";
import { PostgrestError } from "@supabase/supabase-js";

export async function getCharacter(path: string): Promise<{ character: Character | null; error: PostgrestError | null }> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('path', path)
        .single();

    return { character: data, error };
}