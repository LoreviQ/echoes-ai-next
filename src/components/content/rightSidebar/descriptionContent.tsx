'use client';

import React from 'react';
import dynamic from 'next/dynamic';

import { useRightSidebar } from "@/contexts";
import { MarkdownContent, CharacterIdentity } from "@/components/ui";

const DescriptionHeaderComponent = () => {
    const { currentCharacter } = useRightSidebar();
    if (!currentCharacter) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 mx-4">
            <CharacterIdentity character={currentCharacter} />
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
            <h1 className="text-2xl font-bold">Description</h1>
            <div className="p-4">
                <MarkdownContent
                    content={currentCharacter.description || "This character doesn't have a description yet!"}
                    className="text-white"
                />
            </div>
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