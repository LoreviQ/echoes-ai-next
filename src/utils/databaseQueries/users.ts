import { AuthError, SupabaseClient, User } from "@supabase/supabase-js";

import { createClient } from "@/utils";

export async function getLoggedInUser(
    client?: SupabaseClient
): Promise<{ user: User | null; error: AuthError | null }> {
    const supabase = client || createClient();
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error }
}