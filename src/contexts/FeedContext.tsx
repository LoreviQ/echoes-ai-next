'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';

import { ContentReference } from '@/types';
import { api, endpoints } from '@/utils/api';

interface FeedContextType {
    currentFeed: ContentReference[];
    isLoading: boolean;
    error: Error | null;
    newPage: () => Promise<void>;
    refreshFeed: () => Promise<void>;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);
const PAGE_SIZE = 20;

export function FeedProvider({ children }: { children: ReactNode }) {
    const [feedReferences, setFeedReferences] = useState<ContentReference[]>([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Compute current feed based on page index
    const currentFeed = useMemo(() => {
        return feedReferences.slice(0, (currentPageIndex + 1) * PAGE_SIZE);
    }, [feedReferences, currentPageIndex]);

    const fetchFeed = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const requestBody = { previouslySeenContent: feedReferences };
            const response = await api.post(endpoints.user.recommendations, requestBody);
            const contentRefs = response.data as ContentReference[];

            setFeedReferences(prev => [...prev, ...contentRefs]);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch feed'));
            console.error('Feed fetch error:', err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [feedReferences]);

    const newPage = useCallback(async () => {
        const nextPageIndex = currentPageIndex + 1;
        const itemsNeededForNextPage = (nextPageIndex + 1) * PAGE_SIZE;

        // If we have enough items for the current request
        if (feedReferences.length >= (nextPageIndex * PAGE_SIZE)) {
            setCurrentPageIndex(nextPageIndex);

            // Preemptively fetch more if we won't have enough for the next request
            if (feedReferences.length < itemsNeededForNextPage) {
                fetchFeed().catch(console.error); // Run in background
            }
            return;
        }

        // If we need more items now
        const fetchSuccess = await fetchFeed();
        if (fetchSuccess) {
            setCurrentPageIndex(nextPageIndex);
        }
    }, [currentPageIndex, feedReferences.length, fetchFeed]);

    const refreshFeed = useCallback(async () => {
        setFeedReferences([]);
        setCurrentPageIndex(0);
        const success = await fetchFeed();
        if (success && feedReferences.length >= PAGE_SIZE) {
            setCurrentPageIndex(0);
            // Preemptively fetch more for the next page
            fetchFeed().catch(console.error); // Run in background
        }
    }, [fetchFeed, feedReferences.length]);

    const value = {
        currentFeed,
        isLoading,
        error,
        newPage,
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