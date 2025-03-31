export const PROTECTED_ROUTES = ['home', 'notifications', 'login', 'settings'] as const;

// Type for protected routes
export type ProtectedRoute = typeof PROTECTED_ROUTES[number]; 