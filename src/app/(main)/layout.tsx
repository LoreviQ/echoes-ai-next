import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Providers } from "./providers";
import { LeftSidebar, RightSidebar, MainWrapper } from "@/components/ui";
import { SidebarContentType } from "@/contexts";
import { UserPreferences, DEFAULT_PREFERENCES } from "@/types";
import { createServerClient } from '@/utils/supabase.server';
import { database } from '@/utils';

export default async function MainLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const initialSession = await getInitialSession();

    // Read preferences from the single user_preferences cookie
    const cookieStore = await cookies();
    const preferencesStr = cookieStore.get('user_preferences')?.value;
    const preferences: UserPreferences = preferencesStr
        ? JSON.parse(decodeURIComponent(preferencesStr))
        : { ...DEFAULT_PREFERENCES };

    return (
        <Providers
            initialSession={initialSession}
            initialContentType={preferences.sidebarContentType as SidebarContentType}
            initialCharacterId={preferences.currentCharacter}
        >
            <div className="flex w-full bg-black text-white min-h-screen">
                <LeftSidebar initialExpanded={preferences.leftSidebarExpanded} />
                <MainWrapper initialExpanded={preferences.leftSidebarExpanded}>
                    {children}
                </MainWrapper>
                <RightSidebar initialExpanded={preferences.rightSidebarExpanded} />
            </div>
            {/* UNCOMMENT THIS FOR REACT QUERY DEVTOOLS */}
            {/* process.env.NODE_ENV === "development" && <ReactQueryDevtools /> */}
        </Providers>
    );
}

async function getInitialSession() {
    const supabase = await createServerClient();
    const { user } = await database.getLoggedInUser(supabase);
    return {
        active: !!user,
        user: user?.user_metadata ?? null
    };
}