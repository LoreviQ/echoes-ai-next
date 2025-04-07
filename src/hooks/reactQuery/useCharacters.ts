import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { type Character } from 'echoes-shared/types';
import { database } from 'echoes-shared';
import { useSession } from '@/contexts';
import { createClient } from '@/utils';

export function useCharacters() {
    const queryClient = useQueryClient();
    const { preferences } = useSession();

    const { data: characterIds, isLoading, error, refetch, isRefetching } = useQuery({
        queryKey: ['character_ids'],
        queryFn: async () => {
            const { characters, error } = await database.getCharacters(preferences?.nsfw_filter, createClient());
            if (error) throw error;
            const characterIds = characters.map(character => character.id);

            // Store each character individually in the cache
            characters.forEach(character => {
                queryClient.setQueryData(['character', character.id], character);
            });

            return characterIds;
        },
        staleTime: 60 * 1000, // 1 minute stale time
    });

    const getCharactersForUser = useCallback(async () => {
        try {
            // For now, just use fetchCharacters (this will be expanded later)
            const { characters, error } = await database.getCharacters(preferences?.nsfw_filter, createClient());
            if (error) throw error;
            const characterIds = characters.map(character => character.id);

            // Get the current cache
            const cachedCharacterIds = queryClient.getQueryData<string[]>(['character_ids']) || [];

            // Store each character individually
            characters.forEach(character => {
                queryClient.setQueryData(['character', character.id], character);
            });

            // Merge without duplicates
            const mergedCharacterIds = [...cachedCharacterIds];

            // Add new character IDs that don't already exist in cache
            characterIds.forEach(id => {
                if (!mergedCharacterIds.includes(id)) {
                    mergedCharacterIds.push(id);
                }
            });

            // Update the cache
            queryClient.setQueryData<string[]>(['character_ids'], mergedCharacterIds);

            // Return the full character objects
            return mergedCharacterIds.map(id =>
                queryClient.getQueryData<Character>(['character', id])
            ).filter(Boolean) as Character[];
        } catch (error) {
            console.error('Error in getCharactersForUser:', error);
            throw error;
        }
    }, [queryClient, preferences?.nsfw_filter]);

    const updateCharacter = useCallback((id: string, character: Character) => {
        // Update the character in the cache
        queryClient.setQueryData(['character', id], character);
    }, [queryClient]);

    // Get the actual character objects from the IDs
    const characters = characterIds?.map(id =>
        queryClient.getQueryData<Character>(['character', id])
    ).filter(Boolean) as Character[] | undefined;

    return {
        data: characters,
        isLoading,
        error,
        getCharactersForUser,
        updateCharacter,
        refetch,
        isRefetching
    };
}

export function useCharacter(id: string | undefined) {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['character', id],
        queryFn: async () => {
            if (!id) return null;

            // Try to get from cache first
            const cachedCharacter = queryClient.getQueryData<Character>(['character', id]);
            if (cachedCharacter) return cachedCharacter;

            // If not in cache, fetch it
            const { character, error } = await database.getCharacter(id, createClient());
            if (error) throw error;
            if (character) {
                // Add this character ID to the character_ids list if it's not there
                queryClient.setQueryData<string[]>(['character_ids'], (old = []) => {
                    if (old.includes(character.id)) return old;
                    return [...old, character.id];
                });
            }
            return character;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes stale time
    });
}

export function useCharactersInvalidation() {
    const queryClient = useQueryClient();

    return {
        invalidateCharacters: () => {
            // Get the character IDs 
            const characterIds = queryClient.getQueryData<string[]>(['character_ids']);

            // Invalidate each individual character
            if (characterIds) {
                characterIds.forEach(id => {
                    queryClient.invalidateQueries({ queryKey: ['character', id] });
                });
            }

            // Invalidate the character IDs list
            queryClient.invalidateQueries({ queryKey: ['character_ids'] });
        }
    };
} 