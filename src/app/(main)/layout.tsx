import type { ReactNode } from "react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { getInitialSession } from "@/contexts/session.server";
import { Providers } from "./providers";

export default async function MainLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const initialSession = await getInitialSession();
    return (
        <Providers initialSession={initialSession}>
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
                    <div className="hidden lg:block">
                        <RightSidebar />
                    </div>
                </div>
            </div>
        </Providers>
    );
} 