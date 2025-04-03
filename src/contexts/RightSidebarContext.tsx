'use client'

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Character } from '@/types/character';
import { useCharacter } from '@/hooks/useCharacters';

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
}

export const RightSidebarContext = createContext<RightSidebarContextType>({
    contentType: SidebarContentType.NONE,
    setContentType: () => { },
    currentCharacter: null,
    setCurrentCharacter: () => { }
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
    const [contentType, setContentType] = useState<SidebarContentType>(initialContentType);
    const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);

    // Use the useCharacter hook to fetch the initial character
    const { data: initialCharacter } = useCharacter(initialCharacterId);

    // Initialize character from the fetched data
    useEffect(() => {
        if (initialCharacter && !currentCharacter) {
            setCurrentCharacter(initialCharacter);
        }
    }, [initialCharacter]);

    // Update cookies when content type or character changes
    useEffect(() => {
        document.cookie = `sidebar_content_type=${contentType};path=/;max-age=31536000`;
        if (currentCharacter) {
            document.cookie = `current_character=${currentCharacter.id};path=/;max-age=31536000`;
        } else {
            document.cookie = `current_character=;path=/;max-age=0`;
        }
    }, [contentType, currentCharacter]);

    return (
        <RightSidebarContext.Provider value={{
            contentType,
            setContentType,
            currentCharacter,
            setCurrentCharacter
        }}>
            {children}
        </RightSidebarContext.Provider>
    );
} 