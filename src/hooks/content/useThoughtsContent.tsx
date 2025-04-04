'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { HeaderLoading, ContentLoading } from '@/components/ui/loading';

const ThoughtsHeaderComponent = () => (
    <div className="mt-4 px-4">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Thoughts</h3>
        </div>
    </div>
);

const ThoughtsContentComponent = () => (
    <div className="p-4">
        <p className="text-zinc-400">This section will display user thoughts and reflections.</p>
        <div className="mt-4 p-3 bg-zinc-800 rounded">
            <p>Example thought content here...</p>
        </div>
    </div>
);

export const ThoughtsHeader = dynamic(
    () => Promise.resolve(ThoughtsHeaderComponent),
    { ssr: false, loading: () => <HeaderLoading /> }
);

export const ThoughtsContent = dynamic(
    () => Promise.resolve(ThoughtsContentComponent),
    { ssr: false, loading: () => <ContentLoading /> }
); 