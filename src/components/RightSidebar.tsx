import React from "react";

export default function RightSidebar() {
    return (
        <div className="p-4 bg-black text-white w-[340px] xl:w-[400px] h-screen transition-all duration-300 border-l border-gray-600">
            <h2 className="text-xl font-bold mb-4">
                <span className="xl:hidden">RS</span>
                <span className="hidden xl:inline">Right Sidebar</span>
            </h2>
            <div className="space-y-2">
                <p>Recent activity</p>
                <p>Notifications</p>
                <p>User settings</p>
            </div>
        </div>
    );
}