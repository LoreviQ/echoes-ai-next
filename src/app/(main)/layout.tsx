import type { ReactNode } from "react";
import { cookies } from "next/headers";
import LeftSidebar from "@/components/ui/leftSidebar";
import RightSidebar from "@/components/ui/rightSidebar";
import MainWrapper from "@/components/ui/MainWrapper";
import { getInitialSession } from "@/contexts/session.server";
import { Providers } from "./providers";
import { SidebarContentType } from "@/contexts/rightSidebar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { UserPreferences, DEFAULT_PREFERENCES } from "@/types/preferences";

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