'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { HeaderLoading, ContentLoading } from '@/components/ui/loading';
import { MarkdownContent } from "@/components/ui/MarkdownContent";

const AdvancedSettingsHeaderComponent = () => (
    <div className="mt-4 px-4">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Advanced Settings</h3>
        </div>
    </div>
);

const AdvancedSettingsContentComponent = () => (
    <div className="p-4">
        <MarkdownContent
            content={"ADVANCED SETTINGS"}
            className="text-white"
        />
    </div>
);

export const AdvancedSettingsHeader = dynamic(
    () => Promise.resolve(AdvancedSettingsHeaderComponent),
    { ssr: false, loading: () => <HeaderLoading /> }
);

export const AdvancedSettingsContent = dynamic(
    () => Promise.resolve(AdvancedSettingsContentComponent),
    { ssr: false, loading: () => <ContentLoading /> }
); 