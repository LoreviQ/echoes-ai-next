import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import "./globals.css";
import { SessionProvider } from "@/contexts/session.client";
import { getInitialSession } from "@/contexts/session.server";

export const metadata: Metadata = {
    title: "EchoesAI",
    description: "EchoesAI",
};

// Fonts
const inter = Inter({ subsets: ["latin"] });
const cyberwayRiders = localFont({
    src: "../../public/fonts/CyberwayRiders-lg97d.ttf",
    variable: "--font-cyberway",
});


export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const initialSession = await getInitialSession();
    return (
        <html lang="en">
            <body className={`${inter.className} ${cyberwayRiders.variable}`} >
                <SessionProvider initialSession={initialSession}>
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
                </SessionProvider>
            </body>
        </html >
    );
}
