/**
 * CoBuddy Companion — Centralized Environment Configuration
 * Provides strongly-typed access to all frontend environment variables.
 * Automatically resolves 'localhost' -> '10.0.2.2' on Android Emulators.
 */

import { Platform } from 'react-native';
import {
  API_BASE_URL as configuredApiUrl,
  SOCKET_URL as configuredSocketUrl,
  APP_ENV as configuredAppEnv,
  GOOGLE_MAPS_API_KEY as configuredMapsKey,
  RAZORPAY_KEY_ID as configuredRazorpayKey,
  FCM_SENDER_ID as configuredFcmSenderId,
  FIREBASE_APP_ID as configuredFirebaseAppId,
  ENABLE_LOGGING as configuredLogging,
  DEFAULT_LANGUAGE as configuredLanguage,
  REQUEST_TIMEOUT_MS as configuredTimeout,
} from '@env';

const LOCAL_DOCKER_API_URL = 'http://10.0.2.2:4001/api/v1';
const LOCAL_DOCKER_SOCKET_URL = 'http://10.0.2.2:4001';

export type CompanionAppEnvironment = 'development' | 'test' | 'staging' | 'production';

export const resolveCompanionEndpoints = (
  appEnvironment: string | undefined,
  apiBaseUrl: string | undefined,
  socketUrl: string | undefined,
  platform: string,
) => {
  const environment = (appEnvironment || 'development').trim().toLowerCase();
  if (!['development', 'test', 'staging', 'production'].includes(environment)) {
    throw new Error('[ConfigurationError] APP_ENV must be development, test, staging, or production.');
  }
  const isDeployedEnvironment = environment === 'staging' || environment === 'production';
  const rawApiUrl = apiBaseUrl?.trim() || (isDeployedEnvironment ? '' : LOCAL_DOCKER_API_URL);
  const rawSocketUrl = socketUrl?.trim() || (isDeployedEnvironment ? '' : LOCAL_DOCKER_SOCKET_URL);

  const validateUrl = (name: string, value: string) => {
    let parsed: URL;
    try {
      parsed = new URL(value);
    } catch {
      throw new Error(`[ConfigurationError] ${name} must be a valid absolute URL.`);
    }
    if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname || parsed.username || parsed.password) {
      throw new Error(`[ConfigurationError] ${name} must be an HTTP(S) URL without embedded credentials.`);
    }
    if (isDeployedEnvironment && parsed.protocol !== 'https:') {
      throw new Error(`[ConfigurationError] ${name} must use HTTPS in staging and production.`);
    }
    return value.replace(/\/+$/, '');
  };

  if (!rawApiUrl) {
    throw new Error('[ConfigurationError] API_BASE_URL is required in staging and production.');
  }
  if (!rawSocketUrl) {
    throw new Error('[ConfigurationError] SOCKET_URL is required in staging and production.');
  }

  const resolvePlatformUrl = (value: string) => {
    if (platform === 'android') {
      if (value.includes('localhost')) return value.replace('localhost', '10.0.2.2');
      if (value.includes('127.0.0.1')) return value.replace('127.0.0.1', '10.0.2.2');
    }
    return value;
  };

  return {
    apiBaseUrl: resolvePlatformUrl(validateUrl('API_BASE_URL', rawApiUrl)),
    socketUrl: resolvePlatformUrl(validateUrl('SOCKET_URL', rawSocketUrl)),
    appEnvironment: environment as CompanionAppEnvironment,
  };
};

const endpoints = resolveCompanionEndpoints(
  configuredAppEnv,
  configuredApiUrl,
  configuredSocketUrl,
  Platform.OS,
);
const requestTimeoutMs = Number.parseInt(configuredTimeout || '15000', 10);
if (!Number.isFinite(requestTimeoutMs) || requestTimeoutMs <= 0) {
  throw new Error('[ConfigurationError] REQUEST_TIMEOUT_MS must be a positive number.');
}

export const ENV = {
  // 1. API & Backend Services (Auto-resolved for Android / iOS)
  API_BASE_URL: endpoints.apiBaseUrl,
  SOCKET_URL: endpoints.socketUrl,
  
  // 2. App Mode
  APP_ENV: endpoints.appEnvironment,
  IS_DEV: endpoints.appEnvironment === 'development',

  // 3. Integrations
  GOOGLE_MAPS_API_KEY: configuredMapsKey || '',
  RAZORPAY_KEY_ID: configuredRazorpayKey || '',

  // 4. Push Notifications (FCM)
  FCM_SENDER_ID: configuredFcmSenderId || '',
  FIREBASE_APP_ID: configuredFirebaseAppId || '',

  // 5. Config Defaults
  ENABLE_LOGGING: configuredLogging === 'true',
  DEFAULT_LANGUAGE: configuredLanguage || 'en',
  REQUEST_TIMEOUT_MS: requestTimeoutMs,
} as const;
