'use client';

import type { ReactNode } from "react";

interface MainWrapperProps {
    children: ReactNode;
    initialExpanded: boolean;
}

export default function MainWrapper({ children, initialExpanded }: MainWrapperProps) {
    return (
        <main className={`w-full min-w-[320px] flex-1 h-screen overflow-y-auto ${!initialExpanded && 'sm:max-w-[600px] sm:flex-none'}`}>
            {children}
        </main>
    );
} 