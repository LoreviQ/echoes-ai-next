'use client'

import React, { useState } from "react";
import { SearchIcon, HamburgerIcon } from "@/assets/icons";
import { CircleActionButton } from "@/components/buttons/CircleActionButton";
import { setCookie } from 'nookies';
import { useRightSidebar } from "@/hooks/useRightSidebar";
import { SidebarContentType } from "@/contexts/RightSidebarContext";
import { ThoughtsContent } from "@/components/content/character/Thoughts";
import { EventsContent } from "@/components/content/character/Events";
import { MessagesContent } from "@/components/content/character/Messages";
import { DescriptionContent } from "@/components/content/character/Description";

interface RightSidebarProps {
    initialExpanded?: boolean;
}

export default function RightSidebar({ initialExpanded = false }: RightSidebarProps) {
    const [isExpanded, setIsExpanded] = useState(initialExpanded);
    const { contentType } = useRightSidebar();

    const toggleSidebar = () => {
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState);
        setCookie(null, 'right_sidebar_expanded', String(newExpandedState), {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        });
    };

    const renderContent = () => {
        switch (contentType) {
            case SidebarContentType.THOUGHTS:
                return <ThoughtsContent />;
            case SidebarContentType.EVENTS:
                return <EventsContent />;
            case SidebarContentType.MESSAGES:
                return <MessagesContent />;
            case SidebarContentType.DESCRIPTION:
                return <DescriptionContent />;
            default:
                return null;
        }
    };

    return (
        <div className={`bg-black text-white ${isExpanded ? 'w-full' : 'w-[340px]'} h-screen transition-all duration-300 border-l border-zinc-600`}>
            <SidebarHeader isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
            {renderContent()}
        </div>
    );
}

function SidebarHeader({ isExpanded, toggleSidebar }: { isExpanded: boolean, toggleSidebar: () => void }) {
    return (
        <div className={`py-4 pl-4 ${isExpanded ? 'pr-10' : ''} flex items-center gap-2 w-full`}>
            <CircleActionButton
                icon={HamburgerIcon}
                onClick={toggleSidebar}
                className="text-zinc-400 hover:bg-zinc-800/50"
                size="lg"
            />
            <div className="relative group w-full">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400 transition-colors duration-200 group-focus-within:text-white" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-black border border-zinc-600 rounded-xl py-2 pl-10 pr-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200"
                />
            </div>
        </div>
    );
}