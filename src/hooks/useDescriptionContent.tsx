'use client';

import React from 'react';
import { useRightSidebar } from "@/hooks/useRightSidebar";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

export function useDescriptionContent() {
    const { currentCharacter } = useRightSidebar();

    if (!currentCharacter) {
        return {
            header: (
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Character Description</h3>
                </div>
            ),
            content: (
                <div className="p-4">
                    <p className="text-zinc-400">No character selected.</p>
                </div>
            )
        };
    }

    const header = (
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{currentCharacter.name || 'Character'}</h3>
        </div>
    );

    const content = (
        <div className="p-4">
            <MarkdownContent
                content={currentCharacter.description || "This character doesn't have a description yet!"}
                className="text-white"
            />
        </div>
    );

    return {
        header,
        content
    };
} 