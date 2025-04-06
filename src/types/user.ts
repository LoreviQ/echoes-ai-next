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

export type UserPersonasSchema = {
    id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    name: string | null;
    bio: string | null;
    appearance: string | null;
    description: string | null;
    gender: string | null;
    avatar_url?: string | null;
};

export type UserPersonas = Omit<UserPersonasSchema, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

