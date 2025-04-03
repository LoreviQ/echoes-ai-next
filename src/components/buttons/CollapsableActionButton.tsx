"use client";

import React from "react";
import { type IconComponent } from "@/assets/icons";

export interface ActionButtonProps {
    label: string;
    onClick: () => void;
    icon: IconComponent;
    className?: string;
    tooltip?: string;
}

export function CollapsableActionButton({ label, onClick, icon: Icon, className, tooltip }: ActionButtonProps) {
    return (
        <button
            onClick={onClick}
            title={tooltip}
            className={`
        inline-flex items-center p-2 rounded-xl transition-colors
        bg-black text-white
        hover:bg-zinc-600
        ${className || ''}
      `}
        >
            <div className="w-8 h-8 flex items-center justify-center">
                <Icon />
            </div>
            <span className="ml-3 md:hidden xl:block">
                {label}
            </span>
        </button>
    );
} 