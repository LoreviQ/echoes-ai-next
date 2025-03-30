'use client';

import { useSession } from '@/contexts/session.client';
import { NavButton, UserButton } from "@/components/buttons";
import { LoginIcon } from "@/assets/icons";

export default function UserSection() {
    const sessionStatus = useSession();
    return (
        <div className="mt-auto border-t border-gray-600 h-[84px] flex items-center justify-center p-2">
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