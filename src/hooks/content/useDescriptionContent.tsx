'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useRightSidebar } from "@/contexts/rightSidebar";
import { HeaderLoading } from '@/components/ui/loading';
import { MarkdownContent } from "@/components/ui/MarkdownContent";

// Note: This component needs the RightSidebar context, so we'll keep it as a proper component
const DescriptionHeaderComponent = () => {
    const { currentCharacter } = useRightSidebar();

    if (!currentCharacter) {
        return (
            <div className="mt-4 px-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Character Description</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-4 px-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{currentCharacter.name || 'Character'}</h3>
            </div>
        </div>
    );
};

const DescriptionContentComponent = () => {
    const { currentCharacter } = useRightSidebar();

    if (!currentCharacter) {
        return (
            <div className="p-4">
                <p className="text-zinc-400">No character selected.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <MarkdownContent
                content={currentCharacter.description || "This character doesn't have a description yet!"}
                className="text-white"
            />
        </div>
    );
};

export const DescriptionHeader = dynamic(
    () => Promise.resolve(DescriptionHeaderComponent),
    { ssr: false }
);

export const DescriptionContent = dynamic(
    () => Promise.resolve(DescriptionContentComponent),
    { ssr: false }
); 