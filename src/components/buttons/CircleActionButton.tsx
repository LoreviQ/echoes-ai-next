"use client";

import React from "react";
import { type IconComponent } from "@/assets/icons";

export interface CircleActionButtonProps {
    onClick: () => void;
    icon: IconComponent;
    className?: string;
}

export function CircleActionButton({ onClick, icon: Icon, className }: CircleActionButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`
                w-10 h-10 rounded-full transition-colors
                flex items-center justify-center
                ${className || ''}
            `}
        >
            <Icon className="w-5 h-5" />
        </button>
    );
} 