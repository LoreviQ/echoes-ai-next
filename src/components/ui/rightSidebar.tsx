'use client'

import React, { useState, useRef, Suspense } from "react";
import { SearchIcon, HamburgerIcon } from "@/assets";
import { CircleActionButton } from "@/components/buttons/CircleActionButton";
import { useRightSidebar, SidebarContentType } from "@/contexts/rightSidebar";
import { setPreference } from "@/utils/preferences";
import { HeaderLoading, ContentLoading } from '@/components/ui/loading';
import { ThoughtsHeader, ThoughtsContent } from '@/components/content/rightSidebar/thoughtsContent';
import { EventsHeader, EventsContent } from '@/components/content/rightSidebar/eventsContent';
import { MessagesHeader, MessagesContent } from '@/components/content/rightSidebar/messagesContent';
import { DescriptionHeader, DescriptionContent } from '@/components/content/rightSidebar/descriptionContent';
import { AdvancedSettingsHeader, AdvancedSettingsContent } from '@/components/content/rightSidebar/advancedSettings';

interface SidebarContentComponents {
    Header: React.ComponentType;
    Content: React.ComponentType;
}

type SidebarContentMap = {
    [key in Exclude<SidebarContentType, SidebarContentType.NONE>]: SidebarContentComponents;
};

const SIDEBAR_CONTENT_MAP: SidebarContentMap = {
    [SidebarContentType.THOUGHTS]: {
        Header: ThoughtsHeader,
        Content: ThoughtsContent
    },
    [SidebarContentType.EVENTS]: {
        Header: EventsHeader,
        Content: EventsContent
    },
    [SidebarContentType.MESSAGES]: {
        Header: MessagesHeader,
        Content: MessagesContent
    },
    [SidebarContentType.DESCRIPTION]: {
        Header: DescriptionHeader,
        Content: DescriptionContent
    },
    [SidebarContentType.ADVANCED_SETTINGS]: {
        Header: AdvancedSettingsHeader,
        Content: AdvancedSettingsContent
    }
};

interface RightSidebarProps {
    initialExpanded?: boolean;
}

export default function RightSidebar({ initialExpanded = false }: RightSidebarProps) {
    const [isExpanded, setIsExpanded] = useState(initialExpanded);
    const { contentType } = useRightSidebar();
    const headerRef = useRef<HTMLDivElement>(null);

    const toggleSidebar = () => {
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState);
        setPreference('rightSidebarExpanded', newExpandedState);
    };

    const currentContent = contentType !== SidebarContentType.NONE ? SIDEBAR_CONTENT_MAP[contentType] : undefined;
    const ContentComponent = currentContent?.Content;
    const HeaderComponent = currentContent?.Header;

    return (
        <div className="hidden lg:flex lg:flex-1 justify-start">
            <div className="hidden lg:block w-full">
                <div className={`bg-black text-white ${isExpanded ? 'w-full' : 'w-[340px]'} 
                            h-full transition-all duration-300 border-l border-zinc-600
                            flex flex-col h-screen`}>
                    <SidebarHeader
                        ref={headerRef}
                        isExpanded={isExpanded}
                        toggleSidebar={toggleSidebar}
                    >
                        <Suspense fallback={<HeaderLoading />}>
                            {HeaderComponent && <HeaderComponent />}
                        </Suspense>
                    </SidebarHeader>
                    <div className="flex-1 overflow-auto">
                        <Suspense fallback={<ContentLoading />}>
                            {ContentComponent && <ContentComponent />}
                        </Suspense>
                    </div>
                </div>
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
                {children && children}
            </div>
        );
    }
);

SidebarHeader.displayName = 'SidebarHeader';