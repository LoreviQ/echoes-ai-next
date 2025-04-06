'use client';

import { useSession } from '@/contexts';
import { NavButton, UserButton } from "@/components/buttons";
import { LoginIcon } from "@/assets";
import { Identity } from './genericDisplay';
import { UserPersonas } from '@/types';

export function UserSection() {
    const sessionStatus = useSession();
    return (
        <div className="mt-auto border-t border-zinc-600 h-[84px] flex items-center justify-center p-2">
            {sessionStatus.active && sessionStatus.user ? (
                <UserButton user={sessionStatus.user} />
            ) : (
                <NavButton
                    label={"Login"}
                    path={"/login"}
                    icon={LoginIcon}
                />
            )}
        </div>
    );
}

export function UserIdentity({ persona }: { persona: UserPersonas }) {
    return (
        <Identity
            name={persona.name || 'Unnamed Persona'}
            avatar_url={persona.avatar_url}
        />
    )
}
