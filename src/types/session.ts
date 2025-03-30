import type { User } from "@supabase/supabase-js";

export interface SessionStatus {
    active: boolean;
    user?: User;
}