'use client';

import { createContext, useContext, useState, useEffect } from 'react';

import type { SessionStatus, UserPreferencesSupabase } from '@/types';
import { createClient, setupAuthInterceptor, cleanupAuthInterceptor, database } from '@/utils';

const SessionContext = createContext<SessionStatus>({
    active: false,
    user: null,
    preferences: null,
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

    const fetchPreferences = async () => {
        if (!sessionStatus.user || !sessionStatus.user.id) {
            return;
        }

        const { preferences, error } = await database.getUserPreferences(sessionStatus.user.id);
        if (error) {
            console.error('Error fetching user preferences:', error);
        } else {
            setSessionStatus({
                ...sessionStatus,
                preferences: preferences ?? null,
            });
        }
    }

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {

            setSessionStatus({
                active: !!session,
                user: session?.user.user_metadata ?? null,
                preferences: null,
            });
        });

        return () => {
            subscription.unsubscribe();
            cleanupAuthInterceptor();
        };
    }, []);

    // get preferences when session changes
    useEffect(() => {
        fetchPreferences();
    }, [sessionStatus.active]);

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