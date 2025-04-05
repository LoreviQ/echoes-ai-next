import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils";
import { UserSubscriptions } from "@/types";

/**
 * Get all subscriptions for a user
 * @param userId - The ID of the user to get subscriptions for
 * @param client - The Supabase client to use
 * @returns A promise that resolves to an object containing the subscriptions and an error
 */
export async function getSubscriptions(
    userId: string,
    client?: SupabaseClient
): Promise<{ subscriptions: UserSubscriptions[]; error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { data, error } = await supabase
        .from('character_subscriptions')
        .select('character_id')
        .eq('user_id', userId);

    return {
        subscriptions: data || [],
        error
    };
}

/**
 * Subscribe to a character (insert a subscription into the database)
 * @param characterId - The ID of the character to subscribe to
 * @param userId - The ID of the user to subscribe to
 * @param client - The Supabase client to use
 * @returns A promise that resolves to the character ID
 */
export async function insertSubscription(
    characterId: string,
    userId: string,
    client?: SupabaseClient
): Promise<{ error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { error } = await supabase
        .from('character_subscriptions')
        .insert([{ character_id: characterId, user_id: userId }]);
    return { error }
}

/**
 * Unsubscribe from a character (delete a subscription from the database)
 * @param characterId - The ID of the character to unsubscribe from
 * @param userId - The ID of the user to unsubscribe from
 * @param client - The Supabase client to use
 * @returns A promise that resolves to the character ID
 */
export async function deleteSubscription(
    characterId: string,
    userId: string,
    client?: SupabaseClient
): Promise<{ error: PostgrestError | null }> {
    const supabase = client || createClient();
    const { error } = await supabase
        .from('character_subscriptions')
        .delete()
        .eq('character_id', characterId)
        .eq('user_id', userId);
    return { error }
}