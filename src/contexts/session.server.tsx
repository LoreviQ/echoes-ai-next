import { createClient } from '@/utils/supabase.server';

export async function getInitialSession() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return {
        active: !!user,
        user: user?.user_metadata ?? null
    };
}