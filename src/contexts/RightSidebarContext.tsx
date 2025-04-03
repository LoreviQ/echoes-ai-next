'use client'

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Character } from '@/types/character';
import { useCharacter } from '@/hooks/useCharacters';
import { useThreads } from '@/hooks/useThreads';
import { useCreateMessage } from '@/hooks/useThreads';
import { Thread } from '@/types/thread';
// Define possible content types for the sidebar
export enum SidebarContentType {
    NONE = 'none',
    THOUGHTS = 'thoughts',
    EVENTS = 'events',
    MESSAGES = 'messages',
    DESCRIPTION = 'description'
}

export interface RightSidebarContextType {
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

export const RightSidebarContext = createContext<RightSidebarContextType>({
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
    const [currentCharacter, setCurrentCharacter] = useState<Character | null>(initialCharacter ? initialCharacter : null);
    const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(undefined);

    // Move useThreads to the top level and make it depend on the currentCharacter
    const { data: threads = [], isLoading: threadsLoading } = useThreads(currentCharacter?.id || '');
    const createMessageMutation = useCreateMessage();

    // Update cookies when content type or character changes
    useEffect(() => {
        document.cookie = `sidebar_content_type=${contentType};path=/;max-age=31536000`;
        if (currentCharacter) {
            document.cookie = `current_character=${currentCharacter.id};path=/;max-age=31536000`;
        } else {
            document.cookie = `current_character=;path=/;max-age=0`;
        }
    }, [contentType, currentCharacter]);

    // Save selected thread ID to cookie
    useEffect(() => {
        if (selectedThreadId) {
            document.cookie = `selected_thread=${selectedThreadId};path=/;max-age=31536000`;
        } else {
            document.cookie = `selected_thread=;path=/;max-age=0`;
        }
    }, [selectedThreadId]);

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