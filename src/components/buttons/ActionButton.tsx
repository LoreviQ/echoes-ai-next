"use client";

import React from "react";
import { type IconComponent } from "@/assets/icons";

export interface ActionButtonProps {
    label: string;
    onClick: () => void;
    icon: IconComponent;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export function ActionButton({ label, onClick, icon: Icon, className, type = 'button' }: ActionButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`
        inline-flex items-center p-2 rounded-xl transition-colors
        bg-black text-white
        hover:bg-gray-600
        ${className || ''}
      `}
        >
            <div className="w-8 h-8 flex items-center justify-center">
                <Icon />
            </div>
            <span className="ml-3">
                {label}
            </span>
        </button>
    );
} 