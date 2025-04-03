'use client';

import { useCharacters } from "@/hooks/useCharacters";
import { ContentCard } from "../cards/content";
import { useEffect } from "react";
import { ContentType } from "@/types/content";

export function Characters() {
    const { data: characters, isLoading, error, getCharactersForUser } = useCharacters();

    // Fetch recommended characters when component mounts
    useEffect(() => {
        getCharactersForUser().catch(err => {
            console.error("Error fetching characters for user:", err);
        });
    }, [getCharactersForUser]);

    if (isLoading) {
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
            </div>
        );
    }

    if (!characters || characters.length === 0) {
        return (
            <div className="w-full p-4 text-center">
                <p className="text-zinc-400">No characters found!</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {characters.map((character) => (
                <ContentCard
                    key={character.id}
                    item={{ type: ContentType.CHARACTER, data: character }}
                />
            ))}
        </div>
    );
} 