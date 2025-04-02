'use client';

import { useCharacters } from "@/hooks/useCharacters";
import { CharacterCard } from "@/components/content/CharacterCard";

export function Characters() {
    const { data: characters, isLoading, error } = useCharacters();

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
        <div className="w-full space-y-4">
            {characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
            ))}
        </div>
    );
} 