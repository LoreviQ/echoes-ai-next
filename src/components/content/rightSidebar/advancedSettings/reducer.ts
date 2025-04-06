// Define the state interface for advanced settings
export interface AdvancedSettingsState {
    path: string;
    postingFrequency: number;
    isSubmitting?: boolean;
    isGenerating?: boolean;
}

// Define action types for our reducer
export type AdvancedSettingsAction =
    | { type: 'SET_FIELD'; field: keyof AdvancedSettingsState; value: any };

// Define the initial state
export const initialAdvancedSettingsState: AdvancedSettingsState = {
    path: '',
    postingFrequency: 0,
    isSubmitting: false,
    isGenerating: false
};

// Create the reducer function
export function advancedSettingsReducer(
    state: AdvancedSettingsState,
    action: AdvancedSettingsAction
): AdvancedSettingsState {
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