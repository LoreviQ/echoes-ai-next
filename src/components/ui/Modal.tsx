'use client';

import React from 'react';
import Link from 'next/link';
import { TopLeftArrowIcon } from '@/assets/icons';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    redirectPath?: string;
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    redirectPath,
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`bg-black rounded-xl p-6 w-full max-w-[660px] relative border border-zinc-600 max-h-[calc(100vh-2rem)] overflow-y-auto`}>
                {redirectPath && (
                    <Link
                        href={redirectPath}
                        className="absolute top-4 left-4 text-zinc-400 hover:text-white"
                        onClick={onClose}
                    >
                        <TopLeftArrowIcon className="w-6 h-6" />
                    </Link>
                )}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-xl font-bold mb-4 text-white text-center px-12">{title}</h2>
                {children}
            </div>
        </div>
    );
} 