import React from "react";

export default function RightSidebar({ collapsed = false }: { collapsed?: boolean }) {
    return (
        <div className={`p-4 bg-black text-white ${collapsed ? "w-[340px]" : "w-[400px]"} h-screen transition-all duration-300 border-l border-gray-600`}>
            <h2 className="text-xl font-bold mb-4">{collapsed ? "RS" : "Right Sidebar"}</h2>
            <div className="space-y-2">
                <p>Recent activity</p>
                <p>Notifications</p>
                <p>User settings</p>
            </div>
        </div>
    );
} 