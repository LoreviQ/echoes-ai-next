import { navigationItems, loginNavItem } from "@/config/navigation";
import { NavButton } from "@/components/buttons";
import { TypefaceOutlined } from "@/components/branding";
import type { SessionStatus } from "@/types/session";

export default function LeftSidebar({ collapsed = false, sessionStatus }: { collapsed?: boolean, sessionStatus: SessionStatus }) {
    return (
        <div className={`bg-black text-white ${collapsed ? "w-[84px]" : "w-[280px]"} h-screen transition-all duration-300 border-r border-gray-600 flex flex-col`}>
            <div className="p-4 space-y-4">
                <TypefaceOutlined text={collapsed ? "EAI" : "EchoesAI"} path="/" outlineColour="white" collapsed={collapsed} />
                <div className="flex flex-col space-y-2">
                    {navigationItems.map((item) => (
                        <div key={item.path} className="w-full">
                            <NavButton
                                item={item}
                                collapsed={collapsed}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-auto border-t border-gray-600 h-[84px] flex items-center justify-center">
                {sessionStatus.active ? (
                    <span className="text-sm text-gray-300">Logged In</span>
                ) : (
                    <NavButton
                        item={loginNavItem}
                        collapsed={collapsed}
                    />
                )}
            </div>
        </div>
    );
} 