'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

import { useRightSidebar } from "@/contexts";
import { MarkdownContent, CharacterIdentity } from "@/components/ui";
import { PenSquareIcon, CheckSquareIcon } from "@/assets";

const DescriptionHeaderComponent = () => {
    const { currentCharacter, editCharacter, toggleEdit } = useRightSidebar();

    const handleClick = async () => {
        if (editCharacter) {
            // If we're in edit mode, trigger the submit handler
            await (window as any).__handleDescriptionSubmit?.();
        } else {
            // If we're not in edit mode, just toggle edit mode
            toggleEdit();
        }
    };

    if (!currentCharacter) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 mx-4">
            <CharacterIdentity character={currentCharacter} />
            <button
                onClick={handleClick}
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
    const { currentCharacter, updateDescription } = useRightSidebar();
    const [description, setDescription] = useState(currentCharacter?.description || "");
    const [appearance, setAppearance] = useState(currentCharacter?.appearance || "");

    // Reset form when character changes
    useEffect(() => {
        setDescription(currentCharacter?.description || "");
        setAppearance(currentCharacter?.appearance || "");
    }, [currentCharacter]);

    if (!currentCharacter) {
        return null;
    }

    const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        adjustTextareaHeight(e);
    };

    const handleAppearanceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAppearance(e.target.value);
        adjustTextareaHeight(e);
    };

    // Set initial height on mount
    React.useEffect(() => {
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        });
    }, [currentCharacter]);

    // Add submit handler to be called from header
    useEffect(() => {
        const handleSubmit = async () => {
            await updateDescription(description, appearance);
        };

        // Store the handler in a custom property on the window object
        (window as any).__handleDescriptionSubmit = handleSubmit;

        return () => {
            delete (window as any).__handleDescriptionSubmit;
        };
    }, [description, appearance, updateDescription]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Description</h1>
            <div className="p-4">
                <textarea
                    value={description}
                    placeholder="Write your character's description here..."
                    onChange={handleDescriptionChange}
                    className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 min-h-[100px] resize-none overflow-hidden"
                />
            </div>
            <h1 className="text-2xl font-bold">Appearance</h1>
            <div className="p-4">
                <textarea
                    value={appearance}
                    placeholder="Write your character's appearance here..."
                    onChange={handleAppearanceChange}
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