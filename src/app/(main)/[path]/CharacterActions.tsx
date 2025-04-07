"use client"

import { DocumentIcon, SettingsIcon, SpeechBubbleIcon, ThoughtBubbleIcon, ExclamationIcon } from '@/assets';
import { CircleActionButton } from '@/components/buttons';
import { Dropdown, DropdownItem } from '@/components/ui';
import { useRightSidebar, SidebarContentType } from '@/contexts';
import { uiHook, queryHook } from '@/hooks';
import type { Character } from 'echoes-shared/types';

interface CharacterActionsProps {
    character: Character;
    isOwner: boolean;
}

export function CharacterActions({ character, isOwner }: CharacterActionsProps) {
    const { mutate: createPost, isPending } = queryHook.useCreatePost();
    const { isOpen, toggle, dropdownRef } = uiHook.useDropdown();
    const { setContentType, setCurrentCharacter } = useRightSidebar();
    const { invalidateThreads } = queryHook.useThreadsInvalidation();

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
                                    <DropdownItem onClick={() => {
                                        setCurrentCharacter(character);
                                        setContentType(SidebarContentType.ADVANCED_SETTINGS);
                                    }}>
                                        Advanced Settings
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