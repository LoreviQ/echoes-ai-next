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
            <div className="flex justify-center bg-black text-white min-h-screen">
                <div className="hidden md:block">
                    <LeftSidebar />
                </div>

                <main className="max-w-[600px] w-full h-screen overflow-y-auto">
                    {children}
                </main>
                <div className="hidden lg:block">
                    <RightSidebar />
                </div>
            </div>
        </Providers>
    );
} 