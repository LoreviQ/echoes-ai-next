"use client";

import { useEffect, useState } from "react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import type { SessionStatus } from "@/types/session";

interface LayoutContentProps {
    children: React.ReactNode;
    sessionStatus: SessionStatus;
}

export default function LayoutContent({ children, sessionStatus }: LayoutContentProps) {
    const [windowWidth, setWindowWidth] = useState(
        // Default to a desktop width - will be updated immediately on client
        typeof window !== "undefined" ? window.innerWidth : 1280
    );

    // Update window width on resize
    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Determine visibility and collapse state based on window width
    const showLeftSidebar = windowWidth >= 768;
    const showRightSidebar = windowWidth >= 1024;
    const leftSidebarCollapsed = windowWidth < 1280 && windowWidth >= 768;
    const rightSidebarCollapsed = windowWidth < 1280 && windowWidth >= 1024;

    return (
        <div className="flex justify-center bg-black text-white min-h-screen">
            {showLeftSidebar && (
                <LeftSidebar
                    collapsed={leftSidebarCollapsed}
                    sessionStatus={sessionStatus}
                />
            )}
            <main className="max-w-[600px] w-full h-screen overflow-y-auto">
                {children}
            </main>
            {showRightSidebar && (
                <RightSidebar
                    collapsed={rightSidebarCollapsed}
                />
            )}
        </div>
    );
}