'use client';

import { Character } from "@/types/character";
import { ContentCard } from "../cards/content";
import { usePostsWithData } from "@/hooks/reactQuery/usePosts";
import { ContentType } from "@/types/content";

export function Posts({ character }: { character: Character }) {
    const { data: posts, isLoading, error, refetch, isRefetching } = usePostsWithData(character.id);

    if (isLoading && !posts) {
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
                <button
                    onClick={() => refetch()}
                    className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-white"
                >
                    Retry
                </button>
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
            {/* Optional refetching indicator */}
            {isRefetching && (
                <div className="w-full p-2 text-center bg-zinc-800 bg-opacity-50">
                    <p className="text-sm text-zinc-300">Refreshing posts...</p>
                </div>
            )}

            {/* Posts list */}
            {posts.map((post) => (
                <ContentCard
                    key={post.id}
                    item={{
                        type: ContentType.POST,
                        data: post
                    }}
                />
            ))}
        </div>
    );
} 