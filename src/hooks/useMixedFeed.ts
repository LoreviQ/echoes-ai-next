import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase.client';
import { ContentType, ContentReference } from '@/types/content';

// Fetch a mixed feed of content references
async function fetchMixedFeed(): Promise<ContentReference[]> {
    try {
        const supabase = createClient();

        // Fetch posts
        const { data: posts, error: postsError } = await supabase
            .from('posts')
            .select('id, character_id, created_at')
            .order('created_at', { ascending: false });

        if (postsError) throw postsError;

        // Fetch characters
        const { data: characters, error: charsError } = await supabase
            .from('characters')
            .select('id, created_at')
            .eq('public', true)
            .order('created_at', { ascending: false });

        if (charsError) throw charsError;

        // Convert to ContentReference arrays with timestamp for sorting
        const contentItems: Array<ContentReference & { timestamp: string }> = [
            ...(posts || []).map(post => ({
                type: ContentType.POST,
                id: post.id,
                timestamp: post.created_at
            })),
            ...(characters || []).map(character => ({
                type: ContentType.CHARACTER,
                id: character.id,
                timestamp: character.created_at
            }))
        ];

        // Sort all content by timestamp, most recent first
        contentItems.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        // Remove the timestamp property before returning
        return contentItems.map(({ type, id }) => ({ type, id }));
    } catch (error) {
        console.error('Error fetching mixed feed:', error);
        throw error;
    }
}

export function useMixedFeed() {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['mixedFeed'],
        queryFn: fetchMixedFeed,
        staleTime: 60 * 1000, // 1 minute stale time
        refetchOnWindowFocus: true,
    });
} 