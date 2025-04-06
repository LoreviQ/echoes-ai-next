'use client';

import { useReducer, useEffect } from 'react';

import { database } from '@/utils';
import { BackHeader } from '@/components/ui';
import { settingsReducer, initialSettingsState, SettingsAction, SettingsState } from './reducer';
import { NsfwFilter, UserPreferencesSupabase } from '@/types';
import { SubHeading, ToggleButtonGroup } from '@/components/forms/formComponents';

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
        const preferences: UserPreferencesSupabase = {
            nsfw_filter: state.nsfw_filter
        };

        const { error } = await database.updateUserPreferences(state.user_id, preferences);
        if (error) throw error;

        // Show success state (you might want to add a toast notification here)
    } catch (error) {
        console.error('Failed to update settings:', error);
        // Handle error (you might want to add error notification here)
    } finally {
        dispatch({ type: 'SET_FIELD', field: 'isSubmitting', value: false });
    }
}

function SettingsContent({ state, dispatch }: { state: SettingsState, dispatch: React.Dispatch<SettingsAction> }) {
    useEffect(() => {
        async function loadUserPreferences() {
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
            }
        }
        loadUserPreferences();
    }, []);

    return (
        <form className="flex flex-col p-4 space-y-4">
            <SubHeading name="Content Filtering" description="Controls visibility of mature content" />
            <ToggleButtonGroup
                field="nsfw_filter"
                label="NSFW Filter"
                description="Controls visibility of mature content"
                options={['hide', 'blur', 'show'] as NsfwFilter[]}
                value={state.nsfw_filter}
                dispatch={dispatch}
            />
        </form>
    );
}
