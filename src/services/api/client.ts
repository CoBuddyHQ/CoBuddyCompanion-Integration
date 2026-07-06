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

// ─── Environment Config ───────────────────────────────────────────────────────
// Base URL is set at build time via environment variable.
// For development: use a local stub or staging URL.
// NEVER hardcode production credentials here.
// Base URL: set this to your real staging/production URL before Phase 3.
// In production builds, replace via a config module or react-native-config.
const BASE_URL = 'https://api.staging.cobuddy.in/v1';
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
 * Token provider — injected at runtime by AuthStore.
 * This avoids a direct Zustand import here (circular dependency risk).
 */
let _getToken: (() => string | null) | null = null;
let _onUnauthorized: (() => void) | null = null;

/**
 * Call this once at app startup (in App.tsx) to wire the auth store into
 * the API client without creating a circular import.
 */
export function configureApiClient(options: {
  getToken: () => string | null;
  onUnauthorized: () => void;
}): void {
  _getToken = options.getToken;
  _onUnauthorized = options.onUnauthorized;
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = _getToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Safe log — method and URL only, no body/token
    logger.log(`→ ${config.method?.toUpperCase() ?? 'REQ'} ${config.url ?? ''}`)  ;
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// ─── Response Interceptor — Error Mapping ─────────────────────────────────────

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.log(`← ${response.status} ${response.config.url ?? ''}`)  ;
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    logger.error(`← ${status ?? 'NET'} ${error.config?.url ?? 'unknown'}`);

    // 401 — session expired or invalid token
    if (status === 401) {
      _onUnauthorized?.();
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
  const response = await apiClient.get<T>(path, {params});
  return response.data;
}

/**
 * POST request — returns unwrapped data.
 */
export async function apiPost<T>(
  path: string,
  body?: unknown,
): Promise<T> {
  const response = await apiClient.post<T>(path, body);
  return response.data;
}

/**
 * PATCH request — returns unwrapped data.
 */
export async function apiPatch<T>(
  path: string,
  body?: unknown,
): Promise<T> {
  const response = await apiClient.patch<T>(path, body);
  return response.data;
}

/**
 * DELETE request — returns unwrapped data.
 */
export async function apiDelete<T>(
  path: string,
): Promise<T> {
  const response = await apiClient.delete<T>(path);
  return response.data;
}

/**
 * Multipart POST — for file uploads (KYC documents, photos, evidence).
 */
export async function apiUpload<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const response = await apiClient.post<T>(path, formData, {
    headers: {'Content-Type': 'multipart/form-data'},
    timeout: 30_000,  // Uploads get a longer timeout
  });
  return response.data;
}
