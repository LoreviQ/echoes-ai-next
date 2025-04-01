"use client"

import { DocumentIcon, SettingsIcon, SearchIcon } from '@/assets/icons';
import { CircleActionButton } from '@/components/buttons/CircleActionButton';
import { useCreatePost } from '@/hooks/usePosts';
import { useDropdown } from '@/hooks/useDropdown';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { useModal } from '@/hooks/useModal';
import { Character } from '@/types/character';

interface CharacterActionsProps {
    character: Character;
}

export function CharacterActions({ character }: CharacterActionsProps) {
    const { mutate: createPost, isPending } = useCreatePost();
    const { isOpen, toggle, dropdownRef } = useDropdown();
    const { getModal, setIsOpen: setDescriptionModalOpen } = useModal();
    const { Modal: DescriptionModal } = getModal('Character Description');

    const handleGeneratePost = () => {
        if (isPending) return;
        createPost(character.id);
    };

    return (
        <>
            <div className="w-full h-[75px] flex justify-end items-center px-4">
                <div className="flex gap-2">
                    <CircleActionButton
                        onClick={() => setDescriptionModalOpen(true)}
                        icon={DocumentIcon}
                        tooltip="Show Character Description"
                        className="bg-black border border-white text-white hover:bg-zinc-900"
                    />
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
                    <CircleActionButton
                        onClick={() => { }}
                        icon={SearchIcon}
                        className="bg-black border border-white text-white hover:bg-zinc-900"
                    />
                </div>
            </div>
            <DescriptionModal>
                <div className="text-white whitespace-pre-wrap">
                    {character.description || "This character doesn't have a description yet!"}
                </div>
            </DescriptionModal>
        </>
    );
} 