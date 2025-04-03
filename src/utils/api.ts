// Relative url gets redirected to the backend
const API_BASE_URL = '/api';
export const API_VERSION = "v1";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthToken } from '@/utils/supabase.client';

// Type for an endpoint with auth status
export type Endpoint = {
    endpoint: string;
    public: boolean;
};

// Base axios instance
const axiosApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Define endpoints with their authentication requirements
export const endpoints = {
    characters: {
        posts(characterId: string): Endpoint {
            return {
                endpoint: `/${API_VERSION}/characters/${characterId}/posts`,
                public: true
            }
        },
        generate: {
            endpoint: `/${API_VERSION}/generations/character`,
            public: true
        },
        generateAvatar: {
            endpoint: `/${API_VERSION}/generations/character/avatar`,
            public: true
        },
        generateBanner: {
            endpoint: `/${API_VERSION}/generations/character/banner`,
            public: true
        },
    },
    user: {
        recommendations: {
            endpoint: `/${API_VERSION}/users/foryou`,
            public: false
        },
    },
};

// Apply auth token to request config if needed
async function applyAuthIfNeeded(
    endpoint: Endpoint,
    config?: AxiosRequestConfig
): Promise<AxiosRequestConfig> {
    const finalConfig = config || {};

    // Skip auth for public endpoints
    if (endpoint.public) {
        return finalConfig;
    }

    // Get auth token for private endpoints
    const token = await getAuthToken();
    if (!token) {
        throw new Error('Authentication required');
    }

    // Set auth header
    finalConfig.headers = {
        ...finalConfig.headers,
        'Authorization': `Bearer ${token}`
    };

    return finalConfig;
}

export const api = {
    // Wrapper for GET requests
    async get<T = any>(
        endpoint: Endpoint,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        const finalConfig = await applyAuthIfNeeded(endpoint, config);
        return axiosApi.get<T>(endpoint.endpoint, finalConfig);
    },

    // Wrapper for POST requests
    async post<T = any, D = any>(
        endpoint: Endpoint,
        data?: D,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        const finalConfig = await applyAuthIfNeeded(endpoint, config);
        return axiosApi.post<T>(endpoint.endpoint, data, finalConfig);
    },

    // Wrapper for PUT requests
    async put<T = any, D = any>(
        endpoint: Endpoint,
        data?: D,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        const finalConfig = await applyAuthIfNeeded(endpoint, config);
        return axiosApi.put<T>(endpoint.endpoint, data, finalConfig);
    },

    // Wrapper for DELETE requests
    async delete<T = any>(
        endpoint: Endpoint,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        const finalConfig = await applyAuthIfNeeded(endpoint, config);
        return axiosApi.delete<T>(endpoint.endpoint, finalConfig);
    }
}