import { QueryClient } from "@tanstack/react-query";

import { createClient } from "@/utils";

export function logout() {
    const supabase = createClient();
    const queryClient = new QueryClient();

    // Sign out from Supabase
    supabase.auth.signOut();

    // Clear React Query cache
    queryClient.clear();

    // Clear cookies
    document.cookie.split(';').forEach((cookie) => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
    });

    // Refresh the page to update UI
    window.location.reload();
} 