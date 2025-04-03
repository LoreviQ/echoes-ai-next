import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase.client';
import { ContentType, ContentReference } from '@/types/content';
import { api, endpoints } from '@/utils/api';

export function useMixedFeed() {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['mixedFeed'],
        queryFn: async () => {
            const contentRefs = (await api.get(endpoints.user.recommendations)).data as ContentReference[];
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