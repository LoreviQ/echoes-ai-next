'use client'

import React, { useState, useRef, useEffect } from "react";
import { SearchIcon, HamburgerIcon } from "@/assets/icons";
import { CircleActionButton } from "@/components/buttons/CircleActionButton";
import { setCookie } from 'nookies';
import { useRightSidebar, SidebarContentType } from "@/contexts/rightSidebar";
import { useThoughtsContent } from "@/hooks/content/useThoughtsContent";
import { useEventsContent } from "@/hooks/content/useEventsContent";
import { useMessagesContent } from "@/hooks/content/useMessagesContent";
import { useDescriptionContent } from "@/hooks/content/useDescriptionContent";

interface RightSidebarProps {
    initialExpanded?: boolean;
}

export default function RightSidebar({ initialExpanded = false }: RightSidebarProps) {
    const [isExpanded, setIsExpanded] = useState(initialExpanded);
    const { contentType } = useRightSidebar();
    const headerRef = useRef<HTMLDivElement>(null);

    // Get content hooks
    const thoughtsContent = useThoughtsContent();
    const eventsContent = useEventsContent();
    const messagesContent = useMessagesContent();
    const descriptionContent = useDescriptionContent();

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
                return thoughtsContent.content;
            case SidebarContentType.EVENTS:
                return eventsContent.content;
            case SidebarContentType.MESSAGES:
                return messagesContent.content;
            case SidebarContentType.DESCRIPTION:
                return descriptionContent.content;
            default:
                return null;
        }
    };

    const renderHeaderContent = () => {
        switch (contentType) {
            case SidebarContentType.THOUGHTS:
                return thoughtsContent.header;
            case SidebarContentType.EVENTS:
                return eventsContent.header;
            case SidebarContentType.MESSAGES:
                return messagesContent.header;
            case SidebarContentType.DESCRIPTION:
                return descriptionContent.header;
            default:
                return null;
        }
    };

    return (
        <div className={`bg-black text-white ${isExpanded ? 'w-full' : 'w-[340px]'} 
                        h-full transition-all duration-300 border-l border-zinc-600
                        flex flex-col h-screen`}>
            <SidebarHeader
                ref={headerRef}
                isExpanded={isExpanded}
                toggleSidebar={toggleSidebar}
            >
                {renderHeaderContent()}
            </SidebarHeader>
            <div className="flex-1 overflow-auto">
                {renderContent()}
            </div>
        </div>
    );
}

interface SidebarHeaderProps {
    isExpanded: boolean;
    toggleSidebar: () => void;
    children?: React.ReactNode;
}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
    ({ isExpanded, toggleSidebar, children }, ref) => {
        return (
            <div
                ref={ref}
                className={`sticky top-0 z-20 py-4 pl-4 ${isExpanded ? 'pr-10' : ''} bg-black/60 backdrop-blur-md border-b border-zinc-700`}
            >
                <div className="flex items-center gap-2 w-full">
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
                {children && (
                    <div className="mt-4 px-4">
                        {children}
                    </div>
                )}
            </div>
        );
    }
);

SidebarHeader.displayName = 'SidebarHeader';