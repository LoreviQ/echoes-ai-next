'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { HeaderLoading, ContentLoading } from '@/components/ui/loading';

const EventsHeaderComponent = () => (
    <div className="mt-4 px-4">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Events</h3>
        </div>
    </div>
);

const EventsContentComponent = () => (
    <div className="p-4">
        <p className="text-zinc-400">This section will display upcoming events and activities.</p>
        <div className="mt-4 space-y-2">
            <div className="p-3 bg-zinc-800 rounded">Event 1</div>
            <div className="p-3 bg-zinc-800 rounded">Event 2</div>
            <div className="p-3 bg-zinc-800 rounded">Event 3</div>
        </div>
    </div>
);

export const EventsHeader = dynamic(
    () => Promise.resolve(EventsHeaderComponent),
    { ssr: false, loading: () => <HeaderLoading /> }
);

export const EventsContent = dynamic(
    () => Promise.resolve(EventsContentComponent),
    { ssr: false, loading: () => <ContentLoading /> }
);

export function useEventsContent() {
    const header = (
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Events</h3>
        </div>
    );

    const content = (
        <div className="p-4">
            <p className="text-zinc-400">This section will display upcoming events and activities.</p>
            <div className="mt-4 space-y-2">
                <div className="p-3 bg-zinc-800 rounded">Event 1</div>
                <div className="p-3 bg-zinc-800 rounded">Event 2</div>
                <div className="p-3 bg-zinc-800 rounded">Event 3</div>
            </div>
        </div>
    );

    return {
        header,
        content
    };
} 