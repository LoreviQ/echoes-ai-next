import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'


export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const path = req.nextUrl.pathname
    const supabase = createMiddlewareClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();

    // Redirect / to /home
    if (path === '/') {
        return NextResponse.redirect(new URL('/home', req.url))
    }

    // Public URLs
    const publicUrls = ['/home', '/login', '/register'];
    if (publicUrls.includes(path)) {
        return res;
    }

    // Redirect to login if not authenticated
    if (!session) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // Continue with the request for all other paths
    return res;
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