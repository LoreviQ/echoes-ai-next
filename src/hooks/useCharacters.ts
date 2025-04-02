import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase.client';
import { Character } from '@/types/character';

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
    return useQuery({
        queryKey: ['characters'],
        queryFn: () => fetchCharacters(),
    });
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