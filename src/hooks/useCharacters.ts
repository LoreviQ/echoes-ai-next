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

export function useCharacters() {
    return useQuery({
        queryKey: ['characters'],
        queryFn: () => fetchCharacters(),
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