// Define the state interface for advanced settings
export interface AdvancedSettingsState {
    // character attributes
    public: boolean;
    nsfw: boolean;

    // state attributes
    mood: string;
    goal: string;

    // action attributes
    posting_frequency: number;
    originality: number;
    like_reply_ratio: number;
    responsiveness: number;

    // provider attributes
    reading_scope: number;
    information_filtering: number;
    sentiment_filtering: number;
    profile_scrutiny: number;

    // evaluator attributes
    influencability: number;
    engagement_sensitivity: number;
    relationship_formation_speed: number;
    relationship_closeness_threshold: number;
    relationship_stability: number;
    grudge_persistence: number;

    // content attributes
    positivity: number;
    openness: number;
    formality: number;
    conflict_initiation: number;
    influence_seeking: number;
    inquisitiveness: number;
    humor: number;
    depth: number;

    isSubmitting?: boolean;
    isGenerating?: boolean;
}

// Define action types for our reducer
export type AdvancedSettingsAction =
    | { type: 'SET_FIELD'; field: keyof AdvancedSettingsState; value: any };

// Define the initial state
export const initialAdvancedSettingsState: AdvancedSettingsState = {
    // character attributes
    public: false,
    nsfw: false,

    // state attributes
    mood: '',
    goal: '',

    // action attributes
    posting_frequency: 0,
    originality: 0,
    like_reply_ratio: 0,
    responsiveness: 0,

    // provider attributes
    reading_scope: 0,
    information_filtering: 0,
    sentiment_filtering: 0,
    profile_scrutiny: 0,

    // evaluator attributes
    influencability: 0,
    engagement_sensitivity: 0,
    relationship_formation_speed: 0,
    relationship_closeness_threshold: 0,
    relationship_stability: 0,
    grudge_persistence: 0,

    // content attributes
    positivity: 0,
    openness: 0,
    formality: 0,
    conflict_initiation: 0,
    influence_seeking: 0,
    inquisitiveness: 0,
    humor: 0,
    depth: 0,

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