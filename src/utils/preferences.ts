import { setCookie } from 'nookies'

import { UserPreferences, DEFAULT_PREFERENCES } from '@/types';

export function setPreference<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) {
    // Get current preferences from cookie or use defaults
    let preferences: UserPreferences
    try {
        const preferencesStr = document.cookie
            .split('; ')
            .find(row => row.startsWith('user_preferences='))
            ?.split('=')[1]
        preferences = preferencesStr ? JSON.parse(decodeURIComponent(preferencesStr)) : { ...DEFAULT_PREFERENCES }
    } catch (e) {
        console.error('Failed to parse user preferences:', e)
        preferences = { ...DEFAULT_PREFERENCES }
    }

    // Update the specific preference
    preferences[key] = value

    // Save updated preferences back to cookie
    setCookie(null, 'user_preferences', JSON.stringify(preferences), {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
    })

    return preferences
} 