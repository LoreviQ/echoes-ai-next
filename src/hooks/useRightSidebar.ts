import { useContext } from 'react';
import { RightSidebarContext } from '@/contexts/RightSidebarContext';
import { useThreadMessages, useSelectedThread } from '@/hooks/useThreads';

export function useRightSidebar() {
    const context = useContext(RightSidebarContext);
    if (context === undefined) {
        throw new Error('useRightSidebar must be used within a RightSidebarProvider');
    }

    const { currentCharacter, contentType, setContentType, setCurrentCharacter } = context;

    const {
        selectedThreadId,
        setSelectedThreadId,
        threads,
        isLoading: threadsLoading,
        sendMessage,
        isSending: messageSending
    } = useSelectedThread(currentCharacter?.id);

    const { data: messages, isLoading: messagesLoading } = useThreadMessages(selectedThreadId);

    return {
        // Context state
        currentCharacter,
        contentType,
        setContentType,
        setCurrentCharacter,

        // Thread and message state
        selectedThreadId,
        setSelectedThreadId,
        threads,
        threadsLoading,
        sendMessage,
        messageSending,
        messages: messages || [],
        messagesLoading,
    };
} 