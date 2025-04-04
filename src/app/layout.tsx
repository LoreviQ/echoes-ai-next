import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import localFont from "next/font/local";
import "./globals.css";

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
    const headersList = await headers();
    const rightSidebarExpanded = headersList.get('x-right-sidebar-expanded') || 'false';
    const leftSidebarExpanded = headersList.get('x-left-sidebar-expanded') || 'true';
    const sidebarContentType = headersList.get('x-sidebar-content-type') || 'thoughts';
    const currentCharacter = headersList.get('x-current-character') || '';

    return (
        <html lang="en">
            <head>
                <meta name="x-right-sidebar-expanded" content={rightSidebarExpanded} />
                <meta name="x-left-sidebar-expanded" content={leftSidebarExpanded} />
                <meta name="x-sidebar-content-type" content={sidebarContentType} />
                <meta name="x-current-character" content={currentCharacter} />
            </head>
            <body className={`${inter.className} ${cyberwayRiders.variable}`}>
                {children}
            </body>
        </html>
    );
}
