'use client';

import { useEffect, useRef, useCallback } from 'react';
import { ContentCard } from '../cards/content';
import { ContentReference } from '@/types/content';
import { useContentItem } from '@/hooks/reactQuery/useContentItem';
import { useFeed } from '@/contexts/FeedContext';

export function ForYouFeed() {
    const { currentFeed, isLoading, error, newPage, refreshFeed } = useFeed();
    const observerTarget = useRef(null);

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading) {
            newPage();
        }
    }, [isLoading, newPage]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '20px',
            threshold: 1.0
        });

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [handleObserver]);

    // Load initial page on component mount
    useEffect(() => {
        if (currentFeed.length === 0) {
            newPage();
        }
    }, [newPage, currentFeed.length]);

    // Handle feed loading state when initially loading
    if (isLoading && !currentFeed.length) {
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
                    onClick={() => refreshFeed()}
                    className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-white"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Handle empty feed
    if (!currentFeed || currentFeed.length === 0) {
        return (
            <div className="w-full p-4 text-center">
                <p className="text-zinc-400">No content found!</p>
                <button
                    onClick={() => refreshFeed()}
                    className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-white"
                >
                    Refresh
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Content feed */}
            <div className="w-full">
                {currentFeed.map((contentRef) => (
                    <FeedItem
                        key={`${contentRef.type}-${contentRef.id}`}
                        contentRef={contentRef}
                    />
                ))}
            </div>

            {/* Infinite scroll observer target */}
            <div
                ref={observerTarget}
                className="w-full p-4 text-center"
            >
                {isLoading && (
                    <p className="text-zinc-400">Loading more...</p>
                )}
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
