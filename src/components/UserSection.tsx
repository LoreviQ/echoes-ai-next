'use client';

import { useSession } from '@/contexts/session.client';
import { NavButton } from "@/components/buttons";
import { LoginIcon } from "@/assets/icons";

export default function UserSection() {
    const sessionStatus = useSession();
    return (
        <div className="mt-auto border-t border-gray-600 h-[84px] flex items-center justify-center">
            {sessionStatus.active ? (
                <span className="text-sm text-gray-300">Logged In</span>
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