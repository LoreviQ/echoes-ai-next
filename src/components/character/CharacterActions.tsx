"use client"

import { DocumentIcon, SettingsIcon, SearchIcon } from '@/assets/icons';
import { CircleActionButton } from '@/components/buttons/CircleActionButton';
import { useCreatePost } from '@/hooks/usePosts';

interface CharacterActionsProps {
    characterId: string;
}

export function CharacterActions({ characterId }: CharacterActionsProps) {
    const { mutate: createPost, isPending } = useCreatePost();

    const handleGeneratePost = () => {
        if (isPending) return;
        createPost(characterId);
    };

    return (
        <div className="w-full h-[75px] flex justify-end items-center px-4">
            <div className="flex gap-2">
                <CircleActionButton
                    onClick={handleGeneratePost}
                    icon={DocumentIcon}
                    tooltip="Generate a Post"
                    className={`bg-black border border-white text-white ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-900'}`}
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