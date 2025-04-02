import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase.client';
import { Thread, Message } from '@/types/thread';

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