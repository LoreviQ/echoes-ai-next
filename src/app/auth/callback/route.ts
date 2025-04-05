import { createServerClient } from '@/utils';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    console.log('Auth callback');
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/home'

    if (code) {
        const supabase = await createServerClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(new URL(next, origin))
        }
    }
    console.log('Auth complete');

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
} 