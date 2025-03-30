"use client";

import React, { useState } from "react";
import { SearchIcon, PlusIcon } from "@/assets/icons";
import { ActionButton } from "@/components/buttons/ActionButton";
import { Modal } from "@/components/Modal";
import { CreateCharacterForm } from "@/components/forms/CreateCharacter";

export default function RightSidebar() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateCharacter = (data: { name: string; description: string }) => {
        console.log('Character data:', data);
        // TODO: Handle character creation
        setIsModalOpen(false);
    };

    return (
        <div className="pt-4 pl-10 bg-black text-white w-340px h-screen transition-all duration-300 border-l border-gray-600">
            <div className="space-y-4">
                <Search />
                <ActionButton
                    label="Create a Character"
                    icon={PlusIcon}
                    onClick={() => setIsModalOpen(true)}
                    className="w-full"
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create a New Character"
            >
                <CreateCharacterForm onSubmit={handleCreateCharacter} />
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