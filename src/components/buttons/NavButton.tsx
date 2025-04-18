"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type IconComponent } from "@/assets";

export interface NavButtonProps {
    label: string;
    path: string;
    icon: IconComponent;
    className?: string;
}

export function NavButton({ label, path, icon: Icon, className }: NavButtonProps) {
    const pathname = usePathname();
    const isActive = pathname === path;

    return (
        <Link
            href={path}
            className={`
        inline-flex items-center p-2 rounded-xl transition-colors
        bg-black text-white
        hover:bg-zinc-600
        ${isActive ? "font-bold" : "font-normal"}
        ${className}
      `}
        >
            <div className="w-8 h-8 flex items-center justify-center">
                <Icon />
            </div>
            <span className="ml-3 hidden xl:block">
                {label}
            </span>
        </Link>
    );
} 