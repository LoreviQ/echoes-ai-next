import { Gender } from '@/types';
import { parseGender } from '@/types';
import { getRandomWords } from '@/config';
import { nameToPath } from '@/utils';

// Define the state interface for our reducer
export interface FormState {
    // Character data
    name: string;
    path: string;
    bio: string;
    description: string;
    appearance: string;
    gender: Gender;
    customGender: string;
    isPublic: boolean;
    isNsfw: boolean;
    tags: string;

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

    // UI state
    error: string | null;
    isSubmitting: boolean;
    isGenerating: boolean;
    isGeneratingAvatar: boolean;
    isGeneratingBanner: boolean;

    // Media files
    avatarFile: File | string | null;
    bannerFile: File | string | null;
    avatarPreviewUrl: string;
    bannerPreviewUrl: string;
}

// Define action types for our reducer
export type FormAction =
    | { type: 'SET_FIELD'; field: keyof FormState; value: any }
    | { type: 'SET_AVATAR_FILE'; file: File | string | null }
    | { type: 'SET_BANNER_FILE'; file: File | string | null }
    | { type: 'RESET_ERROR' }
    | { type: 'SET_ERROR'; error: string }
    | { type: 'START_SUBMIT' }
    | { type: 'END_SUBMIT' }
    | { type: 'START_GENERATING' }
    | { type: 'END_GENERATING' }
    | { type: 'START_GENERATING_AVATAR' }
    | { type: 'END_GENERATING_AVATAR' }
    | { type: 'START_GENERATING_BANNER' }
    | { type: 'END_GENERATING_BANNER' }
    | { type: 'GENERATE_CHARACTER_SUCCESS'; data: any }
    | { type: 'GENERATE_RANDOM_TAGS' };

// Define the initial state
export const initialFormState: FormState = {
    name: '',
    path: '',
    bio: '',
    description: '',
    appearance: '',
    gender: Gender.NA,
    customGender: '',
    isPublic: true,
    isNsfw: false,
    tags: '',

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

    error: null,
    isSubmitting: false,
    isGenerating: false,
    isGeneratingAvatar: false,
    isGeneratingBanner: false,
    avatarFile: null,
    bannerFile: null,
    avatarPreviewUrl: '/images/avatar-placeholder.jpg',
    bannerPreviewUrl: '/images/banner-placeholder.jpg',
};

// Create the reducer function
export function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {
        case 'SET_FIELD':
            return {
                ...state,
                [action.field]: action.value
            };
        case 'SET_AVATAR_FILE': {
            // Update preview URL based on the file
            let previewUrl = state.avatarPreviewUrl;
            if (action.file) {
                if (typeof action.file === 'string') {
                    previewUrl = action.file;
                } else {
                    // For File objects, we'll set the URL in a useEffect
                    // but we need to reset if null
                    previewUrl = '/images/avatar-placeholder.jpg';
                }
            } else {
                previewUrl = '/images/avatar-placeholder.jpg';
            }

            return {
                ...state,
                avatarFile: action.file,
                avatarPreviewUrl: previewUrl
            };
        }
        case 'SET_BANNER_FILE': {
            // Update preview URL based on the file
            let previewUrl = state.bannerPreviewUrl;
            if (action.file) {
                if (typeof action.file === 'string') {
                    previewUrl = action.file;
                } else {
                    // For File objects, we'll set the URL in a useEffect
                    // but we need to reset if null
                    previewUrl = '/images/banner-placeholder.jpg';
                }
            } else {
                previewUrl = '/images/banner-placeholder.jpg';
            }

            return {
                ...state,
                bannerFile: action.file,
                bannerPreviewUrl: previewUrl
            };
        }
        case 'RESET_ERROR':
            return {
                ...state,
                error: null
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.error
            };
        case 'START_SUBMIT':
            return {
                ...state,
                isSubmitting: true,
                error: null
            };
        case 'END_SUBMIT':
            return {
                ...state,
                isSubmitting: false
            };
        case 'START_GENERATING':
            return {
                ...state,
                isGenerating: true,
                error: null
            };
        case 'END_GENERATING':
            return {
                ...state,
                isGenerating: false
            };
        case 'START_GENERATING_AVATAR':
            return {
                ...state,
                isGeneratingAvatar: true,
                error: null
            };
        case 'END_GENERATING_AVATAR':
            return {
                ...state,
                isGeneratingAvatar: false
            };
        case 'START_GENERATING_BANNER':
            return {
                ...state,
                isGeneratingBanner: true,
                error: null
            };
        case 'END_GENERATING_BANNER':
            return {
                ...state,
                isGeneratingBanner: false
            };
        case 'GENERATE_CHARACTER_SUCCESS': {
            const { name, bio, description, appearance, gender, nsfw } = action.data.character;
            const {
                mood,
                goal,
                posting_frequency,
                originality,
                like_reply_ratio,
                responsiveness,
                reading_scope,
                information_filtering,
                sentiment_filtering,
                profile_scrutiny,
                influencability,
                engagement_sensitivity,
                relationship_formation_speed,
                relationship_closeness_threshold,
                relationship_stability,
                grudge_persistence,
                positivity,
                openness,
                formality,
                conflict_initiation,
                influence_seeking,
                inquisitiveness,
                humor,
                depth
            } = action.data.attributes;
            const parsedGender = parseGender(gender);
            return {
                ...state,
                name: name || state.name,
                bio: bio || state.bio,
                description: description || state.description,
                appearance: appearance || state.appearance,
                gender: parsedGender.gender,
                customGender: parsedGender.customValue || '',
                isNsfw: nsfw === 'true' || nsfw === true || state.isNsfw,
                path: nameToPath(name || state.name),
                // State attributes
                mood: mood || state.mood,
                goal: goal || state.goal,
                // Action attributes
                posting_frequency: posting_frequency ?? state.posting_frequency,
                originality: originality ?? state.originality,
                like_reply_ratio: like_reply_ratio ?? state.like_reply_ratio,
                responsiveness: responsiveness ?? state.responsiveness,
                // Provider attributes
                reading_scope: reading_scope ?? state.reading_scope,
                information_filtering: information_filtering ?? state.information_filtering,
                sentiment_filtering: sentiment_filtering ?? state.sentiment_filtering,
                profile_scrutiny: profile_scrutiny ?? state.profile_scrutiny,
                // Evaluator attributes
                influencability: influencability ?? state.influencability,
                engagement_sensitivity: engagement_sensitivity ?? state.engagement_sensitivity,
                relationship_formation_speed: relationship_formation_speed ?? state.relationship_formation_speed,
                relationship_closeness_threshold: relationship_closeness_threshold ?? state.relationship_closeness_threshold,
                relationship_stability: relationship_stability ?? state.relationship_stability,
                grudge_persistence: grudge_persistence ?? state.grudge_persistence,
                // Content attributes
                positivity: positivity ?? state.positivity,
                openness: openness ?? state.openness,
                formality: formality ?? state.formality,
                conflict_initiation: conflict_initiation ?? state.conflict_initiation,
                influence_seeking: influence_seeking ?? state.influence_seeking,
                inquisitiveness: inquisitiveness ?? state.inquisitiveness,
                humor: humor ?? state.humor,
                depth: depth ?? state.depth
            };
        }
        case 'GENERATE_RANDOM_TAGS': {
            const randomTags = getRandomWords(10);
            return {
                ...state,
                tags: randomTags.join(', ')
            };
        }
        default:
            return state;
    }
}