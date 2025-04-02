import type { ReactNode } from "react";
import { cookies } from "next/headers";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { getInitialSession } from "@/contexts/session.server";
import { Providers } from "./providers";
import { SidebarContentType } from "@/contexts/RightSidebarContext";

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

    const contentTypeCookie = cookieStore.get('sidebar_content_type');
    const initialContentType = contentTypeCookie?.value as SidebarContentType || SidebarContentType.THOUGHTS;

    return (
        <Providers
            initialSession={initialSession}
            initialContentType={initialContentType}
        >
            <div className="flex w-full bg-black text-white min-h-screen">
                <div className="flex flex-1 justify-end">
                    <div className="hidden md:block">
                        <LeftSidebar />
                    </div>
                </div>

                <main className="w-[600px] flex-none h-screen overflow-y-auto">
                    {children}
                </main>

                <div className="flex flex-1 justify-start">
                    <div className="hidden lg:block w-full">
                        <RightSidebar initialExpanded={isRightSidebarExpanded} />
                    </div>
                </div>
            </div>
        </Providers>
    );
} 