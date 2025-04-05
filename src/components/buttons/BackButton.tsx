"use client";

import { useRouter } from 'next/navigation';
import { CircleActionButton } from './CircleActionButton';
import { LeftArrowIcon } from '@/assets';

export function BackButton() {
    const router = useRouter();

    return (
        <CircleActionButton
            icon={LeftArrowIcon}
            onClick={() => {
                router.back();
            }}
            className="hover:bg-white/20"
        />
    );
} 