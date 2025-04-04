'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { type SessionStatus } from '@/types/session';
import { createClient } from '@/utils/supabase.client';
import { setupAuthInterceptor, cleanupAuthInterceptor } from '@/utils/api';

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
        setupAuthInterceptor(sessionStatus.active);
    }, [sessionStatus.active]);

    return (
        <SessionContext.Provider value={sessionStatus}>
            {children}
        </SessionContext.Provider>
    );
}