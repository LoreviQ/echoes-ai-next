import { useQuery, useQueryClient } from '@tanstack/react-query';
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
    return useQuery({
        queryKey: ['threads', characterId],
        queryFn: () => fetchThreads(characterId!),
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