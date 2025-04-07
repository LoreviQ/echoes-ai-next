import React from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { type Message } from 'echoes-shared/types';
import { createClient } from '@/utils';
import { database } from 'echoes-shared';

export function useThreads(characterId: string | undefined) {
    const createThreadMutation = useCreateThread();

    return useQuery({
        queryKey: ['threads', characterId],
        queryFn: async () => {
            const { threads, error } = await database.getThreads(characterId!, createClient());
            if (error) throw error;
            // If no threads exist, create one automatically
            if (threads.length === 0 && characterId) {
                const newThread = await createThreadMutation.mutateAsync({ characterId });
                return [newThread];
            }

            return threads;
        },
        enabled: !!characterId,
    });
}

export function useThreadMessages(threadId: string | undefined) {
    const queryClient = useQueryClient();

    const updateMessageCache = React.useCallback((payload: { new: Message }) => {
        const newMessage = payload.new;

        queryClient.setQueryData(['messages', threadId], (old: Message[] = []) => {
            // Avoid duplicates by checking if message already exists
            if (old.some(msg => msg.id === newMessage.id)) {
                return old;
            }
            return [...old, newMessage];
        });

        // Also update the thread's updated_at timestamp in our cache
        queryClient.invalidateQueries({ queryKey: ['threads'] });
    }, [threadId, queryClient]);

    React.useEffect(() => {
        if (!threadId) return;

        const subscription = database.createMessageSubscription(threadId, updateMessageCache, createClient());

        // Clean up subscription when component unmounts or threadId changes
        return () => {
            subscription.unsubscribe();
        };
    }, [threadId, updateMessageCache]);

    return useQuery({
        queryKey: ['messages', threadId],
        queryFn: async () => {
            const { messages, error } = await database.getMessages(threadId!, createClient());
            if (error) throw error;
            return messages;
        },
        enabled: !!threadId,
    });
}

export function useThreadsInvalidation() {
    const queryClient = useQueryClient();

    return {
        invalidateThreads: (characterId: string) => {
            queryClient.invalidateQueries({ queryKey: ['threads', characterId] });
        },
        invalidateMessages: (threadId: string) => {
            queryClient.invalidateQueries({ queryKey: ['messages', threadId] });
        }
    };
}

export function useCreateThread() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ characterId }: { characterId: string }) => {
            const { thread, error } = await database.insertThread({
                character_id: characterId,
                title: 'New Thread',
            }, createClient());
            if (error) throw error;
            return thread;
        },
        onSuccess: (thread) => {
            // Invalidate the threads query for this character
            queryClient.invalidateQueries({
                queryKey: ['threads', thread.character_id]
            });
        }
    });
}

export function useCreateMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        // Insert a message into the database
        mutationFn: async ({ threadId, content }: { threadId: string; content: string }) => {
            const { message, error } = await database.insertMessage({
                thread_id: threadId,
                sender_type: 'user',
                content,
            }, createClient());
            if (error) throw error;
            return message;
        },
        onMutate: async ({ threadId, content }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['messages', threadId] });

            // Snapshot the previous value
            const previousMessages = queryClient.getQueryData(['messages', threadId]);

            // Create a temporary ID that we can reference later
            const tempId = `temp-${Date.now()}`;

            // Optimistically update to the new value
            queryClient.setQueryData(['messages', threadId], (old: Message[] = []) => {
                const optimisticMessage: Message = {
                    id: tempId,
                    thread_id: threadId,
                    content,
                    sender_type: 'user',
                    created_at: new Date().toISOString(),
                };
                return [...old, optimisticMessage];
            });

            // Return a context object with the snapshotted value and tempId
            return { previousMessages, tempId };
        },
        onError: (err, variables, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousMessages) {
                queryClient.setQueryData(['messages', variables.threadId], context.previousMessages);
            }
        },
        onSuccess: (newMessage, variables, context) => {
            // Update the messages cache with the actual server response
            queryClient.setQueryData(['messages', newMessage.thread_id], (old: Message[] = []) => {
                // Filter out the optimistic message using the stored tempId
                const filtered = old.filter(message => message.id !== context?.tempId);
                return [...filtered, newMessage];
            });
        },
    });
}