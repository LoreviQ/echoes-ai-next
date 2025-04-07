'use client';

import { useReducer, useEffect } from 'react';

import { createClient } from '@/utils';
import { BackHeader } from '@/components/ui';
import { settingsReducer, initialSettingsState, SettingsAction, SettingsState } from './reducer';
import { SubHeading, ToggleButtonGroup } from '@/components/forms/formComponents';
import { PersonaCard } from './PersonaCard';
import { PlusIcon } from '@/assets';
import type { NsfwFilter, UserPreferencesSupabase, UserPersonas } from 'echoes-shared/types';
import { database } from 'echoes-shared';

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

        const { error: preferencesError } = await database.updateUserPreferences(state.user_id, preferences, createClient());
        if (preferencesError) throw preferencesError;

        // Process existing personas with new avatars
        for (const persona of state.personas) {
            if (state.avatarFiles[persona.id]) {
                const file = state.avatarFiles[persona.id]!;
                const fileExt = file.name.split('.').pop() || 'jpg';
                const filePath = `persona_avatars/${persona.id}.${fileExt}`;

                const { error } = await database.uploadAuth(filePath, file, createClient());
                if (error) throw error;
            }
        }

        // Process new personas with avatars
        for (const newPersona of state.newPersonas) {
            if (state.avatarFiles[newPersona.temp_id]) {
                // We'll handle these after inserting (we need real IDs first)
                continue;
            }
        }

        // Delete removed personas
        for (const personaId of state.deletedPersonaIds) {
            const { error } = await database.deleteUserPersona(personaId, createClient());
            if (error) throw error;
        }

        // Update existing personas
        for (const persona of state.personas) {


            const { error } = await database.updateUserPersona(persona.id, {
                name: persona.name,
                bio: persona.bio,
                appearance: persona.appearance,
                description: persona.description,
                gender: persona.gender,
            }, createClient());
            if (error) throw error;
        }

        // Insert new personas
        const newPersonaIds = [];
        for (const newPersona of state.newPersonas) {
            const { temp_id, avatar_url, ...personaToInsert } = newPersona;

            // Insert the new persona
            const { error } = await database.insertUserPersona(personaToInsert, createClient());
            if (error) throw error;

            // Get the personas to find the newly created one
            const { personas: updatedPersonas } = await database.getUserPersonas(createClient());
            const createdPersona = updatedPersonas?.find(p =>
                p.name === personaToInsert.name &&
                p.bio === personaToInsert.bio
            );

            if (createdPersona && state.avatarFiles[temp_id]) {
                // Now we have a real ID, we can upload the avatar
                const file = state.avatarFiles[temp_id]!;
                const fileExt = file.name.split('.').pop() || 'jpg';
                const filePath = `persona_avatars/${createdPersona.id}.${fileExt}`;

                const { error: uploadError } = await database.uploadAuth(filePath, file, createClient());
                if (uploadError) throw uploadError;
            }

            if (createdPersona) {
                newPersonaIds.push({ tempId: temp_id, realId: createdPersona.id });
            }
        }

        // Reload personas to get fresh data including IDs for new personas
        const { personas } = await database.getUserPersonas(createClient());
        if (personas) {
            dispatch({ type: 'LOAD_PERSONAS', personas });
        }

        // Reset tracking of new and deleted personas
        dispatch({ type: 'SET_FIELD', field: 'newPersonas', value: [] });
        dispatch({ type: 'SET_FIELD', field: 'deletedPersonaIds', value: [] });
        dispatch({ type: 'SET_FIELD', field: 'avatarFiles', value: {} });

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
            const { user } = await database.getLoggedInUser(createClient());
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
                const { personas } = await database.getUserPersonas(createClient());
                if (personas) {
                    dispatch({ type: 'LOAD_PERSONAS', personas });
                }
            }
        }
        loadUserData();
    }, [dispatch]);

    const handleAddPersona = () => {
        const newPersona: UserPersonas & { temp_id: string } = {
            temp_id: `new-${Date.now()}`,
            name: '',
            bio: '',
            appearance: '',
            description: '',
            gender: '',

        };
        dispatch({ type: 'ADD_PERSONA', persona: newPersona });
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

            <div className="flex flex-col space-y-4">
                <SubHeading name="Personas" description="Configure your personas" >
                    <button
                        type="button"
                        onClick={handleAddPersona}
                        className="p-2 text-white bg-black rounded-full hover:bg-zinc-800"
                        aria-label="Add persona"
                    >
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </SubHeading>
                {state.personas.map(persona => (
                    <PersonaCard
                        key={persona.id}
                        persona={persona}
                        dispatch={dispatch}
                    />
                ))}

                {state.newPersonas.map(newPersona => (
                    <PersonaCard
                        key={newPersona.temp_id}
                        persona={newPersona}
                        dispatch={dispatch}
                        isNew={true}
                    />
                ))}

                {state.personas.length === 0 && state.newPersonas.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                        No personas yet. Click the plus button to create one.
                    </p>
                )}
            </div>
        </form>
    );
}
