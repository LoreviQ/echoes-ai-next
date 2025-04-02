"use client";

import React from "react";
import { type IconComponent } from "@/assets/icons";

export interface CircleActionButtonProps {
    onClick: () => void;
    icon: IconComponent;
    className?: string;
    tooltip?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function CircleActionButton({ onClick, icon: Icon, className, tooltip, disabled, size = 'md' }: CircleActionButtonProps) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10'
    };
    const iconSizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-5 h-5',
        lg: 'w-7 h-7'
    };

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
                ${sizeClasses[size]} rounded-full transition-colors
                flex items-center justify-center
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                ${className || ''}
            `}
        >
            <Icon className={iconSizeClasses[size]} />
        </button>
    );
} 