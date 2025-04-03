'use client';

import { ContentCard } from "../cards/content";
import { ContentType, ContentItem } from "@/types/content";
import { useEffect, useState } from "react";

/**
 * This is an example implementation of a mixed feed component
 * that can display both posts and characters in the same feed.
 * 
 * It demonstrates how to use the ContentCard component with different
 * content types using the ContentType enum.
 * 
 * NOTE: This is just an example and is not meant to be used directly.
 * You would need to implement the actual data fetching logic for a mixed feed.
 */
export function MixedFeed() {
    // This would be your actual implementation to fetch mixed content
    const [mixedContent, setMixedContent] = useState<ContentItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Example of how you might fetch mixed content
    useEffect(() => {
        const fetchMixedContent = async () => {
            try {
                setIsLoading(true);

                // This is where you would implement your actual data fetching
                // For example, you might fetch posts and characters separately and then merge them

                // Placeholder for demonstration purposes
                const mockMixedContent: ContentItem[] = [
                    // Example items - in a real implementation, these would come from your API
                    // { type: ContentType.POST, data: { id: '1', character_id: '123', content: 'Hello world', created_at: new Date().toISOString(), updated_at: new Date().toISOString() } },
                    // { type: ContentType.CHARACTER, data: { id: '123', name: 'Example Character', path: 'example', bio: 'This is an example character', avatar_url: null, tags: 'example,demo', public: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } },
                ];

                // You would sort the content here based on creation date or other criteria
                const sortedContent = mockMixedContent.sort((a, b) => {
                    const dateA = new Date(a.type === ContentType.POST ? a.data.created_at : a.data.created_at);
                    const dateB = new Date(b.type === ContentType.POST ? b.data.created_at : b.data.created_at);
                    return dateB.getTime() - dateA.getTime(); // Most recent first
                });

                setMixedContent(sortedContent);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error occurred'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchMixedContent();
    }, []);

    if (isLoading) {
        return (
            <div className="w-full p-4 text-center">
                <p className="text-zinc-400">Loading content...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-4 text-center">
                <p className="text-red-500">Failed to load content</p>
            </div>
        );
    }

    if (mixedContent.length === 0) {
        return (
            <div className="w-full p-4 text-center">
                <p className="text-zinc-400">No content found!</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {mixedContent.map((item) => (
                <ContentCard
                    key={`${item.type}-${item.type === ContentType.POST ? item.data.id : item.data.id}`}
                    item={item}
                />
            ))}
        </div>
    );
} 