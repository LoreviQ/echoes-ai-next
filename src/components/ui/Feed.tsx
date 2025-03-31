'use client';

import { useState } from 'react';
import { FeedType } from '@/types/feed';
import { Posts } from '@/components/content/Posts';

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

    const renderContent = () => {
        switch (activeTab) {
            case FeedType.POSTS:
                return <Posts />;
            default:
                return <p className="p-8">TODO: Implement {activeTab}</p>;
        }
    };

    return (
        <div className="w-full">
            <div className={`w-full h-[60px] border-b border-zinc-600`} style={{ gridTemplateColumns: `repeat(${feedTypes.length}, minmax(0, 1fr))`, display: 'grid' }}>
                {feedTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveTab(type)}
                        className={`w-full h-full flex items-center justify-center text-lg bg-black hover:bg-zinc-800 transition-colors relative
                            ${activeTab === type ? 'font-bold' : 'font-medium'}`}
                    >
                        <div className="relative">
                            {type}
                            <div className={`absolute -bottom-[16px] left-1/2 -translate-x-1/2 h-[3px] transition-all duration-200 rounded-full
                                ${activeTab === type ? 'w-[calc(100%+20px)] bg-sky-500' : 'w-0 bg-transparent'}`} />
                        </div>
                    </button>
                ))}
            </div>
            <div className="">
                {renderContent()}
            </div>
        </div>
    );
} 