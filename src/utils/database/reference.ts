import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import { SupabaseCellReference } from "@/types";
import { createClient } from "@/utils";

export async function updateByReference(
    reference: SupabaseCellReference,
    updateData: any,
    client?: SupabaseClient
): Promise<{ error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { error } = await supabase
        .from(reference.tableName)
        .update({ [reference.columnName]: updateData })
        .eq('id', reference.id);
    return { error };
}