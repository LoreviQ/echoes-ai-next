'use client';

import React from 'react';
import { useRightSidebar } from "@/contexts/rightSidebar";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

export function useAdvancedSettingsContent() {
    const { currentCharacter } = useRightSidebar();

    if (!currentCharacter) {
        return {
            header: (
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Advanced Settings</h3>
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
            <h3 className="text-xl font-bold">Advanced Settings</h3>
        </div>
    );

    const content = (
        <div className="p-4">
            <MarkdownContent
                content={"ADVANCED SETTINGS"}
                className="text-white"
            />
        </div>
    );

    return {
        header,
        content
    };
} 