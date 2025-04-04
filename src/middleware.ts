import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase.middleware'
import { UserPreferences, DEFAULT_PREFERENCES } from '@/types/preferences'

export async function middleware(request: NextRequest) {
    const privateUrls = ['/notifications', '/settings'];

    // Handle root path redirection
    if (request.nextUrl.pathname === '/') {
        const url = request.nextUrl.clone()
        url.pathname = '/home'
        return NextResponse.redirect(url)
    }

    // Get the response from the authentication middleware
    const response = await updateSession(request, privateUrls)

    // Read user preferences from cookie or use default values
    let preferences: UserPreferences = DEFAULT_PREFERENCES
    const preferencesStr = request.cookies.get('user_preferences')?.value
    if (preferencesStr) {
        try {
            preferences = JSON.parse(preferencesStr)
        } catch (e) {
            console.error('Failed to parse user preferences:', e)
        }
    }

    // Add user preferences to response headers so client components can access them
    response.headers.set('x-right-sidebar-expanded', String(preferences.rightSidebarExpanded))
    response.headers.set('x-left-sidebar-expanded', String(preferences.leftSidebarExpanded))
    response.headers.set('x-sidebar-content-type', preferences.sidebarContentType)
    response.headers.set('x-current-character', preferences.currentCharacter)

    return response
}

// Configure which paths the middleware will run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ]
}