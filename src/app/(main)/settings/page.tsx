'use client';

import { useReducer, useEffect } from 'react';

import { database } from '@/utils';
import { BackHeader } from '@/components/ui';
import { settingsReducer, initialSettingsState, SettingsAction, SettingsState } from './reducer';
import { NsfwFilter } from '@/types';
import { SubHeading, ToggleButtonGroup } from '@/components/forms/formComponents';

export default function SettingsPage() {
    const [state, dispatch] = useReducer(settingsReducer, initialSettingsState);
    return (
        <>
            <BackHeader text="Settings" />
            <SettingsContent state={state} dispatch={dispatch} />
        </>
    );
}

function SettingsContent({ state, dispatch }: { state: SettingsState, dispatch: React.Dispatch<SettingsAction> }) {
    useEffect(() => {
        async function loadUserPreferences() {
            const { user } = await database.getLoggedInUser();
            if (user?.preferences) {
                dispatch({
                    type: 'SET_FIELD',
                    field: 'nsfw_filter',
                    value: user.preferences.nsfw_filter
                });
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
