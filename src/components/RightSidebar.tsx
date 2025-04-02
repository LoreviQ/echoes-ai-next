'use client'

import React, { useState } from "react";
import { SearchIcon, HamburgerIcon } from "@/assets/icons";
import { CircleActionButton } from "@/components/buttons/CircleActionButton";

export default function RightSidebar() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`pt-4 pl-4 bg-black text-white ${isExpanded ? 'w-full pr-10' : 'w-[340px]'} h-screen transition-all duration-300 border-l border-zinc-600`}>
            <div className="flex items-center gap-2 w-full">
                <CircleActionButton
                    icon={HamburgerIcon}
                    onClick={() => {
                        console.log('Expanding sidebar:', !isExpanded);
                        setIsExpanded(!isExpanded);
                    }}
                    className="text-zinc-400 hover:bg-zinc-800/50"
                    size="lg"
                />
                <Search />
            </div>
        </div>
    );
}

function Search() {
    return (
        <div className="relative group w-full">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400 transition-colors duration-200 group-focus-within:text-white" />
            <input
                type="text"
                placeholder="Search..."
                className="w-full bg-black border border-zinc-600 rounded-xl py-2 pl-10 pr-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200"
            />
        </div>
    );
}