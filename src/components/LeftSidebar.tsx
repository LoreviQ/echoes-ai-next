'use client';

import { NavButton } from "@/components/buttons/NavButton";
import { ActionButton } from "@/components/buttons/ActionButton";
import { TypefaceOutlined } from "@/components/branding";
import UserSection from "@/components/UserSection";
import { HomeIcon, DocumentIcon, SettingsIcon, PlusIcon } from "@/assets/icons";
import { useModal } from "@/hooks/useModal";
import { CreateCharacterForm } from "@/components/forms/CreateCharacter";
import { useSession } from "@/contexts/session.client";


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
];

export default function LeftSidebar() {
    const { getModal, setIsOpen } = useModal();
    const { Modal } = getModal("Create a New Character");
    const { active: isLoggedIn } = useSession();

    const handleCreateClick = () => {
        if (!isLoggedIn) {
            alert('You must be logged in to create a character');
            return;
        }
        setIsOpen(true);
    };

    return (
        <div className={`bg-black text-white w-[84px] xl:w-[280px] h-screen transition-all duration-300 border-r border-gray-600 flex flex-col`}>
            <div className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-4">
                    <TypefaceOutlined
                        text="EchoesAI"
                        path="/"
                        outlineColour="white"
                        className="hidden xl:block text-5xl"
                    />
                    <TypefaceOutlined
                        text="EAI"
                        path="/"
                        outlineColour="white"
                        className="xl:hidden text-3xl"
                    />
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
                <CreateCharacterForm onSuccess={() => setIsOpen(false)} />
            </Modal>
        </div>
    );
} 