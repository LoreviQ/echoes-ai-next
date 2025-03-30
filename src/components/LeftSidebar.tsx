import { navigationItems, loginNavItem } from "@/config/navigation";
import { NavButton } from "@/components/buttons";
import { TypefaceOutlined } from "@/components/branding";
import type { SessionStatus } from "@/types/session";

export default function LeftSidebar({ sessionStatus }: { sessionStatus: SessionStatus }) {
    return (
        <div className={`bg-black text-white w-[84px] xl:w-[280px] h-screen transition-all duration-300 border-r border-gray-600 flex flex-col`}>
            <div className="p-4 space-y-4">
                <TypefaceOutlined
                    text="EchoesAI"
                    path="/"
                    outlineColour="white"
                    className="hidden xl:block text-5xl"
                />
                <TypefaceOutlined
                    text="EAI"
                    path="/"
                    outlineColour="white"
                    className="xl:hidden text-3xl"
                />
                <div className="flex flex-col space-y-2">
                    {navigationItems.map((item) => (
                        <div key={item.path} className="w-full">
                            <NavButton
                                item={item}
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
                    />
                )}
            </div>
        </div>
    );
} 