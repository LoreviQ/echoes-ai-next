'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
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

export function RightSidebarProvider({ children }: { children: ReactNode }) {
    const [contentType, setContentType] = useState<SidebarContentType>(SidebarContentType.THOUGHTS);
    const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);

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