// All app level providers go here

'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    SessionProvider,
    ImagePreviewProvider,
    RightSidebarProvider,
    FeedProvider,
    SidebarContentType
} from "@/contexts";
import { useState } from 'react'
import { UserPreferencesSupabase } from '@/types';


interface Session {
    active: boolean;
    user: any | null;
    preferences: UserPreferencesSupabase | null;
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