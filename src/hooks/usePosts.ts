import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase.client';
import { Post } from '@/types/post';
import { api, endpoints } from '@/utils/api';

// Fetch posts using Supabase directly
async function fetchPosts(characterId: string): Promise<Post[]> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('character_id', characterId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}

export function usePosts(characterId: string) {
    return useQuery({
        queryKey: ['posts', characterId],
        queryFn: () => fetchPosts(characterId),
    });
}

export function usePostsInvalidation() {
    const queryClient = useQueryClient();

    return {
        invalidatePosts: (characterId: string) => {
            queryClient.invalidateQueries({ queryKey: ['posts', characterId] });
        }
    };
}

// New hook for creating posts that uses the API and manages the cache
export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (characterId: string) => {
            const response = await api.post(endpoints.characters.posts(characterId));
            return response.data;
        },
        onSuccess: (data, characterId) => {
            // Invalidate the posts query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['posts', characterId] });
        },
    });
} 