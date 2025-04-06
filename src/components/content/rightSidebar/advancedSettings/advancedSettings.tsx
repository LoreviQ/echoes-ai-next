'use client';

import React, { useReducer, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRightSidebar } from '@/contexts/rightSidebar';
import { DiceIcon, CheckSquareIcon } from "@/assets";
import { AdvancedSettingsForm } from '@/components/forms/CreateCharacter/advancedSettingsComponent';
import { advancedSettingsReducer, initialAdvancedSettingsState, AdvancedSettingsState } from './reducer';
import { api, endpoints, database } from '@/utils';

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
                title="Generate Attrbiutes based on character description"
            >
                <DiceIcon className="w-8 h-8" />
            </button>
            <button
                onClick={handleSubmit}
                className="text-zinc-500 hover:text-white transition-colors"
                title="Update Attributes"
            >
                <CheckSquareIcon className="w-8 h-8" />
            </button>
        </div>
    );
};

const AdvancedSettingsContentComponent = () => {
    const { currentCharacter } = useRightSidebar();
    const [state, dispatch] = useReducer(advancedSettingsReducer, initialAdvancedSettingsState);

    // Fetch character attributes when component mounts or character changes
    useEffect(() => {
        const fetchCharacterAttributes = async () => {
            if (!currentCharacter?.id) {
                return;
            }

            try {
                const { attributes, error } = await database.getCharacterAttributes(currentCharacter.id);
                if (error) {
                    console.error('Error fetching character attributes:', error);
                    return;
                }

                if (attributes) {
                    // Update each field from the attributes
                    Object.entries(attributes).forEach(([field, value]) => {
                        if (field in initialAdvancedSettingsState) {
                            dispatch({
                                type: 'SET_FIELD',
                                field: field as keyof AdvancedSettingsState,
                                value
                            });
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching character attributes:', error);
            }
        };

        fetchCharacterAttributes();
    }, [currentCharacter]);

    // Add generate handler to be called from header
    useEffect(() => {
        const handleGenerate = async () => {
            if (!currentCharacter) {
                return;
            }

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

    // Add submit handler to be called from header
    useEffect(() => {
        const handleSubmit = async () => {
            if (!currentCharacter) {
                return;
            }

            try {
                dispatch({ type: 'SET_FIELD', field: 'isSubmitting', value: true });

                // Create attributes object by excluding non-attribute fields
                const { isSubmitting, isGenerating, ...attributes } = state;

                const { error } = await database.upsertCharacterAttributes(
                    currentCharacter.id,
                    attributes
                );

                if (error) {
                    console.error('Error updating character attributes:', error);
                }
            } catch (error) {
                console.error('Error updating character attributes:', error);
            } finally {
                dispatch({ type: 'SET_FIELD', field: 'isSubmitting', value: false });
            }
        };

        // Store the handler in a custom property on the window object
        (window as any).__handleSubmit = handleSubmit;
        return () => {
            delete (window as any).__handleSubmit;
        };
    }, [currentCharacter, state]);

    if (!currentCharacter) {
        return null;
    }

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