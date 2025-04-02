'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Character } from '@/types/character';

// Define possible content types for the sidebar
export enum SidebarContentType {
    THOUGHTS = 'thoughts',
    EVENTS = 'events',
    MESSAGES = 'messages',
    DESCRIPTION = 'description'
}

interface RightSidebarContextType {
    contentType: SidebarContentType;
    setContentType: (type: SidebarContentType) => void;
    currentCharacter: Character | null;
    setCurrentCharacter: (character: Character | null) => void;
}

const RightSidebarContext = createContext<RightSidebarContextType | undefined>(undefined);

export function RightSidebarProvider({
    children,
    initialContentType = SidebarContentType.THOUGHTS
}: {
    children: ReactNode;
    initialContentType?: SidebarContentType;
}) {
    const [contentType, setContentType] = useState<SidebarContentType>(initialContentType);
    const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);

    // Update cookie when content type changes
    useEffect(() => {
        document.cookie = `sidebar_content_type=${contentType};path=/;max-age=31536000`;
    }, [contentType]);

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

// Custom hook to use the context
export function useRightSidebar() {
    const context = useContext(RightSidebarContext);
    if (context === undefined) {
        throw new Error('useRightSidebar must be used within a RightSidebarProvider');
    }
    return context;
} 