import { AuthError, SupabaseClient, User as SupabaseUser } from "@supabase/supabase-js";
import { User, UserPreferencesSchema, UserPreferencesSupabase, UserPersonas, UserPersonasSchema } from "@/types";
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

export async function getUserPersonas(
    client?: SupabaseClient
) {
    const supabase = client || createClient();

    const { data, error } = await supabase
        .from('user_personas')
        .select('*') as { data: UserPersonasSchema[] | null, error: AuthError | null };
    if (error || !data) {
        return { personas: null, error };
    }
    // Get the signed url for the avatars
    for (const persona of data) {
        const { data: signedUrl } = await supabase
            .storage
            .from('user-data')
            .createSignedUrl(`${persona.user_id}/persona_avatars/${persona.id}.jpg`, 60 * 60 * 24);
        persona.avatar_url = signedUrl?.signedUrl || null;
    }

    return {
        personas: data as UserPersonasSchema[] | null,
        error: null
    };
}

export async function updateUserPersona(
    personaId: string,
    persona: UserPersonas,
    client?: SupabaseClient
) {
    const supabase = client || createClient();
    const { error } = await supabase
        .from('user_personas')
        .update(persona)
        .eq('id', personaId);

    return { error };
}

export async function deleteUserPersona(
    personaId: string,
    client?: SupabaseClient
) {
    const supabase = client || createClient();

    const { error } = await supabase
        .from('user_personas')
        .delete()
        .eq('id', personaId);

    return { error };
}

export async function insertUserPersona(
    persona: UserPersonas,
    client?: SupabaseClient
) {
    const supabase = client || createClient();

    const { error } = await supabase
        .from('user_personas')
        .insert(persona)


    return { error };
}

export async function getUserPreferences(
    userId: string,
    client?: SupabaseClient
) {
    const supabase = client || createClient();

    const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single() as { data: UserPreferencesSchema | null, error: AuthError | null };

    if (error || !data) {
        return { preferences: null, error };
    }

    // Remove user_id from the preferences before returning
    const { user_id, ...preferencesWithoutId } = data;
    return {
        preferences: preferencesWithoutId as UserPreferencesSupabase,
        error: null
    };
}