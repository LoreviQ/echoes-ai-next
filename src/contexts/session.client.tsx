'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { type SessionStatus } from '@/types/session';
import { createClient } from '@/utils/supabase.client';

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
                user: session?.user ?? null,
            });
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <SessionContext.Provider value={sessionStatus}>
            {children}
        </SessionContext.Provider>
    );
}