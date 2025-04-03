import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase.client';
import { Character } from '@/types/character';
import { useCallback } from 'react';

// Fetch characters using Supabase directly
async function fetchCharacters(): Promise<Character[]> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('characters')
            .select('*')
            .eq('public', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching characters:', error);
        throw error;
    }
}

// Fetch a single character by ID
async function fetchCharacterById(id: string): Promise<Character | null> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('characters')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching character:', error);
        throw error;
    }
}

export function useCharacters() {
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch, isRefetching } = useQuery({
        queryKey: ['characters'],
        queryFn: () => fetchCharacters(),
        staleTime: 60 * 1000, // 1 minute stale time
    });

    const getCharactersForUser = useCallback(async () => {
        try {
            // For now, just use fetchCharacters (this will be expanded later)
            const fetchedCharacters = await fetchCharacters();

            // Get the current cache
            const cachedCharacters = queryClient.getQueryData<Character[]>(['characters']) || [];

            // Merge without duplicates
            const mergedCharacters = [...cachedCharacters];

            // Add new characters that don't already exist in cache
            fetchedCharacters.forEach(character => {
                if (!mergedCharacters.some(c => c.id === character.id)) {
                    mergedCharacters.push(character);
                }
            });

            // Update the cache
            queryClient.setQueryData<Character[]>(['characters'], mergedCharacters);

            return mergedCharacters;
        } catch (error) {
            console.error('Error in getCharactersForUser:', error);
            throw error;
        }
    }, [queryClient]);

    return {
        data,
        isLoading,
        error,
        getCharactersForUser,
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

            // First, check the characters list cache
            const characters = queryClient.getQueryData<Character[]>(['characters']);
            const cachedCharacter = characters?.find(c => c.id === id);
            if (cachedCharacter) {
                return cachedCharacter;
            }

            // If not in cache, fetch it
            const character = await fetchCharacterById(id);
            if (character) {
                // Update the characters cache by adding this character if it's not there
                queryClient.setQueryData<Character[]>(['characters'], (old) => {
                    if (!old) return [character];
                    if (old.some(c => c.id === character.id)) return old;
                    return [...old, character];
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
            queryClient.invalidateQueries({ queryKey: ['characters'] });
        }
    };
} 