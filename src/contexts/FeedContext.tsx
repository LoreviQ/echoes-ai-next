'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ContentReference } from '@/types/content';
import { api, endpoints } from '@/utils/api';

interface FeedContextType {
    feedReferences: ContentReference[];
    isLoading: boolean;
    error: Error | null;
    fetchFeed: () => Promise<void>;
    refreshFeed: () => Promise<void>;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: ReactNode }) {
    const [feedReferences, setFeedReferences] = useState<ContentReference[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchFeed = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const requestBody = { previousContent: feedReferences };
            const response = await api.post(endpoints.user.recommendations, requestBody);
            const contentRefs = response.data as ContentReference[];

            setFeedReferences(prev => [...prev, ...contentRefs]);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch feed'));
            console.error('Feed fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [feedReferences]);

    const refreshFeed = useCallback(async () => {
        setFeedReferences([]);
        await fetchFeed();
    }, [fetchFeed]);

    const value = {
        feedReferences,
        isLoading,
        error,
        fetchFeed,
        refreshFeed,
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