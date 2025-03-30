
import type { NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase.middleware'

export async function middleware(request: NextRequest) {
    const publicUrls = ['/home', '/login'];
    return await updateSession(request, publicUrls)
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