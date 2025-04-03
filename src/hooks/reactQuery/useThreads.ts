import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase.client';
import { Thread, Message } from '@/types/thread';
import React from 'react';

async function fetchThreads(characterId: string): Promise<Thread[]> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('threads')
            .select('*')
            .eq('character_id', characterId)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching threads:', error);
        throw error;
    }
}

async function fetchThreadMessages(threadId: string): Promise<Message[]> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('thread_id', threadId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
}

export function useThreads(characterId: string | undefined) {
    const createThreadMutation = useCreateThread();

    return useQuery({
        queryKey: ['threads', characterId],
        queryFn: async () => {
            const threads = await fetchThreads(characterId!);

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

    React.useEffect(() => {
        if (!threadId) return;

        const supabase = createClient();

        // Create a subscription to the messages table
        const subscription = supabase
            .channel('messages_changes')
            .on('postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `thread_id=eq.${threadId}`
                },
                (payload) => {
                    // When a new message is detected, update the cache
                    const newMessage = payload.new as Message;

                    queryClient.setQueryData(['messages', threadId], (old: Message[] = []) => {
                        // Avoid duplicates by checking if message already exists
                        if (old.some(msg => msg.id === newMessage.id)) {
                            return old;
                        }
                        return [...old, newMessage];
                    });

                    // Also update the thread's updated_at timestamp in our cache
                    queryClient.invalidateQueries({ queryKey: ['threads'] });
                }
            )
            .subscribe();

        // Clean up subscription when component unmounts or threadId changes
        return () => {
            subscription.unsubscribe();
        };
    }, [threadId, queryClient]);


    return useQuery({
        queryKey: ['messages', threadId],
        queryFn: () => fetchThreadMessages(threadId!),
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
            const supabase = createClient();

            // Get the actual user from Supabase auth
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw new Error('Authentication error');

            const { data: thread, error } = await supabase
                .from('threads')
                .insert({
                    user_id: user.id,
                    character_id: characterId,
                    title: 'New Thread',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

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
        mutationFn: async ({ threadId, content }: { threadId: string; content: string }) => {
            const supabase = createClient();

            // Get the actual user from Supabase auth
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw new Error('Authentication error');

            const { data: message, error } = await supabase
                .from('messages')
                .insert({
                    thread_id: threadId,
                    sender_type: 'user',
                    content,
                    created_at: new Date().toISOString(),
                })
                .select()
                .single();

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