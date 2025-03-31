"use client";

import React, { useState } from "react";
import { CollapsableActionButton } from "./CollapsableActionButton";
import { LoginIcon } from "@/assets/icons";
import { createClient } from "@/utils/supabase.client";

interface UserButtonProps {
    user: {
        avatar_url?: string;
        name?: string;
        email?: string;
        [key: string]: any;
    };
}

export function UserButton({ user }: UserButtonProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    return (
        <div className="relative">
            <Button onClick={() => setIsDropdownOpen(!isDropdownOpen)} user={user} />
            {isDropdownOpen && (
                <Dropdown />
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

function Dropdown() {
    return (
        <div className="absolute bottom-full mb-2 min-w-[100%] w-max bg-black border border-white rounded-xl p-4 text-white flex justify-center">
            <CollapsableActionButton
                label="Logout"
                icon={LoginIcon}
                onClick={logout}
            />
        </div>
    );
}

function logout() {
    const supabase = createClient();
    supabase.auth.signOut();
}