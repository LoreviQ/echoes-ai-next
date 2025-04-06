// Define the state interface for advanced settings
export interface AdvancedSettingsState {
    // state attributes
    mood: string;
    goal: string;

    // action attributes
    postingFrequency: number;
    originality: number;
    likeReplyRatio: number;
    responsiveness: number;

    // provider attributes
    readingScope: number;
    informationFiltering: number;
    sentimentFiltering: number;
    profileScrutiny: number;

    // evaluator attributes
    influencability: number;
    engagementSensitivity: number;
    relationshipFormationSpeed: number;
    relationshipClosenessThreshold: number;
    relationshipStability: number;
    grudgePersistence: number;

    // content attributes
    positivity: number;
    openness: number;
    formality: number;
    conflictInitiation: number;
    influenceSeeking: number;
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

    // state attributes
    mood: '',
    goal: '',

    // action attributes
    postingFrequency: 0,
    originality: 0,
    likeReplyRatio: 0,
    responsiveness: 0,

    // provider attributes
    readingScope: 0,
    informationFiltering: 0,
    sentimentFiltering: 0,
    profileScrutiny: 0,

    // evaluator attributes
    influencability: 0,
    engagementSensitivity: 0,
    relationshipFormationSpeed: 0,
    relationshipClosenessThreshold: 0,
    relationshipStability: 0,
    grudgePersistence: 0,

    // content attributes
    positivity: 0,
    openness: 0,
    formality: 0,
    conflictInitiation: 0,
    influenceSeeking: 0,
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