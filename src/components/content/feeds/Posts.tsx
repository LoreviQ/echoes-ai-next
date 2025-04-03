'use client';

import { Character } from "@/types/character";
import { ContentCard } from "../cards/content";
import { usePosts } from "@/hooks/usePosts";
import { ContentType } from "@/types/content";

export function Posts({ character }: { character: Character }) {
    const { data: posts, isLoading, error } = usePosts(character.id);

    if (isLoading) {
        return (
            <div className="w-full p-4 text-center">
                <p className="text-zinc-400">Loading posts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-4 text-center">
                <p className="text-red-500">Failed to load posts</p>
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="w-full p-4 text-center">
                <p className="text-zinc-400">This character has no posts yet!</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {posts.map((post) => (
                <ContentCard
                    key={post.id}
                    item={{ type: ContentType.POST, data: post }}
                />
            ))}
        </div>
    );
} 