import { PostgrestError } from "@supabase/supabase-js";

import { Character } from "@/types";
import { createClient } from "@/utils/supabase.client";

export async function getCharacter(path: string): Promise<{ character: Character | null; error: PostgrestError | null }> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('path', path)
        .single();

    return { character: data, error };
}