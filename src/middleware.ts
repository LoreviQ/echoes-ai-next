import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Redirect / to /home
    if (path === '/') {
        return NextResponse.redirect(new URL('/home', request.url))
    }

    // Continue with the request for all other paths
    return NextResponse.next()
}

// Configure which paths the middleware will run on
export const config = {
    matcher: '/'
}