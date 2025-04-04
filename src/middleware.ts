import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase.middleware'

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

    // Read sidebar preferences from cookies or use default values
    const rightSidebarExpanded = request.cookies.get('right_sidebar_expanded')?.value === 'true' || false
    const sidebarContentType = request.cookies.get('sidebar_content_type')?.value || 'thoughts'
    const currentCharacter = request.cookies.get('current_character')?.value || ''

    // Add user preferences to response headers so client components can access them
    response.headers.set('x-right-sidebar-expanded', String(rightSidebarExpanded))
    response.headers.set('x-sidebar-content-type', sidebarContentType)
    response.headers.set('x-current-character', currentCharacter)

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