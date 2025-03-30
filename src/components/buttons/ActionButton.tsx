"use client";

import React from "react";
import { type IconComponent } from "@/assets/icons";

export interface ActionButtonProps {
    label: string;
    onClick: () => void;
    icon: IconComponent;
}

export function ActionButton({ label, onClick, icon: Icon }: ActionButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`
        inline-flex items-center p-2 rounded-xl transition-colors
        bg-black text-white
        hover:bg-gray-600
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