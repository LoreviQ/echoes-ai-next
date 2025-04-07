import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { createClient } from '@/utils';
import { database } from 'echoes-shared';

// 1 hour stale time - reasonable balance between responsiveness and performance
const STALE_TIME = 1000 * 60 * 60;

export const useSubscriptions = () => {
    return useQuery({
        queryKey: ['subscriptions'],
        queryFn: async () => {
            const { user } = await database.getLoggedInUser(createClient());
            if (!user) return [];
            const { subscriptions, error } = await database.getSubscriptions(user.id, createClient());
            if (error) { throw error }
            return subscriptions
        },
        staleTime: STALE_TIME
    });
};

export const useSubscribe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (character_id: string) => {
            const { user } = await database.getLoggedInUser(createClient());
            if (!user) throw new Error('User not authenticated');
            const { error } = await database.insertSubscription({ character_id, user_id: user.id }, createClient());
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
            const { user } = await database.getLoggedInUser(createClient());
            if (!user) throw new Error('User not authenticated');
            const { error } = await database.deleteSubscription({ character_id, user_id: user.id }, createClient());
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