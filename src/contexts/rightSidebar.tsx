'use client'

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Character } from '@/types/character';
import { useCharacter } from '@/hooks/reactQuery/useCharacters';
import { useThreads } from '@/hooks/reactQuery/useThreads';
import { useCreateMessage } from '@/hooks/reactQuery/useThreads';
import { Thread } from '@/types/thread';
import { useThreadMessages } from '@/hooks/reactQuery/useThreads';
import { Message } from '@/types/thread';
import { useContext } from 'react';
import { setPreference } from "@/utils/preferences";

// Define possible content types for the sidebar
export enum SidebarContentType {
    NONE = 'none',
    THOUGHTS = 'thoughts',
    EVENTS = 'events',
    MESSAGES = 'messages',
    DESCRIPTION = 'description',
    ADVANCED_SETTINGS = 'advanced_settings'
}

interface RightSidebarContextType {
    contentType: SidebarContentType;
    setContentType: (type: SidebarContentType) => void;
    currentCharacter: Character | null;
    setCurrentCharacter: (character: Character | null) => void;
    selectedThreadId: string | undefined;
    setSelectedThreadId: (threadId: string | undefined) => void;
    threads: Thread[];
    threadsLoading: boolean;
    sendMessage: (content: string) => Promise<void>;
    isSending: boolean;
}

const RightSidebarContext = createContext<RightSidebarContextType>({
    contentType: SidebarContentType.NONE,
    setContentType: () => { },
    currentCharacter: null,
    setCurrentCharacter: () => { },
    selectedThreadId: undefined,
    setSelectedThreadId: () => { },
    threads: [],
    threadsLoading: false,
    sendMessage: async () => { },
    isSending: false
});

export function RightSidebarProvider({
    children,
    initialContentType = SidebarContentType.NONE,
    initialCharacterId = ''
}: {
    children: ReactNode;
    initialContentType?: SidebarContentType;
    initialCharacterId?: string;
}) {
    // Use the useCharacter hook to fetch the initial character
    const { data: initialCharacter } = useCharacter(initialCharacterId);
    const [contentType, setContentType] = useState<SidebarContentType>(initialContentType);
    const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);

    // Update currentCharacter when initialCharacter becomes available
    useEffect(() => {
        if (initialCharacter) {
            setCurrentCharacter(initialCharacter);
        }
    }, [initialCharacter]);

    const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(undefined);

    // Move useThreads to the top level and make it depend on the currentCharacter
    const { data: threads = [], isLoading: threadsLoading } = useThreads(currentCharacter?.id || '');
    const createMessageMutation = useCreateMessage();

    // Update cookies when content type or character changes
    useEffect(() => {
        setPreference('sidebarContentType', contentType);
        if (currentCharacter) {
            setPreference('currentCharacter', currentCharacter.id);
        } else {
            setPreference('currentCharacter', '');
        }
    }, [contentType, currentCharacter]);

    // Reset selectedThreadId when character changes
    useEffect(() => {
        // When character changes, reset the selected thread
        setSelectedThreadId(undefined);
    }, [currentCharacter?.id]);

    // When threads load or change, select the most recent thread
    useEffect(() => {
        if (!threadsLoading && threads && threads.length > 0 && !selectedThreadId) {
            setSelectedThreadId(threads[0].id);
        }
    }, [threads, threadsLoading, selectedThreadId, currentCharacter]);

    const sendMessage = React.useCallback(async (content: string) => {
        if (!selectedThreadId) {
            throw new Error('No thread selected');
        }
        return createMessageMutation.mutateAsync({ threadId: selectedThreadId, content });
    }, [selectedThreadId, createMessageMutation]);

    return (
        <RightSidebarContext.Provider value={{
            contentType,
            setContentType,
            currentCharacter,
            setCurrentCharacter,
            selectedThreadId,
            setSelectedThreadId,
            threads,
            threadsLoading,
            sendMessage,
            isSending: createMessageMutation.isPending
        }}>
            {children}
        </RightSidebarContext.Provider>
    );
}

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