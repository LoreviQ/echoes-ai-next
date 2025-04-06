'use client';

import React, { useReducer } from 'react';
import dynamic from 'next/dynamic';
import { useRightSidebar } from '@/contexts/rightSidebar';
import { CheckSquareIcon } from "@/assets";
import { AdvancedSettingsForm } from '@/components/forms/CreateCharacter/advancedSettingsComponent';
import { advancedSettingsReducer, initialAdvancedSettingsState } from './reducer';

const AdvancedSettingsHeaderComponent = () => {
    const { currentCharacter } = useRightSidebar();

    if (!currentCharacter) {
        return null;
    }

    return (
        <button
            className="text-zinc-500 hover:text-white transition-colors"
        >
            <CheckSquareIcon className="w-6 h-6" />
        </button>
    );
};

const AdvancedSettingsContentComponent = () => {
    const [state, dispatch] = useReducer(advancedSettingsReducer, initialAdvancedSettingsState);

    return (
        <div className="p-4">
            <AdvancedSettingsForm state={state} dispatch={dispatch} />
        </div>
    );
};

export const AdvancedSettingsHeader = dynamic(
    () => Promise.resolve(AdvancedSettingsHeaderComponent),
    { ssr: false }
);

export const AdvancedSettingsContent = dynamic(
    () => Promise.resolve(AdvancedSettingsContentComponent),
    { ssr: false }
); 