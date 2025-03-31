'use client';

import { useState } from 'react';
import { Character } from '@/types/character';

type FeedType = 'posts' | 'replies' | 'media';

export function CharacterFeed({ character }: { character: Character }) {
    const [activeTab, setActiveTab] = useState<FeedType>('posts');

    return (
        <div className="w-full">
            <div className="w-full h-[60px] border-b border-zinc-600 grid grid-cols-3">
                <button
                    onClick={() => setActiveTab('posts')}
                    className={`w-full h-full flex items-center justify-center text-lg font-medium bg-black hover:bg-zinc-800 transition-colors ${activeTab === 'posts' ? 'bg-zinc-800' : ''}`}
                >
                    Posts
                </button>
                <button
                    onClick={() => setActiveTab('replies')}
                    className={`w-full h-full flex items-center justify-center text-lg font-medium bg-black hover:bg-zinc-800 transition-colors ${activeTab === 'replies' ? 'bg-zinc-800' : ''}`}
                >
                    Replies
                </button>
                <button
                    onClick={() => setActiveTab('media')}
                    className={`w-full h-full flex items-center justify-center text-lg font-medium bg-black hover:bg-zinc-800 transition-colors ${activeTab === 'media' ? 'bg-zinc-800' : ''}`}
                >
                    Media
                </button>
            </div>
            <div className="p-8">
                {activeTab === 'posts' && <h2 className="font-bold text-2xl">Posts Feed</h2>}
                {activeTab === 'replies' && <h2 className="font-bold text-2xl">Replies Feed</h2>}
                {activeTab === 'media' && <h2 className="font-bold text-2xl">Media Feed</h2>}
            </div>
        </div>
    );
} 