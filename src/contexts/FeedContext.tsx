'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ContentReference } from '@/types/content';
import { api, endpoints } from '@/utils/api';

interface FeedContextType {
    feedReferences: ContentReference[];
    isLoading: boolean;
    isRefetching: boolean;
    error: Error | null;
    fetchFeed: (isRefetch?: boolean) => Promise<void>;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: ReactNode }) {
    const [feedReferences, setFeedReferences] = useState<ContentReference[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [isRefetching, setIsRefetching] = useState(false);

    const fetchFeed = useCallback(async (isRefetch = false) => {
        try {
            if (isRefetch) {
                setIsRefetching(true);
            } else {
                setIsLoading(true);
            }
            setError(null);

            const response = await api.post(endpoints.user.recommendations);
            const contentRefs = response.data as ContentReference[];
            setFeedReferences(contentRefs);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch feed'));
            console.error('Feed fetch error:', err);
        } finally {
            setIsLoading(false);
            setIsRefetching(false);
        }
    }, []);

    const value = {
        feedReferences,
        isLoading,
        isRefetching,
        error,
        fetchFeed,
    };

    return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeed() {
    const context = useContext(FeedContext);
    if (context === undefined) {
        throw new Error('useFeed must be used within a FeedProvider');
    }
    return context;
} 