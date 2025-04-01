"use client"

import { DocumentIcon, SettingsIcon, SearchIcon } from '@/assets/icons';
import { CircleActionButton } from '@/components/buttons/CircleActionButton';

export function CharacterActions() {
    return (
        <div className="w-full h-[75px] flex justify-end items-center px-4">
            <div className="flex gap-2">
                <CircleActionButton
                    onClick={() => { }}
                    icon={DocumentIcon}
                    className="bg-black border border-white text-white hover:bg-zinc-900"
                />
                <CircleActionButton
                    onClick={() => { }}
                    icon={SettingsIcon}
                    className="bg-black border border-white text-white hover:bg-zinc-900"
                />
                <CircleActionButton
                    onClick={() => { }}
                    icon={SearchIcon}
                    className="bg-black border border-white text-white hover:bg-zinc-900"
                />
            </div>
        </div>
    );
} 