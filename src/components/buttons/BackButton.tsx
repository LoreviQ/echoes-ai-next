"use client";

import { useRouter } from 'next/navigation';
import { CircleActionButton } from './CircleActionButton';
import { LeftArrowIcon } from '@/assets/icons';

export function BackButton() {
    const router = useRouter();

    return (
        <CircleActionButton
            icon={LeftArrowIcon}
            onClick={() => router.back()}
            className="hover:bg-white/20"
        />
    );
} 