'use client';

import { useState, useEffect, useCallback } from 'react';
import { ContentCard } from '../cards/content';
import { ContentReference } from '@/types/content';
import { useContentItem } from '@/hooks/reactQuery/useContentItem';
import { api, endpoints } from '@/utils/api';

export function ForYouFeed() {
    const [feedReferences, setFeedReferences] = useState<ContentReference[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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

            // Fetch feed references from API
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

    // Fetch feed on component mount
    useEffect(() => {
        fetchFeed();
    }, [fetchFeed]);

    // Handle feed loading state when initially loading
    if (isLoading && !feedReferences.length) {
        return (
            <div className="w-full p-4 text-center">
                <p className="text-zinc-400">Loading feed...</p>
            </div>
        );
    }

    // Handle feed error state
    if (error) {
        return (
            <div className="w-full p-4 text-center">
                <p className="text-red-500">Failed to load feed</p>
                <button
                    onClick={() => fetchFeed()}
                    className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-white"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Handle empty feed
    if (!feedReferences || feedReferences.length === 0) {
        return (
            <div className="w-full p-4 text-center">
                <p className="text-zinc-400">No content found!</p>
                <button
                    onClick={() => fetchFeed()}
                    className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-white"
                >
                    Refresh
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Optional refetching indicator */}
            {isRefetching && (
                <div className="w-full p-2 text-center bg-zinc-800 bg-opacity-50">
                    <p className="text-sm text-zinc-300">Refreshing content...</p>
                </div>
            )}

            {/* Content feed */}
            <div className="w-full">
                {feedReferences.map((contentRef) => (
                    <FeedItem
                        key={`${contentRef.type}-${contentRef.id}`}
                        contentRef={contentRef}
                    />
                ))}
            </div>

            {/* Refresh button */}
            <div className="w-full p-4 text-center border-t border-zinc-800">
                <button
                    onClick={() => fetchFeed(true)}
                    disabled={isRefetching}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-white"
                >
                    {isRefetching ? 'Refreshing...' : 'Refresh Feed'}
                </button>
            </div>
        </div>
    );
}

// Individual feed item component that fetches and displays a content item
function FeedItem({ contentRef }: { contentRef: ContentReference }) {
    const { data: contentItem, isLoading, error } = useContentItem(contentRef);

    if (isLoading) {
        return (
            <div className="px-4 py-3 border-b border-zinc-600 animate-pulse">
                <div className="flex space-x-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-zinc-700"></div>
                    <div className="flex-grow space-y-2">
                        <div className="h-4 bg-zinc-700 rounded w-1/4"></div>
                        <div className="h-3 bg-zinc-700 rounded w-3/4"></div>
                        <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !contentItem) {
        return (
            <div className="px-4 py-3 border-b border-zinc-600">
                <div className="w-full text-center">
                    <p className="text-red-500">Failed to load content</p>
                </div>
            </div>
        );
    }

    return <ContentCard item={contentItem} />;
}
