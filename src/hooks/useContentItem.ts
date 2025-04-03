import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ContentReference, ContentType, ContentItem } from '@/types/content';
import { useCharacter } from './useCharacters';
import { createClient } from '@/utils/supabase.client';
import { Post } from '@/types/post';

/**
 * Hook to fetch a content item by its reference
 */
export function useContentItem(contentRef: ContentReference) {
    const { type, id } = contentRef;

    // Use different hooks based on content type
    if (type === ContentType.POST) {
        return usePostContentItem(id);
    } else if (type === ContentType.CHARACTER) {
        return useCharacterContentItem(id);
    }

    // Default fallback - shouldn't be reached with proper typing
    return {
        data: undefined,
        isLoading: false,
        error: new Error(`Unknown content type: ${type}`)
    };
}

// Internal hook for fetching a post content item
function usePostContentItem(postId: string) {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['contentItem', 'post', postId],
        queryFn: async () => {
            // First, try to find this post in any existing post queries in the cache
            const postQueries = queryClient.getQueriesData<Post[]>({ queryKey: ['posts'] });

            for (const [, posts] of postQueries) {
                if (!posts) continue;

                const post = posts.find(p => p.id === postId);
                if (post) {
                    return {
                        type: ContentType.POST,
                        data: post
                    } as ContentItem;
                }
            }

            // If not found in cache, fetch directly
            const supabase = createClient();
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', postId)
                .single();

            if (error) throw error;
            if (!data) throw new Error(`Post not found: ${postId}`);

            // Update the posts cache with this post
            // This ensures the specialized hook can find it
            queryClient.setQueryData(['posts', data.character_id],
                (old: Post[] | undefined) => old ? [...old, data] : [data]);

            return {
                type: ContentType.POST,
                data
            } as ContentItem;
        },
        // This hook should use stale data while revalidating
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

// Internal hook for fetching a character content item
function useCharacterContentItem(characterId: string) {
    // Use the existing useCharacter hook directly
    const characterQuery = useCharacter(characterId);

    return {
        ...characterQuery,
        data: characterQuery.data ? {
            type: ContentType.CHARACTER,
            data: characterQuery.data
        } as ContentItem : undefined
    };
} 