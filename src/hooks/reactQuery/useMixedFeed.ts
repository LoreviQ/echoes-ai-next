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
        queryFn: async () => {
            const contentRefs = await fetchMixedFeed();

            // Cache each post and character as we encounter them
            for (const ref of contentRefs) {
                if (ref.type === ContentType.POST) {
                    // If the post isn't already in cache, fetch and cache it
                    if (!queryClient.getQueryData(['post', ref.id])) {
                        try {
                            const supabase = createClient();
                            const { data, error } = await supabase
                                .from('posts')
                                .select('*')
                                .eq('id', ref.id)
                                .single();

                            if (!error && data) {
                                queryClient.setQueryData(['post', ref.id], data);

                                // Also update the character's post list
                                queryClient.setQueryData<string[]>(['character_posts', data.character_id],
                                    (old = []) => {
                                        if (old.includes(data.id)) return old;
                                        return [...old, data.id];
                                    }
                                );
                            }
                        } catch (err) {
                            console.error(`Failed to fetch post ${ref.id}:`, err);
                        }
                    }
                } else if (ref.type === ContentType.CHARACTER) {
                    // If the character isn't already in cache, fetch and cache it
                    if (!queryClient.getQueryData(['character', ref.id])) {
                        try {
                            const supabase = createClient();
                            const { data, error } = await supabase
                                .from('characters')
                                .select('*')
                                .eq('id', ref.id)
                                .single();

                            if (!error && data) {
                                queryClient.setQueryData(['character', ref.id], data);

                                // Also update the character ids list
                                queryClient.setQueryData<string[]>(['character_ids'],
                                    (old = []) => {
                                        if (old.includes(data.id)) return old;
                                        return [...old, data.id];
                                    }
                                );
                            }
                        } catch (err) {
                            console.error(`Failed to fetch character ${ref.id}:`, err);
                        }
                    }
                }
            }

            return contentRefs;
        },
        staleTime: 60 * 1000, // 1 minute stale time
        refetchOnWindowFocus: true,
    });
} 