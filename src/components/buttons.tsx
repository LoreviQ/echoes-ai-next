"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/config/navigation";

interface NavButtonProps {
    item: NavItem;
}

export function NavButton({ item }: NavButtonProps) {
    const pathname = usePathname();
    const isActive = pathname === item.path;

    return (
        <Link
            href={item.path}
            className={`
        inline-flex items-center p-2 rounded-xl transition-colors
        bg-black text-white
        hover:bg-gray-600
        ${isActive ? "font-bold" : "font-normal"}
      `}
        >
            <div className="w-8 h-8 flex items-center justify-center">
                <item.icon />
            </div>
            <span className="ml-3 md:hidden xl:block">
                {item.label}
            </span>
        </Link>
    );
} 