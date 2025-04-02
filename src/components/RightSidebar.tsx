'use client'

import React, { useState } from "react";
import { SearchIcon, HamburgerIcon } from "@/assets/icons";
import { CircleActionButton } from "@/components/buttons/CircleActionButton";
import { setCookie } from 'nookies';
import { useRightSidebar, SidebarContentType } from "@/contexts/RightSidebarContext";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

interface RightSidebarProps {
    initialExpanded?: boolean;
}

export default function RightSidebar({ initialExpanded = false }: RightSidebarProps) {
    // Use the server-provided initial state
    const [isExpanded, setIsExpanded] = useState(initialExpanded);
    // Get the content type from context
    const { contentType, currentCharacter } = useRightSidebar();

    // Update the cookie when the state changes
    const toggleSidebar = () => {
        const newExpandedState = !isExpanded;

        // Update local state
        setIsExpanded(newExpandedState);

        // Save to cookie - 30 days expiry
        setCookie(null, 'right_sidebar_expanded', String(newExpandedState), {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        });
    };

    return (
        <div className={`pt-4 pl-4 bg-black text-white ${isExpanded ? 'w-full pr-10' : 'w-[340px]'} h-screen transition-all duration-300 border-l border-zinc-600`}>
            <div className="flex items-center gap-2 w-full">
                <CircleActionButton
                    icon={HamburgerIcon}
                    onClick={toggleSidebar}
                    className="text-zinc-400 hover:bg-zinc-800/50"
                    size="lg"
                />
                <Search />
            </div>

            <div className="mt-6 px-2">
                {contentType === SidebarContentType.THOUGHTS && <ThoughtsContent />}
                {contentType === SidebarContentType.EVENTS && <EventsContent />}
                {contentType === SidebarContentType.MESSAGES && <MessagesContent />}
                {contentType === SidebarContentType.DESCRIPTION && <DescriptionContent />}
            </div>
        </div>
    );
}

function DescriptionContent() {
    const { currentCharacter } = useRightSidebar();

    if (!currentCharacter) {
        return (
            <div className="p-4 border border-zinc-700 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Character Description</h3>
                <p className="text-zinc-400">No character selected.</p>
            </div>
        );
    }

    return (
        <div className="p-4 border border-zinc-700 rounded-lg">
            <h3 className="text-xl font-bold mb-3">{currentCharacter.name || 'Character'}</h3>
            <div className="mt-4">
                <MarkdownContent
                    content={currentCharacter.description || "This character doesn't have a description yet!"}
                    className="text-white"
                />
            </div>
        </div>
    );
}

// Content components for different sidebar states
function ThoughtsContent() {
    return (
        <div className="p-4 border border-zinc-700 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Thoughts</h3>
            <p className="text-zinc-400">This section will display user thoughts and reflections.</p>
            <div className="mt-4 p-3 bg-zinc-800 rounded">
                <p>Example thought content here...</p>
            </div>
        </div>
    );
}

function EventsContent() {
    return (
        <div className="p-4 border border-zinc-700 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Events</h3>
            <p className="text-zinc-400">This section will display upcoming events and activities.</p>
            <div className="mt-4 space-y-2">
                <div className="p-3 bg-zinc-800 rounded">Event 1</div>
                <div className="p-3 bg-zinc-800 rounded">Event 2</div>
                <div className="p-3 bg-zinc-800 rounded">Event 3</div>
            </div>
        </div>
    );
}

function MessagesContent() {
    return (
        <div className="p-4 border border-zinc-700 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Messages</h3>
            <p className="text-zinc-400">This section will display user messages and conversations.</p>
            <div className="mt-4 space-y-2">
                <div className="p-3 bg-zinc-800 rounded flex">
                    <div className="w-8 h-8 bg-zinc-600 rounded-full mr-2"></div>
                    <div>
                        <p className="font-bold">User 1</p>
                        <p className="text-sm text-zinc-400">Hello there!</p>
                    </div>
                </div>
                <div className="p-3 bg-zinc-800 rounded flex">
                    <div className="w-8 h-8 bg-zinc-600 rounded-full mr-2"></div>
                    <div>
                        <p className="font-bold">User 2</p>
                        <p className="text-sm text-zinc-400">What's new?</p>
                    </div>
                </div>
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