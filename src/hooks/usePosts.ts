import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase.client';
import { Post } from '@/types/post';
import { api, endpoints } from '@/utils/api';

// Fetch posts using Supabase directly
async function fetchPosts(characterId: string): Promise<{ posts: Post[], postIds: string[] }> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('character_id', characterId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const posts = data || [];
        const postIds = posts.map(post => post.id);

        return { posts, postIds };
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}

export function usePosts(characterId: string) {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['character_posts', characterId],
        queryFn: async () => {
            const { posts, postIds } = await fetchPosts(characterId);

            // Store each post individually in the cache
            posts.forEach(post => {
                queryClient.setQueryData(['post', post.id], post);
            });

            return postIds; // Return just the IDs
        },
        staleTime: 60 * 1000, // 1 minute stale time
    });
}

// New hook that returns full post objects instead of just IDs
export function usePostsWithData(characterId: string) {
    const queryClient = useQueryClient();
    const postsQuery = usePosts(characterId);

    // Extract the data we need from the query
    const { data: postIds, isLoading, error, refetch, isRefetching } = postsQuery;

    // Map IDs to full post objects from the cache
    const posts = postIds?.map(id =>
        queryClient.getQueryData<Post>(['post', id])
    ).filter(Boolean) as Post[] | undefined;

    // Return the same query interface but with full posts instead of IDs
    return {
        data: posts,
        isLoading,
        error,
        refetch,
        isRefetching
    };
}

// Function to get a post from cache or fetch it if not available
export function usePost(postId: string) {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['post', postId],
        queryFn: async () => {
            // Try to get from cache first
            const cachedPost = queryClient.getQueryData<Post>(['post', postId]);
            if (cachedPost) return cachedPost;

            // Fetch from API if not in cache
            const supabase = createClient();
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', postId)
                .single();

            if (error) throw error;
            if (!data) throw new Error(`Post not found: ${postId}`);

            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes stale time
    });
}

export function usePostsInvalidation() {
    const queryClient = useQueryClient();

    return {
        invalidatePosts: (characterId: string) => {
            // Get the post IDs for this character
            const postIds = queryClient.getQueryData<string[]>(['character_posts', characterId]);

            // Invalidate each individual post
            if (postIds) {
                postIds.forEach(postId => {
                    queryClient.invalidateQueries({ queryKey: ['post', postId] });
                });
            }

            // Invalidate the character's post list
            queryClient.invalidateQueries({ queryKey: ['character_posts', characterId] });
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
            // Add the new post to the cache
            queryClient.setQueryData(['post', data.id], data);

            // Update the character's post list
            queryClient.setQueryData<string[]>(['character_posts', characterId], (old) => {
                if (!old) return [data.id];
                return [data.id, ...old]; // Add to beginning since it's newest
            });
        },
    });
} 