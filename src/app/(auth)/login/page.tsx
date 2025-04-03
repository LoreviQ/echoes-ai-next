'use client';

import { TypefaceOutlined } from '@/assets/branding';
import { GitHubIcon, GoogleIcon } from '@/assets/brandIcons';
import { createClient } from '@/utils/supabase.client';
import { Provider } from '@supabase/supabase-js';

interface LoginProvider {
    id: Provider;
    name: string;
    icon: React.FC<{ className?: string }>;
    label: string;
    style: {
        background: string;
        text: string;
        hoverBg: string;
    };
}

const providers: LoginProvider[] = [
    {
        id: 'github',
        name: 'GitHub',
        icon: GitHubIcon,
        label: 'Continue with GitHub',
        style: {
            background: '#24292F',
            text: 'white',
            hoverBg: '#24292F/90',
        },
    },
    {
        id: 'google',
        name: 'Google',
        icon: GoogleIcon,
        label: 'Continue with Google',
        style: {
            background: 'white',
            text: 'rgb(0 0 0)',
            hoverBg: 'rgb(243 244 246)',
        },
    },
];

export default function LoginPage() {
    const supabase = createClient();

    const handleLogin = async (providerId: Provider) => {
        await supabase.auth.signInWithOAuth({
            provider: providerId,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });
    };

    return (
        <div className="w-full max-w-md p-8 border border-white rounded-lg bg-black space-y-4">
            <TypefaceOutlined
                text="EchoesAI"
                path="/"
                outlineColour="white"
                className="text-5xl mb-8"
            />
            {providers.map((provider) => (
                <button
                    key={provider.id}
                    onClick={() => handleLogin(provider.id)}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors hover:opacity-90`}
                    style={{
                        backgroundColor: provider.style.background,
                        color: provider.style.text,
                    }}
                >
                    <provider.icon className="w-5 h-5" />
                    <span>{provider.label}</span>
                </button>
            ))}
        </div>
    );
} 