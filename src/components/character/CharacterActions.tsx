"use client"

import { DocumentIcon, SettingsIcon, SpeechBubbleIcon, ThoughtBubbleIcon, ExclamationIcon } from '@/assets/icons';
import { CircleActionButton } from '@/components/buttons/CircleActionButton';
import { useCreatePost } from '@/hooks/reactQuery/usePosts';
import { useDropdown } from '@/hooks/ui/useDropdown';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { Character } from '@/types/character';
import { useRightSidebar, SidebarContentType } from '@/contexts/rightSidebar';
import { useThreadsInvalidation } from '@/hooks/reactQuery/useThreads';

interface CharacterActionsProps {
    character: Character;
    isOwner: boolean;
}

export function CharacterActions({ character, isOwner }: CharacterActionsProps) {
    const { mutate: createPost, isPending } = useCreatePost();
    const { isOpen, toggle, dropdownRef } = useDropdown();
    const { setContentType, setCurrentCharacter } = useRightSidebar();
    const { invalidateThreads } = useThreadsInvalidation();

    const handleGeneratePost = () => {
        if (isPending) return;
        createPost(character.id);
    };

    const showCharacterDescription = () => {
        setCurrentCharacter(character);
        setContentType(SidebarContentType.DESCRIPTION);
    };

    return (
        <>
            <div className="w-full h-[75px] flex justify-end items-center px-4">
                <div className="flex gap-2">
                    <CircleActionButton
                        onClick={showCharacterDescription}
                        icon={DocumentIcon}
                        tooltip="Show Character Description"
                        className="bg-black border border-white text-white hover:bg-zinc-900"
                    />
                    <CircleActionButton
                        onClick={() => {
                            setCurrentCharacter(character);
                            setContentType(SidebarContentType.THOUGHTS);
                        }}
                        icon={ThoughtBubbleIcon}
                        tooltip="Show Thoughts"
                        className="bg-black border border-white text-white hover:bg-zinc-900"
                    />
                    <CircleActionButton
                        onClick={() => {
                            setCurrentCharacter(character);
                            setContentType(SidebarContentType.EVENTS);
                        }}
                        icon={ExclamationIcon}
                        tooltip="Show Events"
                        className="bg-black border border-white text-white hover:bg-zinc-900"
                    />
                    <CircleActionButton
                        onClick={() => {
                            invalidateThreads(character.id);
                            setCurrentCharacter(character);
                            setContentType(SidebarContentType.MESSAGES);
                        }}
                        icon={SpeechBubbleIcon}
                        tooltip="Show Messages"
                        className="bg-black border border-white text-white hover:bg-zinc-900"
                    />
                    {isOwner && (
                        <div className="relative" ref={dropdownRef}>
                            <CircleActionButton
                                onClick={toggle}
                                icon={SettingsIcon}
                                tooltip="Character Actions"
                                className="bg-black border border-white text-white hover:bg-zinc-900"
                            />
                            {isOpen && (
                                <Dropdown className='w-50'>
                                    <DropdownItem onClick={handleGeneratePost}>
                                        Generate a Post
                                    </DropdownItem>
                                </Dropdown>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 