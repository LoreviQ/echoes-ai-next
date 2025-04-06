import { PROTECTED_ROUTES } from "@/config/routes";

export function nameToPath(name: string): string {
    if (!name) return '';

    // Convert to lowercase and replace spaces/special chars with hyphens
    const path = name.toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '')     // Remove non-alphanumeric chars (except hyphens)
        .replace(/-+/g, '-')            // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, '');       // Remove leading/trailing hyphens

    // If the path matches a protected route, append a random string
    if (PROTECTED_ROUTES.includes(path as any)) {
        return `${path} -${Math.random().toString(36).substring(2, 8)} `;
    }

    return path || 'unnamed-character';  // Fallback if empty
}
