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

let setupPromise: Promise<string | null> | null = null;
let currentToken: string | null = null;

// Base axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Single interceptor that handles both waiting and token application
api.interceptors.request.use(async (config) => {
    try {
        // If we're in the process of setting up, wait for it
        if (setupPromise) {
            currentToken = await setupPromise;
        }

        // Apply the token if we have one
        if (currentToken) {
            config.headers.Authorization = `Bearer ${currentToken}`;
        }
    } catch (error) {
        console.error('Error in auth interceptor:', error);
    }

    return config;
});

export const setupAuthInterceptor = async () => {
    // Create setup promise if it doesn't exist
    if (!setupPromise) {
        setupPromise = (async () => {
            const token = await getAuthToken();
            currentToken = token;
            return token;
        })();
    }

    // Wait for setup to complete
    await setupPromise;
};

export const cleanupAuthInterceptor = () => {
    setupPromise = null;
    currentToken = null;
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