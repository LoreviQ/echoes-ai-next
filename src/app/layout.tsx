import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
    return (
        <html lang="en">
            <body className={`${inter.className} ${cyberwayRiders.variable}`}>
                {children}
            </body>
        </html>
    );
}
