import { createClient } from '@/utils/supabase.server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    console.log('Auth callback');
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(new URL(next ?? '/home', origin))
        }
    }
    console.log('Auth complete');

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
} 