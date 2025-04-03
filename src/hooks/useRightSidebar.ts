import { useContext } from 'react';
import { RightSidebarContext } from '@/contexts/RightSidebarContext';
import { useThreadMessages } from '@/hooks/useThreads';
import { Message, Thread } from '@/types/thread';

interface ThreadMessagesState {
    selectedThreadId: string | undefined;
    setSelectedThreadId: (threadId: string) => void;
    threads: Thread[] | undefined;
    threadsLoading: boolean;
    sendMessage: (content: string) => Promise<void>;
    messageSending: boolean;
    messages: Message[];
    messagesLoading: boolean;
}

export function useRightSidebar() {
    const context = useContext(RightSidebarContext);
    if (context === undefined) {
        throw new Error('useRightSidebar must be used within a RightSidebarProvider');
    }

    const { currentCharacter, contentType, setContentType, setCurrentCharacter } = context;

    const getThreadMessages = (): ThreadMessagesState => {
        const { selectedThreadId, setSelectedThreadId, threads, threadsLoading, sendMessage, isSending } = context;

        const { data: messages, isLoading: messagesLoading } = useThreadMessages(selectedThreadId);

        return {
            selectedThreadId,
            setSelectedThreadId,
            threads,
            threadsLoading,
            sendMessage,
            messageSending: isSending,
            messages: messages || [],
            messagesLoading,
        };
    };

    return {
        // Context state
        currentCharacter,
        contentType,
        setContentType,
        setCurrentCharacter,

        // Thread and message functionality
        getThreadMessages,
    };
} 