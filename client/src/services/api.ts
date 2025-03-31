/**
 * Generic API service to handle all HTTP requests
 */

import { useLocation } from "wouter";

// Types for request configurations
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  mode?: RequestMode;
  credentials?: RequestCredentials;
  useAuth?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Base URL from environment variables or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Get auth token from local storage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Add authorization header if token exists and useAuth is true
 */
const addAuthHeader = (headers: Record<string, string>, useAuth: boolean | undefined): Record<string, string> => {
  if (useAuth === false) return headers;

  const token = getAuthToken();
  if (!token) return headers;

  return {
    ...headers,
    'Authorization': `Bearer ${token}`
  };
};

/**
 * Build and execute an API request
 * @param endpoint - API endpoint path (without the base URL)
 * @param config - Request configuration options
 * @returns Promise with the response data
 */
export async function buildRequest<T = any>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  try {
    // Ensure endpoint starts with /
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${path}`;

    // Default configuration
    const defaultConfig: RequestConfig = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      useAuth: true, // Default to using auth
    };

    // Merge configurations
    const mergedConfig: RequestConfig = {
      ...defaultConfig,
      ...config,
      headers: addAuthHeader(
        {
          ...defaultConfig.headers,
          ...config.headers,
        },
        // Explicitly determine if auth should be used - defaultConfig.useAuth is true
        config.useAuth !== undefined ? config.useAuth : defaultConfig.useAuth
      ),
    };

    // For methods with body, stringify the body if it's not already a string and not FormData
    if (mergedConfig.body && typeof mergedConfig.body !== 'string' && !(mergedConfig.body instanceof FormData)) {
      mergedConfig.body = JSON.stringify(mergedConfig.body);
    }

    // If using FormData, let the browser set the Content-Type header
    if (mergedConfig.body instanceof FormData) {
      // Remove content-type to let browser set it with proper boundary
      if (mergedConfig.headers && 'Content-Type' in mergedConfig.headers) {
        delete mergedConfig.headers['Content-Type'];
      }
    }

    // Remove useAuth from the final config as it's not a valid fetch option
    const { useAuth, ...fetchConfig } = mergedConfig;

    // Execute the request
    const response = await fetch(url, fetchConfig as RequestInit);

    // Parse the JSON response
    const data = await response.json();

    // Check if the request was successful
    if (!response.ok) {
      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401 && useAuth) {
        // Clear auth data and redirect to login
        // localStorage.removeItem('token');
        // localStorage.removeItem('user');
        // window.location.href = '/login';
      }

      return {
        success: false,
        error: data.message || `Request failed with status ${response.status}`,
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Common API methods
 */
export const api = {
  get: <T = any>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    buildRequest<T>(endpoint, { ...config, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>) =>
    buildRequest<T>(endpoint, { ...config, method: 'POST', body }),

  put: <T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>) =>
    buildRequest<T>(endpoint, { ...config, method: 'PUT', body }),

  patch: <T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>) =>
    buildRequest<T>(endpoint, { ...config, method: 'PATCH', body }),

  delete: <T = any>(endpoint: string, config?: Omit<RequestConfig, 'method'>) =>
    buildRequest<T>(endpoint, { ...config, method: 'DELETE' }),
}; 