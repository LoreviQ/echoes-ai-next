import type { UserMetadata } from "@supabase/supabase-js";

export interface SessionStatus {
    active: boolean;
    user: UserMetadata | null;
}