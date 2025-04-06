import type { UserMetadata } from "@supabase/supabase-js";
import type { UserPreferencesSupabase } from "@/types";

export interface SessionStatus {
    active: boolean;
    user: UserMetadata | null;
    preferences: UserPreferencesSupabase | null;
}