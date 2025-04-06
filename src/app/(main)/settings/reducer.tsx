import { NsfwFilter } from "@/types/user";

export interface SettingsState {
    nsfw_filter: NsfwFilter;
    isSubmitting: boolean;
}


export type SettingsAction =
    | { type: 'SET_FIELD'; field: keyof SettingsState; value: any };

export const initialSettingsState: SettingsState = {
    nsfw_filter: 'hide',
    isSubmitting: false
};

export function settingsReducer(
    state: SettingsState,
    action: SettingsAction
): SettingsState {
    switch (action.type) {
        case 'SET_FIELD':
            return {
                ...state,
                [action.field]: action.value
            };
        default:
            return state;
    }
}