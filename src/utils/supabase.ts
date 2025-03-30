
import { createClient } from "@supabase/supabase-js";


// Create a supabase client
export function getSupabaseClient() {
    const subabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
    return {
        supabase: subabase,
    }
}