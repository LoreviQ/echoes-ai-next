import { User as SupabaseUser } from "@supabase/supabase-js";

export type NsfwFilter = 'show' | 'blur' | 'hide';

export type UserPreferencesSchema = {
    user_id: string;
    nsfw_filter: NsfwFilter;
}

export type UserPreferencesSupabase = Omit<UserPreferencesSchema, 'user_id'>;

export type User = SupabaseUser & {
    preferences: UserPreferencesSupabase;
};
