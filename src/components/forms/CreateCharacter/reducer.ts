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
            const { name, bio, description, appearance, gender, nsfw } = action.data;
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
                path: nameToPath(name || state.name) // Update path based on name
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