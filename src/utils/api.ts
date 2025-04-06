// Relative url gets redirected to the backend
const API_BASE_URL = '/api';
const API_VERSION = "v1";
import axios from "axios";
import { getAuthToken } from './supabase.client';

// Type for an endpoint with auth status
export type Endpoint = {
    endpoint: string;
    public: boolean;
};

// Base axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let authInterceptorId: number | null = null;

export const setupAuthInterceptor = async (isAuthenticated: boolean) => {
    // Remove existing interceptor if it exists
    if (authInterceptorId !== null) {
        api.interceptors.request.eject(authInterceptorId);
        authInterceptorId = null;
    }

    // Add new interceptor if session is active
    if (isAuthenticated) {
        authInterceptorId = api.interceptors.request.use(async (config) => {
            const token = await getAuthToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }
};

export const cleanupAuthInterceptor = () => {
    if (authInterceptorId !== null) {
        api.interceptors.request.eject(authInterceptorId);
        authInterceptorId = null;
    }
};

// Define endpoints with their authentication requirements
export const endpoints = {
    characters: {
        posts: (characterId: string) => `/${API_VERSION}/characters/${characterId}/posts`,
        generate: `/${API_VERSION}/generations/character`,
        generateAvatar: `/${API_VERSION}/generations/character/avatar`,
        generateBanner: `/${API_VERSION}/generations/character/banner`,
        generateAttributes: `/${API_VERSION}/generations/character/attributes`,
    },
    user: {
        recommendations: `/${API_VERSION}/users/foryou`,
    },
};