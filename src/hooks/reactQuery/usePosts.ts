import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { type PostSchema } from 'echoes-shared/types';
import { api, endpoints, createClient } from '@/utils';
import { database } from 'echoes-shared';

export function usePosts(characterId: string) {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['character_posts', characterId],
        queryFn: async () => {
            const { posts, error } = await database.getPostsByCharacterId(characterId, createClient());
            if (error) throw error;
            const postIds = posts.map(post => post.id);

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
        queryClient.getQueryData<PostSchema>(['post', id])
    ).filter(Boolean) as PostSchema[] | undefined;

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
            const cachedPost = queryClient.getQueryData<PostSchema>(['post', postId]);
            if (cachedPost) return cachedPost;

            // Fetch from API if not in cache
            const { post, error } = await database.getPost(postId, createClient());
            if (error) throw error;
            if (!post) throw new Error(`Post not found: ${postId}`);
            return post;
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
            queryClient.invalidateQueries({ queryKey: ['character_posts', characterId] });
        },
    });
} 