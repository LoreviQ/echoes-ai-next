import type { ReactNode } from "react";
import { cookies } from "next/headers";
import LeftSidebar from "@/components/ui/leftSidebar";
import RightSidebar from "@/components/ui/rightSidebar";
import MainWrapper from "@/components/ui/MainWrapper";
import { getInitialSession } from "@/contexts/session.server";
import { Providers } from "./providers";
import { SidebarContentType } from "@/contexts/rightSidebar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default async function MainLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const initialSession = await getInitialSession();

    // Read right sidebar preferences from cookies server-side
    const cookieStore = await cookies();
    const rightSidebarCookie = cookieStore.get('right_sidebar_expanded');
    const isRightSidebarExpanded = rightSidebarCookie?.value === 'true' || false;
    const leftSidebarCookie = cookieStore.get('left_sidebar_expanded');
    const isLeftSidebarExpanded = leftSidebarCookie?.value === 'true' || true;

    const contentTypeCookie = cookieStore.get('sidebar_content_type');
    const initialContentType = contentTypeCookie?.value as SidebarContentType || SidebarContentType.THOUGHTS;

    const currentCharacterCookie = cookieStore.get('current_character');
    const initialCharacterId = currentCharacterCookie?.value || '';

    return (
        <Providers
            initialSession={initialSession}
            initialContentType={initialContentType}
            initialCharacterId={initialCharacterId}
        >
            <div className="flex w-full bg-black text-white min-h-screen">
                <LeftSidebar initialExpanded={isLeftSidebarExpanded} />
                <MainWrapper initialExpanded={isLeftSidebarExpanded}>
                    {children}
                </MainWrapper>
                <RightSidebar initialExpanded={isRightSidebarExpanded} />
            </div>
            {/* UNCOMMENT THIS FOR REACT QUERY DEVTOOLS */}
            {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
        </Providers>
    );
}