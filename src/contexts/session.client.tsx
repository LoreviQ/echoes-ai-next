'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { type SessionStatus } from '@/types/session';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const SessionContext = createContext<SessionStatus>({
    active: false,
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
    const supabase = createClientComponentClient();

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSessionStatus({
                active: !!session,
                user: session?.user,
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