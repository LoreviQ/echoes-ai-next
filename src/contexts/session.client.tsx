'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

import type { SessionStatus, UserPreferencesSupabase } from 'echoes-shared/types';
import { createClient, setupAuthInterceptor, cleanupAuthInterceptor } from '@/utils';
import { database } from 'echoes-shared';
import { SupabaseClient } from '@supabase/supabase-js';

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

    const fetchPreferences = useCallback(async () => {
        if (!sessionStatus.user || !sessionStatus.user.id) {
            return;
        }

        const { preferences, error } = await database.getUserPreferences(sessionStatus.user.id, createClient());
        if (error) {
            console.error('Error fetching user preferences:', error);
        } else {
            setSessionStatus(current => ({
                ...current,
                preferences: preferences ?? null,
            }));
        }
    }, [sessionStatus.user]);

    useEffect(() => {
        const supabase = createClient() as SupabaseClient;
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
    }, [sessionStatus.active, fetchPreferences]);

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