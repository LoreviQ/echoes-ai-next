"use client";

import * as React from "react";

interface SwitchProps {
    id?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    className?: string;
}

export default function Switch({ id, checked, onCheckedChange, className = "" }: SwitchProps) {
    return (
        <button
            type="button"
            role="switch"
            id={id}
            aria-checked={checked}
            onClick={(e) => {
                e.preventDefault();
                onCheckedChange(!checked);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
            ${checked ? 'bg-white' : 'bg-zinc-600'} ${className}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform
                ${checked ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    );
} 