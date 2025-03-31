'use client';

import { useState } from 'react';
import { FeedType } from '@/types/feed';

interface GeneralFeedProps {
    feedTypes: FeedType[];
}

/**
 * Character feed component that displays a list of feed types and allows the user to switch between them.
 * @returns A component that displays a list of feed types and allows the user to switch between them.
 */
export function CharacterFeed() {
    const feedTypes = [FeedType.POSTS, FeedType.REPLIES, FeedType.MEDIA];
    return (
        <GeneralFeed feedTypes={feedTypes} />
    );
}


/**
 * General feed component that displays a list of feed types and allows the user to switch between them.
 * @param feedTypes - The list of feed types to display.
 * @returns A component that displays a list of feed types and allows the user to switch between them.
 */
export function GeneralFeed({ feedTypes }: GeneralFeedProps) {
    const [activeTab, setActiveTab] = useState<FeedType>(feedTypes[0]);

    return (
        <div className="w-full">
            <div className={`w-full h-[60px] border-b border-zinc-600`} style={{ gridTemplateColumns: `repeat(${feedTypes.length}, minmax(0, 1fr))`, display: 'grid' }}>
                {feedTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveTab(type)}
                        className={`w-full h-full flex items-center justify-center text-lg font-medium bg-black hover:bg-zinc-800 transition-colors ${activeTab === type ? 'bg-zinc-800' : ''}`}
                    >
                        {type}
                    </button>
                ))}
            </div>
            <div className="p-8">
                <h2 className="font-bold text-2xl">{activeTab} Feed</h2>
            </div>
        </div>
    );
} 