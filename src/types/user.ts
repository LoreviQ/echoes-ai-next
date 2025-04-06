import { User as SupabaseUser } from "@supabase/supabase-js";

export type NsfwFilter = 'show' | 'blur' | 'hide';

export type UserPreferencesSchema = {
    nsfw_filter: NsfwFilter;
}

export type User = SupabaseUser & {
    preferences: UserPreferencesSchema;
};
