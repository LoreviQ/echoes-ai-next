import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { createClient, databaseQueries } from '@/utils';

type Subscription = {
    character_id: string;
};

// 1 hour stale time - reasonable balance between responsiveness and performance
const STALE_TIME = 1000 * 60 * 60;

export const useSubscriptions = () => {
    return useQuery({
        queryKey: ['subscriptions'],
        queryFn: async () => {
            const supabase = createClient();
            const { user } = await databaseQueries.getLoggedInUser(supabase);
            if (!user) return [];

            const { data: subscriptions, error } = await supabase
                .from('character_subscriptions')
                .select('character_id')
                .eq('user_id', user.id);

            if (error) {
                throw error;
            }

            return (subscriptions as Subscription[]).map(sub => sub.character_id);
        },
        staleTime: STALE_TIME
    });
};

export const useSubscribe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (character_id: string) => {
            const supabase = createClient();
            const { user } = await databaseQueries.getLoggedInUser(supabase);
            if (!user) throw new Error('User not authenticated');

            const { error } = await supabase
                .from('character_subscriptions')
                .insert([{ user_id: user.id, character_id }]);

            if (error) throw error;
            return character_id;
        },
        onSuccess: (character_id) => {
            queryClient.setQueryData<string[]>(['subscriptions'], (old = []) => {
                if (!old.includes(character_id)) {
                    return [...old, character_id];
                }
                return old;
            });
        }
    });
};

export const useUnsubscribe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (character_id: string) => {
            const supabase = createClient();
            const { user } = await databaseQueries.getLoggedInUser(supabase);
            if (!user) throw new Error('User not authenticated');

            const { error } = await supabase
                .from('character_subscriptions')
                .delete()
                .eq('user_id', user.id)
                .eq('character_id', character_id);

            if (error) throw error;
            return character_id;
        },
        onSuccess: (character_id) => {
            queryClient.setQueryData<string[]>(['subscriptions'], (old = []) => {
                return old.filter(id => id !== character_id);
            });
        }
    });
}; 