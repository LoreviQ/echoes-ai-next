'use client';

import { useState } from 'react';
import { FeedType, Character } from '@/types';

import * as FeedContent from '@/components/content/feeds';

/**
 * Home feed component that displays a list of feed types and allows the user to switch between them.
 * @returns A component that displays a list of feed types and allows the user to switch between them.
 */
export function HomeFeed() {
    const feedTypes = [FeedType.FOR_YOU, FeedType.FOLLOWING];
    return (
        <GeneralFeed feedTypes={feedTypes} header={true} />
    );
}


/**
 * Character feed component that displays a list of feed types and allows the user to switch between them.
 * @returns A component that displays a list of feed types and allows the user to switch between them.
 */
export function CharacterFeed({ character }: { character: Character }) {
    const feedTypes = [FeedType.POSTS, FeedType.REPLIES, FeedType.MEDIA];
    return (
        <GeneralFeed feedTypes={feedTypes} character={character} />
    );
}

/**
 * Character feed component that displays a list of feed types and allows the user to switch between them.
 * @returns A component that displays a list of feed types and allows the user to switch between them.
 */
export function CharacterRecommendationFeed() {
    const feedTypes = [FeedType.CHARACTERS, FeedType.RECOMMENDED_CHARACTERS];
    return (
        <GeneralFeed feedTypes={feedTypes} header={true} />
    );
}

interface GeneralFeedProps {
    feedTypes: FeedType[];
    character?: Character;
    header?: boolean;
}
/**
 * General feed component that displays a list of feed types and allows the user to switch between them.
 * @param feedTypes - The list of feed types to display.
 * @param character - Optional character data for character-specific feeds
 * @param isHeaderSticky - Whether the feed header should stick to the top while scrolling
 * @returns A component that displays a list of feed types and allows the user to switch between them.
 */
function GeneralFeed({ feedTypes, character, header: isHeaderSticky = false }: GeneralFeedProps) {
    const [activeTab, setActiveTab] = useState<FeedType>(feedTypes[0]);

    const renderContent = () => {
        switch (activeTab) {
            case FeedType.POSTS:
                if (!character) {
                    throw new Error('Character is required for posts feed');
                }
                return <FeedContent.Posts character={character} />;
            case FeedType.CHARACTERS:
                return <FeedContent.Characters />;
            case FeedType.FOR_YOU:
                return <FeedContent.ForYouFeed />;
            default:
                return <p className="p-8">TODO: Implement {activeTab}</p>;
        }
    };

    return (
        <div className="w-full">
            <div className={`w-full h-[60px] border-b border-zinc-600 ${isHeaderSticky ? 'sticky top-0 z-10 bg-black/60 backdrop-blur-md' : 'bg-black'}`}
                style={{ gridTemplateColumns: `repeat(${feedTypes.length}, minmax(0, 1fr))`, display: 'grid' }}>
                {feedTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveTab(type)}
                        className={`w-full h-full flex items-center justify-center text-lg hover:bg-zinc-800/50 transition-colors relative
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
            {renderContent()}
        </div>
    );
} 