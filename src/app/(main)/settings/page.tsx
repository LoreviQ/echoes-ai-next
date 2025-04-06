'use client';

import { useReducer, useEffect } from 'react';

import { database } from '@/utils';
import { BackHeader } from '@/components/ui';
import { settingsReducer, initialSettingsState, SettingsAction, SettingsState } from './reducer';
import { NsfwFilter, UserPreferencesSupabase, UserPersonas } from '@/types';
import { SubHeading, ToggleButtonGroup } from '@/components/forms/formComponents';
import { PersonaCard } from './PersonaCard';
import { PlusIcon } from '@/assets';

export default function SettingsPage() {
    const [state, dispatch] = useReducer(settingsReducer, initialSettingsState);
    return (
        <>
            <BackHeader text="Settings">
                <button
                    onClick={() => handleSubmit(state, dispatch)}
                    disabled={state.isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-black  rounded-md hover:bg-zinc-800 disabled:opacity-50"
                >
                    {state.isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </BackHeader>
            <SettingsContent state={state} dispatch={dispatch} />
        </>
    );
}

async function handleSubmit(state: SettingsState, dispatch: React.Dispatch<SettingsAction>) {
    if (!state.user_id) {
        console.error('No user ID found in state');
        return;
    }

    dispatch({ type: 'SET_FIELD', field: 'isSubmitting', value: true });

    try {
        // Update user preferences
        const preferences: UserPreferencesSupabase = {
            nsfw_filter: state.nsfw_filter
        };

        const { error: preferencesError } = await database.updateUserPreferences(state.user_id, preferences);
        if (preferencesError) throw preferencesError;

        // Delete removed personas
        for (const personaId of state.deletedPersonaIds) {
            const { error } = await database.deleteUserPersona(personaId);
            if (error) throw error;
        }

        // Update existing personas
        for (const persona of state.personas) {
            const { id, user_id, created_at, updated_at, ...personaToUpdate } = persona;
            const { error } = await database.updateUserPersona(id, personaToUpdate);
            if (error) throw error;
        }

        // Insert new personas
        for (const newPersona of state.newPersonas) {
            const { temp_id, ...personaToInsert } = newPersona;
            const { error } = await database.insertUserPersona(personaToInsert);
            if (error) throw error;
        }

        // Reload personas to get fresh data including IDs for new personas
        const { personas } = await database.getUserPersonas();
        if (personas) {
            dispatch({ type: 'LOAD_PERSONAS', personas });
        }

        // Reset tracking of new and deleted personas
        dispatch({ type: 'SET_FIELD', field: 'newPersonas', value: [] });
        dispatch({ type: 'SET_FIELD', field: 'deletedPersonaIds', value: [] });

    } catch (error) {
        console.error('Failed to update settings:', error);
        // Handle error (you might want to add error notification here)
    } finally {
        dispatch({ type: 'SET_FIELD', field: 'isSubmitting', value: false });
    }
}

function SettingsContent({ state, dispatch }: { state: SettingsState, dispatch: React.Dispatch<SettingsAction> }) {
    useEffect(() => {
        async function loadUserData() {
            const { user } = await database.getLoggedInUser();
            if (user) {
                dispatch({
                    type: 'SET_FIELD',
                    field: 'user_id',
                    value: user.id
                });
                if (user.preferences) {
                    dispatch({
                        type: 'SET_FIELD',
                        field: 'nsfw_filter',
                        value: user.preferences.nsfw_filter
                    });
                }

                // Load personas
                const { personas } = await database.getUserPersonas();
                if (personas) {
                    dispatch({ type: 'LOAD_PERSONAS', personas });
                }
            }
        }
        loadUserData();
    }, []);

    const handleAddPersona = () => {
        const newPersona: UserPersonas & { temp_id: string } = {
            temp_id: `new-${Date.now()}`,
            name: '',
            bio: '',
            appearance: '',
            description: '',
            gender: '',
            avatar_url: '',
            banner_url: ''
        };
        dispatch({ type: 'ADD_PERSONA', persona: newPersona });
    };

    const handleUpdatePersona = (id: string, updates: Partial<UserPersonas>) => {
        dispatch({ type: 'UPDATE_PERSONA', id, updates });
    };

    const handleDeletePersona = (id: string) => {
        dispatch({ type: 'DELETE_PERSONA', id });
    };

    return (
        <form className="flex flex-col p-4 space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div>
                <SubHeading name="Content Filtering" description="Controls visibility of mature content" />
                <ToggleButtonGroup
                    field="nsfw_filter"
                    label="NSFW Filter"
                    description="Controls visibility of mature content"
                    options={['hide', 'blur', 'show'] as NsfwFilter[]}
                    value={state.nsfw_filter}
                    dispatch={dispatch}
                />
            </div>

            <div>
                <div className="flex justify-between items-center">
                    <SubHeading name="Personas" description="Configure your personas" />
                    <button
                        type="button"
                        onClick={handleAddPersona}
                        className="p-2 text-white bg-black rounded-full hover:bg-zinc-800"
                        aria-label="Add persona"
                    >
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="mt-4">
                    {state.personas.map(persona => (
                        <PersonaCard
                            key={persona.id}
                            persona={persona}
                            onUpdate={handleUpdatePersona}
                            onDelete={handleDeletePersona}
                        />
                    ))}

                    {state.newPersonas.map(newPersona => (
                        <PersonaCard
                            key={newPersona.temp_id}
                            persona={newPersona}
                            onUpdate={handleUpdatePersona}
                            onDelete={handleDeletePersona}
                            isNew={true}
                        />
                    ))}

                    {state.personas.length === 0 && state.newPersonas.length === 0 && (
                        <p className="text-gray-500 text-center py-4">
                            No personas yet. Click the plus button to create one.
                        </p>
                    )}
                </div>
            </div>
        </form>
    );
}
