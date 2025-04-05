'use client';

import { useState } from "react";
import { NavButton, ActionButton } from "@/components/buttons";
import { UserSection } from "@/components/ui";
import { TypefaceOutlined, HomeIcon, DocumentIcon, SettingsIcon, PlusIcon, UserGroupIcon } from "@/assets";
import { useModal } from "@/hooks/ui/useModal";
import { CreateCharacterForm } from "@/components/forms/CreateCharacter";
import { useSession } from "@/contexts/session.client";
import { setPreference } from "@/utils/preferences";

const navigationItems = [
    {
        label: "Home",
        path: "/home",
        icon: HomeIcon,
    },
    {
        label: "Notifications",
        path: "/notifications",
        icon: DocumentIcon,
    },
    {
        label: "Settings",
        path: "/settings",
        icon: SettingsIcon,
    },
    {
        label: "Characters",
        path: "/characters",
        icon: UserGroupIcon,
    }
];

interface LeftSidebarProps {
    initialExpanded?: boolean;
}

export default function LeftSidebar({ initialExpanded = true }: LeftSidebarProps) {
    const [isExpanded, setIsExpanded] = useState(initialExpanded);
    const { getModal, setIsOpen } = useModal();
    const { Modal } = getModal("Create a New Character", "/create-character");
    const { active: isLoggedIn } = useSession();

    const toggleSidebar = () => {
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState);
        setPreference('leftSidebarExpanded', newExpandedState);
    };

    const handleCreateClick = () => {
        if (!isLoggedIn) {
            alert('You must be logged in to create a character');
            return;
        }
        setIsOpen(true);
    };

    return (
        <div className={`hidden sm:flex transition-all duration-300 ${!isExpanded ? 'sm:flex-1 sm:justify-end' : ''}`}>
            <div className="hidden sm:block">
                <div className={`bg-black text-white w-[84px] xl:w-[280px] h-screen transition-all duration-300 border-r border-zinc-600 flex flex-col`}>
                    <div className="p-4 flex-1 overflow-y-auto">
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <TypefaceOutlined
                                    text="EchoesAI"
                                    outlineColour="white"
                                    className="hidden xl:block text-5xl"
                                    onClick={toggleSidebar}
                                />
                                <TypefaceOutlined
                                    text="EAI"
                                    outlineColour="white"
                                    className="xl:hidden text-3xl"
                                    onClick={toggleSidebar}
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                {navigationItems.map((item) => (
                                    <div key={item.path} className="w-full">
                                        <NavButton
                                            label={item.label}
                                            path={item.path}
                                            icon={item.icon}
                                            className="w-full"
                                        />
                                    </div>
                                ))}
                                <ActionButton
                                    label="Create a Character"
                                    icon={PlusIcon}
                                    onClick={handleCreateClick}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                    <UserSection />
                    <Modal>
                        <CreateCharacterForm onSuccess={() => setIsOpen(false)} modal={true} />
                    </Modal>
                </div>
            </div>
        </div>
    );
} 