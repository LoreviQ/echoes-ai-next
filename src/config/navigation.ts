import { type IconComponent, HomeIcon, DocumentIcon, SettingsIcon, LoginIcon } from "@/assets/icons";


export interface NavItem {
    label: string;
    path: string;
    icon: IconComponent;
}

export const navigationItems: NavItem[] = [
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

export const loginNavItem: NavItem = {
    label: "Login",
    path: "/login",
    icon: LoginIcon,
};