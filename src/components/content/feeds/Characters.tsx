'use client';

import { useCharacters } from "@/hooks/useCharacters";
import { ContentCard } from "../cards/content";
import { useEffect } from "react";
import { ContentType } from "@/types/content";

export function Characters() {
    const {
        data: characters,
        isLoading,
        error,
        getCharactersForUser,
        refetch,
        isRefetching
    } = useCharacters();

    // Fetch recommended characters when component mounts
    useEffect(() => {
        getCharactersForUser().catch(err => {
            console.error("Error fetching characters for user:", err);
        });
    }, [getCharactersForUser]);

    if (isLoading && !characters) {
        return (
            <div className="w-full p-4 text-center">
                <p className="text-zinc-400">Loading characters...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-4 text-center">
                <p className="text-red-500">Failed to load characters</p>
                <button
                    onClick={() => refetch()}
                    className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-white"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!characters || characters.length === 0) {
        return (
            <div className="w-full p-4 text-center">
                <p className="text-zinc-400">No characters found!</p>
                <button
                    onClick={() => refetch()}
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
                    <p className="text-sm text-zinc-300">Refreshing characters...</p>
                </div>
            )}

            {/* Characters list */}
            {characters.map((character) => (
                <ContentCard
                    key={character.id}
                    item={{ type: ContentType.CHARACTER, data: character }}
                />
            ))}
        </div>
    );
} 