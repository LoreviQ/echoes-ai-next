'use client';

import React, { useReducer, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRightSidebar } from '@/contexts/rightSidebar';
import { DiceIcon, CheckSquareIcon } from "@/assets";
import { AdvancedSettingsForm } from '@/components/forms/CreateCharacter/advancedSettingsComponent';
import { advancedSettingsReducer, initialAdvancedSettingsState, AdvancedSettingsState } from './reducer';
import { api, endpoints } from '@/utils';

const AdvancedSettingsHeaderComponent = () => {
    const { currentCharacter } = useRightSidebar();

    if (!currentCharacter) {
        return null;
    }

    const handleGenerate = async () => {
        (window as any).__handleGenerate?.();
    }

    const handleSubmit = async () => {
        (window as any).__handleSubmit?.();
    }

    return (
        <div className="flex space-x-2">
            <button
                onClick={handleGenerate}
                className="text-zinc-500 hover:text-white transition-colors"
            >
                <DiceIcon className="w-8 h-8" />
            </button>
            <button
                onClick={handleSubmit}
                className="text-zinc-500 hover:text-white transition-colors"
            >
                <CheckSquareIcon className="w-8 h-8" />
            </button>
        </div>
    );
};

const AdvancedSettingsContentComponent = () => {
    const { currentCharacter } = useRightSidebar();
    const [state, dispatch] = useReducer(advancedSettingsReducer, initialAdvancedSettingsState);

    if (!currentCharacter) {
        return null;
    }


    // Add generate handler to be called from header
    useEffect(() => {
        const handleGenerate = async () => {
            try {
                const payload = {
                    name: currentCharacter.name,
                    gender: currentCharacter.gender,
                    description: currentCharacter.description,
                    bio: currentCharacter.bio,
                    nsfw: currentCharacter.nsfw,
                    appearance: currentCharacter.appearance
                };

                const { data } = await api.post(endpoints.characters.generateAttributes, payload);

                if (data.success && data.content) {
                    // Update each field from the content, ensuring it's a valid field
                    (Object.entries(data.content) as [keyof AdvancedSettingsState, any][]).forEach(([field, value]) => {
                        if (field in initialAdvancedSettingsState) {
                            dispatch({
                                type: 'SET_FIELD',
                                field,
                                value
                            });
                        }
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };
        // Store the handler in a custom property on the window object
        (window as any).__handleGenerate = handleGenerate;
        return () => {
            delete (window as any).__handleGenerate;
        };

    }, [currentCharacter]);

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