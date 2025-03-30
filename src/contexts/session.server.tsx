import { createClient } from '@/utils/supabase.server';

export async function getInitialSession() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return {
        active: !!session,
        user: session?.user
    };;
}