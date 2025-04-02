import React from 'react';
import { useRightSidebar } from "@/contexts/RightSidebarContext";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

export function DescriptionContent() {
    const { currentCharacter } = useRightSidebar();

    if (!currentCharacter) {
        return (
            <div className="p-4 border border-zinc-700 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Character Description</h3>
                <p className="text-zinc-400">No character selected.</p>
            </div>
        );
    }

    return (
        <div className="p-4 border border-zinc-700 rounded-lg">
            <h3 className="text-xl font-bold mb-3">{currentCharacter.name || 'Character'}</h3>
            <div className="mt-4">
                <MarkdownContent
                    content={currentCharacter.description || "This character doesn't have a description yet!"}
                    className="text-white"
                />
            </div>
        </div>
    );
} 