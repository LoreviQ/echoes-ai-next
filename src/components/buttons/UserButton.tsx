"use client";

import React from "react";
import { CollapsableActionButton } from "./CollapsableActionButton";
import { LoginIcon, ExclamationIcon } from "@/assets/icons";
import { useDropdown } from "@/hooks/ui/useDropdown";
import { Dropdown } from "@/components/ui/Dropdown";
import { logout } from "@/utils/authUtils";
import { debug } from "@/utils/debug";

interface UserButtonProps {
    user: {
        avatar_url?: string;
        name?: string;
        email?: string;
        [key: string]: any;
    };
}

export function UserButton({ user }: UserButtonProps) {
    const { isOpen, toggle, dropdownRef } = useDropdown();

    return (
        <div className="relative" ref={dropdownRef}>
            <Button onClick={toggle} user={user} />
            {isOpen && (
                <Dropdown align="left" className="mb-2 bottom-full w-full">
                    <CollapsableActionButton
                        label="Logout"
                        icon={LoginIcon}
                        onClick={() => logout()}
                        className="w-full"
                    />
                    <CollapsableActionButton
                        label="Debug"
                        icon={ExclamationIcon}
                        onClick={() => debug()}
                        className="w-full hover:bg-red-900"
                        tooltip="Does random things I'm implementing. Don't press if you're a user lol"
                    />
                </Dropdown>
            )}
        </div>
    );
}

function Button({ onClick, user }: { onClick: () => void, user: { avatar_url?: string, name?: string, email?: string } }) {
    return (
        <button
            onClick={onClick}
            className={`
                    inline-flex items-center p-2 rounded-xl transition-colors
                    bg-black text-white
                    hover:bg-zinc-600
                    w-full
                `}
        >
            <div className="w-8 h-8 flex items-center justify-center">
                {user.avatar_url ? (
                    <img
                        src={user.avatar_url}
                        alt={user.name || 'User avatar'}
                        className="w-full h-full rounded-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full rounded-full bg-zinc-600 flex items-center justify-center">
                        <span className="text-sm">?</span>
                    </div>
                )}
            </div>
            <div className="hidden xl:block ml-3 text-left">
                <div className="font-bold">{user.name || 'User'}</div>
                <div className="text-sm text-zinc-300">{user.email || ''}</div>
            </div>
        </button>
    );
}