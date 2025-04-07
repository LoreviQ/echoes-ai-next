// Define the state interface for advanced settings
import { CharacterAttributes } from '@/types/characterAttributes';

export interface AdvancedSettingsState {
    // character settings
    public: boolean;
    nsfw: boolean;

    // character attributes
    attributes: CharacterAttributes;

    // UI state
    isSubmitting?: boolean;
    isGenerating?: boolean;
    error: string | null;
}

// Define action types for our reducer
export type AdvancedSettingsAction =
    | { type: 'SET_FIELD'; field: keyof AdvancedSettingsState; value: any }
    | { type: 'SET_ATTRIBUTE'; field: keyof CharacterAttributes; value: any };

// Define the initial state
export const initialAdvancedSettingsState: AdvancedSettingsState = {
    // character settings
    public: false,
    nsfw: false,

    // character attributes
    attributes: {
        mood: '',
        goal: '',
        posting_frequency: 0,
        originality: 0,
        like_reply_ratio: 0,
        responsiveness: 0,
        reading_scope: 0,
        information_filtering: 0,
        sentiment_filtering: 0,
        profile_scrutiny: 0,
        influencability: 0,
        engagement_sensitivity: 0,
        relationship_formation_speed: 0,
        relationship_closeness_threshold: 0,
        relationship_stability: 0,
        grudge_persistence: 0,
        positivity: 0,
        openness: 0,
        formality: 0,
        conflict_initiation: 0,
        influence_seeking: 0,
        inquisitiveness: 0,
        humor: 0,
        depth: 0
    },

    isSubmitting: false,
    isGenerating: false,
    error: null
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
        case 'SET_ATTRIBUTE':
            return {
                ...state,
                attributes: {
                    ...state.attributes,
                    [action.field]: action.value
                }
            };
        default:
            return state;
    }
} 