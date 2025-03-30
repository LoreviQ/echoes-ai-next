"use client";

import React from "react";

interface UserButtonProps {
    user: {
        avatar_url?: string;
        name?: string;
        email?: string;
        [key: string]: any;
    };
}

export function UserButton({ user }: UserButtonProps) {
    return (
        <button
            className={`
                inline-flex items-center p-2 rounded-xl transition-colors
                bg-black text-white
                hover:bg-gray-600
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
                    <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center">
                        <span className="text-sm">?</span>
                    </div>
                )}
            </div>
            <div className="ml-3 text-left">
                <div className="font-bold">{user.name || 'User'}</div>
                <div className="text-sm text-gray-300">{user.email || ''}</div>
            </div>
        </button>
    );
} 