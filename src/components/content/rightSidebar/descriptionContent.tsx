'use client';

import React from 'react';
import dynamic from 'next/dynamic';

import { useRightSidebar } from "@/contexts";
import { MarkdownContent, CharacterIdentity } from "@/components/ui";
import { PenSquareIcon, CheckSquareIcon } from "@/assets";

const DescriptionHeaderComponent = () => {
    const { currentCharacter, editCharacter, toggleEdit } = useRightSidebar();
    if (!currentCharacter) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 mx-4">
            <CharacterIdentity character={currentCharacter} />
            <button
                onClick={toggleEdit}
                className="text-zinc-500 hover:text-white transition-colors"
            >
                {editCharacter ? (
                    <CheckSquareIcon className="w-6 h-6" />
                ) : (
                    <PenSquareIcon className="w-6 h-6" />
                )}
            </button>
        </div>
    );
};

const DescriptionContentComponent = () => {
    const { editCharacter } = useRightSidebar();

    return (
        editCharacter ? <EditableDescription /> : <ReadableDescription />
    );
};

const ReadableDescription = () => {
    const { currentCharacter } = useRightSidebar();

    if (!currentCharacter) {
        return null;
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
            <h1 className="text-2xl font-bold">Appearance</h1>
            <div className="p-4">
                <MarkdownContent
                    content={currentCharacter.appearance || "This character doesn't have an appearance yet!"}
                    className="text-white"
                />
            </div>
        </div>
    );
}

const EditableDescription = () => {
    const { currentCharacter } = useRightSidebar();

    if (!currentCharacter) {
        return null;
    }

    const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    // Set initial height on mount
    React.useEffect(() => {
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        });
    }, [currentCharacter]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Description</h1>
            <div className="p-4">
                <textarea
                    value={currentCharacter.description || ""}
                    placeholder="Write your character's description here..."
                    onChange={adjustTextareaHeight}
                    className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 min-h-[100px] resize-none overflow-hidden"
                />
            </div>
            <h1 className="text-2xl font-bold">Appearance</h1>
            <div className="p-4">
                <textarea
                    value={currentCharacter.appearance || ""}
                    placeholder="Write your character's appearance here..."
                    onChange={adjustTextareaHeight}
                    className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 min-h-[100px] resize-none overflow-hidden"
                />
            </div>
        </div>
    );
}

export const DescriptionHeader = dynamic(
    () => Promise.resolve(DescriptionHeaderComponent),
    { ssr: false }
);

export const DescriptionContent = dynamic(
    () => Promise.resolve(DescriptionContentComponent),
    { ssr: false }
); 