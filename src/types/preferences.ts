

export interface UserPreferences {
    rightSidebarExpanded: boolean;
    leftSidebarExpanded: boolean;
    sidebarContentType: string;
    currentCharacter: string;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
    rightSidebarExpanded: false,
    leftSidebarExpanded: false,
    sidebarContentType: 'none',
    currentCharacter: ''
}; 