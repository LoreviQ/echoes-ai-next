'use client';

import { createContext, useContext, useState, useEffect } from 'react';

import { type SessionStatus } from '@/types';
import { createClient, setupAuthInterceptor, cleanupAuthInterceptor } from '@/utils';

const SessionContext = createContext<SessionStatus>({
    active: false,
    user: null,
});

export const useSession = () => useContext(SessionContext);

export function SessionProvider({
    children,
    initialSession
}: {
    children: React.ReactNode;
    initialSession: SessionStatus;
}) {
    const [sessionStatus, setSessionStatus] = useState<SessionStatus>(initialSession);
    const supabase = createClient();

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSessionStatus({
                active: !!session,
                user: session?.user.user_metadata ?? null,
            });
        });

        return () => {
            subscription.unsubscribe();
            cleanupAuthInterceptor();
        };
    }, []);

    // Setup interceptor whenever session status changes
    useEffect(() => {
        setupAuthInterceptor();
    }, [sessionStatus.active]);

    return (
        <SessionContext.Provider value={sessionStatus}>
            {children}
        </SessionContext.Provider>
    );
}