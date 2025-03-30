import { NavButton } from "@/components/buttons/NavButton";
import { TypefaceOutlined } from "@/components/branding";
import UserSection from "@/components/UserSection";
import { HomeIcon, DocumentIcon, SettingsIcon } from "@/assets/icons";


const navigationItems = [
    {
        label: "Home",
        path: "/home",
        icon: HomeIcon,
    },
    {
        label: "Notifications",
        path: "/notifications",
        icon: DocumentIcon,
    },
    {
        label: "Settings",
        path: "/settings",
        icon: SettingsIcon,
    },
];

export default function LeftSidebar() {
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
                                label={item.label}
                                path={item.path}
                                icon={item.icon}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <UserSection />
        </div>
    );
} 