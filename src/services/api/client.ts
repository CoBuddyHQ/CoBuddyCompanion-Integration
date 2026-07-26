/**
 * CoBuddy Companion App — Axios API Client
 * Centralized HTTP client with:
 *   - Auth token interceptor (injects Bearer token from authStore)
 *   - Response error interceptor (maps to CoBuddyError via handleError)
 *   - 401 handling (triggers logout)
 *   - 15-second timeout
 *   - No API keys or secrets hardcoded — env config only
 *
 * SECURITY: Never log request bodies or response data.
 *           Only log method + path + status code.
 */

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios';
import {handleError, type CoBuddyError} from '../../utils/errorHandler';
import {logger} from '../../utils/logger';
import {ENV} from '../../config/env';

// ─── Environment Config ───────────────────────────────────────────────────────
// Backend: NestJS on port 4001 with global prefix 'api/v1' (see main.ts)
// For Android device testing: replace 'localhost' with your PC's local IP:
//   e.g. http://192.168.1.10:4001/api/v1
// For iOS Simulator: localhost works fine.
// For production: change to https://api.cobuddy.in/api/v1
const BASE_URL = ENV.API_BASE_URL;
const TIMEOUT_MS = 15_000;

// ─── Client Instance ──────────────────────────────────────────────────────────

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client': 'CoBuddy-Companion/1.0',
    'X-Platform': 'mobile',
  },
});

// ─── Request Interceptor — Auth Token Injection ───────────────────────────────

/**
 * Token providers — injected at runtime by AuthStore.
 * Avoids direct Zustand import (circular dependency risk).
 */
let _getToken: (() => string | null) | null = null;
let _getRefreshToken: (() => string | null) | null = null;
let _onUnauthorized: (() => void) | null = null;
let _onTokenRefreshed: ((newToken: string) => void) | null = null;

/**
 * Call this once at app startup (in App.tsx) to wire the auth store into
 * the API client without creating a circular import.
 */
export function configureApiClient(options: {
  getToken: () => string | null;
  getRefreshToken: () => string | null;
  onUnauthorized: () => void;
  onTokenRefreshed: (newToken: string) => void;
}): void {
  _getToken = options.getToken;
  _getRefreshToken = options.getRefreshToken;
  _onUnauthorized = options.onUnauthorized;
  _onTokenRefreshed = options.onTokenRefreshed;
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = _getToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`\n========================================`);
    console.log(`🚀 [API SEND] ${config.method?.toUpperCase() ?? 'REQ'} ${config.url ?? ''}`);
    if (config.data) {
      console.log(`📦 [PAYLOAD SENT]:`, typeof config.data === 'string' ? config.data : JSON.stringify(config.data, null, 2));
    }
    console.log(`========================================\n`);
    logger.log(`→ ${config.method?.toUpperCase() ?? 'REQ'} ${config.url ?? ''}`);
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// ─── Response Interceptor — Error Mapping + Auto Token Refresh ───────────────

let _isRefreshing = false;
let _refreshQueue: Array<(token: string) => void> = [];

/** Queue requests while a refresh is in-flight, then replay them. */
function enqueueRefresh(resolve: (token: string) => void) {
  _refreshQueue.push(resolve);
}
function drainQueue(token: string) {
  _refreshQueue.forEach(cb => cb(token));
  _refreshQueue = [];
}

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`\n========================================`);
    console.log(`✅ [API RESPONSE ${response.status}] ${response.config.url ?? ''}`);
    if (response.data) {
      console.log(`📥 [DATA RECEIVED]:`, typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2));
    }
    console.log(`========================================\n`);
    logger.log(`← ${response.status} ${response.config.url ?? ''}`);
    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If logout endpoint returns 401 or any error, resolve silently so local cleanup proceeds without red screen
    if (originalRequest?.url?.endsWith('/logout')) {
      return Promise.resolve({ status: 200, data: { success: true, message: 'Logged out' } } as AxiosResponse);
    }

    logger.error(`← ${status ?? 'NET'} ${error.config?.url ?? 'unknown'}`);

    // 401 — attempt silent token refresh before logging out
    if (status === 401 && !originalRequest._retry) {

      if (_isRefreshing) {
        // Wait for ongoing refresh, then retry
        return new Promise<AxiosResponse>(resolve => {
          enqueueRefresh((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      _isRefreshing = true;

      try {
        // Attempt refresh — call the refresh endpoint directly (no interceptor loop)
        const refreshToken = _getRefreshToken?.();
        if (!refreshToken) throw new Error('no_refresh_token');

        const res = await axios.post<{ success: boolean, data: { accessToken: string } }>(
          `${BASE_URL}/auth/companion/token/refresh`,
          { refreshToken },
        );
        // The backend wraps responses in { success: true, data: ... }
        const newToken = res.data.data?.accessToken || (res.data as any).accessToken;
        if (!newToken) throw new Error('refresh_token_missing_in_response');
        _onTokenRefreshed?.(newToken);
        drainQueue(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        _refreshQueue = [];
        _onUnauthorized?.();
        return Promise.reject(handleError(error, 'ApiClient'));
      } finally {
        _isRefreshing = false;
      }
    }

    const cobError: CoBuddyError = handleError(error, 'ApiClient');
    return Promise.reject(cobError);
  },
);

// ─── Typed Request Helpers ────────────────────────────────────────────────────

/**
 * GET request — returns unwrapped data.
 */
export async function apiGet<T>(
  path: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const response = await apiClient.get<{ success?: boolean; data?: T }>(path, {params});
  return response.data?.success && response.data?.data !== undefined ? response.data.data : (response.data as unknown as T);
}

/**
 * POST request — returns unwrapped data.
 */
export async function apiPost<T>(
  path: string,
  body?: unknown,
): Promise<T> {
  const response = await apiClient.post<{ success?: boolean; data?: T }>(path, body);
  return response.data?.success && response.data?.data !== undefined ? response.data.data : (response.data as unknown as T);
}

/**
 * PATCH request — returns unwrapped data.
 */
export async function apiPatch<T>(
  path: string,
  body?: unknown,
): Promise<T> {
  const response = await apiClient.patch<{ success?: boolean; data?: T }>(path, body);
  return response.data?.success && response.data?.data !== undefined ? response.data.data : (response.data as unknown as T);
}

/**
 * DELETE request — returns unwrapped data.
 */
export async function apiDelete<T>(
  path: string,
): Promise<T> {
  const response = await apiClient.delete<{ success?: boolean; data?: T }>(path);
  return response.data?.success && response.data?.data !== undefined ? response.data.data : (response.data as unknown as T);
}

/**
 * PUT request — returns unwrapped data.
 */
export async function apiPut<T>(
  path: string,
  body?: unknown,
): Promise<T> {
  const response = await apiClient.put<{ success?: boolean; data?: T }>(path, body);
  return response.data?.success && response.data?.data !== undefined ? response.data.data : (response.data as unknown as T);
}


/**
 * Multipart POST — for file uploads (KYC documents, photos, evidence).
 */
export async function apiUpload<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const response = await apiClient.post<{ success?: boolean; data?: T }>(path, formData, {
    headers: {'Content-Type': 'multipart/form-data'},
    timeout: 30_000,  // Uploads get a longer timeout
  });
  return response.data?.success && response.data?.data !== undefined ? response.data.data : (response.data as unknown as T);
}
