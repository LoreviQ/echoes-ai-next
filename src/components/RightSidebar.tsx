"use client";

import React from "react";
import { SearchIcon, PlusIcon } from "@/assets/icons";
import { ActionButton } from "@/components/buttons/ActionButton";
import { useModal } from "@/hooks/useModal";
import { CreateCharacterForm } from "@/components/forms/CreateCharacter";
import { useSession } from "@/contexts/session.client";

export default function RightSidebar() {
    const { Modal, setIsOpen } = useModal();
    const { active: isLoggedIn } = useSession();

    const handleCreateClick = () => {
        if (!isLoggedIn) {
            alert('You must be logged in to create a character');
            return;
        }

        setIsOpen(true);
    };

    return (
        <div className="pt-4 pl-10 bg-black text-white w-340px h-screen transition-all duration-300 border-l border-gray-600">
            <div className="space-y-4">
                <Search />
                <ActionButton
                    label="Create a Character"
                    icon={PlusIcon}
                    onClick={handleCreateClick}
                    className="w-full"
                />
            </div>

            <Modal title="Create a New Character">
                <CreateCharacterForm setIsModalOpen={setIsOpen} />
            </Modal>
        </div>
    );
}

function Search() {
    return (
        <div className="relative group">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-200 group-focus-within:text-white" />
            <input
                type="text"
                placeholder="Search..."
                className="w-full bg-black border border-gray-600 rounded-xl py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors duration-200"
            />
        </div>
    );
}