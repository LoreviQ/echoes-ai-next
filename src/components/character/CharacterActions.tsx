"use client"

import { DocumentIcon, SettingsIcon, SearchIcon } from '@/assets/icons';
import { CircleActionButton } from '@/components/buttons/CircleActionButton';
import { generateCharacterPost } from '@/utils/api';
import { useState } from 'react';

interface CharacterActionsProps {
    characterId: string;
}

export function CharacterActions({ characterId }: CharacterActionsProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGeneratePost = async () => {
        if (isGenerating) return;

        try {
            setIsGenerating(true);
            await generateCharacterPost(characterId);
            // Could add success notification here
        } catch (error) {
            console.error('Failed to generate post:', error);
            // Could add error notification here
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full h-[75px] flex justify-end items-center px-4">
            <div className="flex gap-2">
                <CircleActionButton
                    onClick={handleGeneratePost}
                    icon={DocumentIcon}
                    tooltip="Generate a Post"
                    className={`bg-black border border-white text-white ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-900'}`}
                />
                <CircleActionButton
                    onClick={() => { }}
                    icon={SettingsIcon}
                    className="bg-black border border-white text-white hover:bg-zinc-900"
                />
                <CircleActionButton
                    onClick={() => { }}
                    icon={SearchIcon}
                    className="bg-black border border-white text-white hover:bg-zinc-900"
                />
            </div>
        </div>
    );
} 