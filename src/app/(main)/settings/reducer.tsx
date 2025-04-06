import { NsfwFilter } from "@/types/user";
import { UserPersonasSchema, UserPersonas } from "@/types";

export interface SettingsState {
    nsfw_filter: NsfwFilter;
    isSubmitting: boolean;
    user_id: string | null;
    personas: UserPersonasSchema[];
    newPersonas: Array<UserPersonas & { temp_id: string }>;
    deletedPersonaIds: string[];
}


export type SettingsAction =
    | { type: 'SET_FIELD'; field: keyof SettingsState; value: any }
    | { type: 'ADD_PERSONA'; persona: UserPersonas & { temp_id: string } }
    | { type: 'UPDATE_PERSONA'; id: string; updates: Partial<UserPersonas> }
    | { type: 'DELETE_PERSONA'; id: string }
    | { type: 'LOAD_PERSONAS'; personas: UserPersonasSchema[] };

export const initialSettingsState: SettingsState = {
    nsfw_filter: 'hide',
    isSubmitting: false,
    user_id: null,
    personas: [],
    newPersonas: [],
    deletedPersonaIds: []
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
        case 'LOAD_PERSONAS':
            return {
                ...state,
                personas: action.personas
            };
        case 'ADD_PERSONA':
            return {
                ...state,
                newPersonas: [...state.newPersonas, action.persona]
            };
        case 'UPDATE_PERSONA':
            // Check if it's an existing persona or a new one
            if (state.personas.some(p => p.id === action.id)) {
                return {
                    ...state,
                    personas: state.personas.map(p =>
                        p.id === action.id ? { ...p, ...action.updates } : p
                    )
                };
            } else {
                return {
                    ...state,
                    newPersonas: state.newPersonas.map(p =>
                        p.temp_id === action.id ? { ...p, ...action.updates } : p
                    )
                };
            }
        case 'DELETE_PERSONA':
            // If it's an existing persona, add to deletedPersonaIds
            if (state.personas.some(p => p.id === action.id)) {
                return {
                    ...state,
                    personas: state.personas.filter(p => p.id !== action.id),
                    deletedPersonaIds: [...state.deletedPersonaIds, action.id]
                };
            } else {
                // If it's a new persona, just remove it from newPersonas
                return {
                    ...state,
                    newPersonas: state.newPersonas.filter(p => p.temp_id !== action.id)
                };
            }
        default:
            return state;
    }
}