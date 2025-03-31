"use client";

import React from "react";

interface SubmitButtonProps {
    label: string;
    className?: string;
}

export function SubmitButton({ label, className }: SubmitButtonProps) {
    return (
        <button
            type="submit"
            className={`
                inline-flex items-center p-2 rounded-xl transition-colors
                bg-black text-white border border-zinc-600
                hover:bg-zinc-600
                ${className || ''}
            `}
        >
            {label}
        </button>
    );
} 