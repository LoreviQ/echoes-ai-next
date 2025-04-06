import { AuthError, SupabaseClient, User as SupabaseUser } from "@supabase/supabase-js";
import { User, UserPreferencesSchema, UserPreferencesSupabase } from "@/types";
import { createClient } from "@/utils";

export async function getLoggedInUser(
    client?: SupabaseClient
): Promise<{ user: User | null; error: AuthError | null }> {
    const supabase = client || createClient();
    // Get the user
    const { data, error } = await supabase.auth.getUser() as { data: { user: SupabaseUser } | null, error: AuthError | null };
    if (error || !data) {
        return { user: null, error };
    }
    // Get the user preferences
    const { data: preferences, error: preferencesError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', data.user.id)
        .single() as { data: UserPreferencesSchema | null, error: AuthError | null };
    if (preferencesError) {
        return { user: null, error: preferencesError };
    }

    // Return the user with the preferences, omitting user_id from preferences
    const { user_id, ...preferencesWithoutId } = preferences || {};
    const user = {
        ...data.user,
        preferences: preferencesWithoutId as UserPreferencesSupabase
    } as User;
    return { user, error: null };
}

export async function updateUserPreferences(
    userId: string,
    preferences: UserPreferencesSupabase,
    client?: SupabaseClient
) {
    const supabase = client || createClient();

    const { error } = await supabase
        .from('user_preferences')
        .update(preferences)
        .eq('user_id', userId);

    return { error };
}