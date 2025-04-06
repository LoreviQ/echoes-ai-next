'use client';

import { useReducer } from 'react';

import { database } from '@/utils';
import { BackHeader } from '@/components/ui';
import { settingsReducer, initialSettingsState } from './reducer';
import { NsfwFilter } from '@/types';
import { SubHeading, ToggleButtonGroup } from '@/components/forms/formComponents';

export default function SettingsPage() {
    return (
        <>
            <BackHeader text="Settings" />
            <SettingsContent />
        </>
    );
}

function SettingsContent() {
    const [state, dispatch] = useReducer(settingsReducer, initialSettingsState);

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
