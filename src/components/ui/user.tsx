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

interface UserIdentityProps {
    persona: UserPersonas;
    editable?: boolean;
    onFileSelected?: (file: File | string) => void;
}

export function UserIdentity({ persona, editable = false, onFileSelected }: UserIdentityProps) {
    return (
        <Identity
            name={persona.name || 'Unnamed Persona'}
            avatar_url={persona.avatar_url}
            editable={editable}
            onFileSelected={onFileSelected}
            tooltip={false}
        />
    )
}
