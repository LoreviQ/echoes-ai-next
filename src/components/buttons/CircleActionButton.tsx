"use client";

import React from "react";
import { type IconComponent } from "@/assets/icons";

export interface CircleActionButtonProps {
    onClick: () => void;
    icon: IconComponent;
    className?: string;
    tooltip?: string;
    disabled?: boolean;
}

export function CircleActionButton({ onClick, icon: Icon, className, tooltip, disabled }: CircleActionButtonProps) {
    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                if (!disabled) {
                    onClick();
                }
            }}
            title={tooltip}
            disabled={disabled}
            className={`
                w-10 h-10 rounded-full transition-colors
                flex items-center justify-center
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                ${className || ''}
            `}
        >
            <Icon className="w-5 h-5" />
        </button>
    );
} 