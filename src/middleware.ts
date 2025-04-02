import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase.middleware'

export async function middleware(request: NextRequest) {
    const publicUrls = ['/home', '/login'];

    // Handle root path redirection
    if (request.nextUrl.pathname === '/') {
        const url = request.nextUrl.clone()
        url.pathname = '/home'
        return NextResponse.redirect(url)
    }

    // Get the response from the authentication middleware
    const response = await updateSession(request, publicUrls)

    // Read sidebar preference from cookies or use default value
    const rightSidebarExpanded = request.cookies.get('right_sidebar_expanded')?.value === 'true' || false

    // Add user preference to response headers so client components can access it
    response.headers.set('x-right-sidebar-expanded', String(rightSidebarExpanded))

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