// All app level providers go here

'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from "@/contexts/session.client";
import { ImagePreviewProvider } from "@/contexts/imagePreview";
import { RightSidebarProvider, SidebarContentType } from "@/contexts/rightSidebar";
import { FeedProvider } from "@/contexts/FeedContext";
import { useState } from 'react'


interface Session {
    active: boolean;
    user: any | null;
}

interface ClientProvidersProps {
    children: React.ReactNode;
    initialSession: Session;
    initialContentType?: SidebarContentType;
    initialCharacterId?: string;
}

export function Providers({ children, initialSession, initialContentType, initialCharacterId }: ClientProvidersProps) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5, // 5 minutes
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider initialSession={initialSession}>
                <ImagePreviewProvider>
                    <RightSidebarProvider
                        initialContentType={initialContentType}
                        initialCharacterId={initialCharacterId}
                    >
                        <FeedProvider>
                            {children}
                        </FeedProvider>
                    </RightSidebarProvider>
                </ImagePreviewProvider>
            </SessionProvider>
        </QueryClientProvider>
    )
} 