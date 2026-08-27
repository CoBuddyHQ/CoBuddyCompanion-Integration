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

const resolveUrl = (rawUrl: string): string => {
  if (Platform.OS === 'android' && rawUrl.includes('localhost')) {
    return rawUrl.replace('localhost', '10.0.2.2');
  }
  return rawUrl;
};

const rawApiUrl = configuredApiUrl || 'http://localhost:4001/api/v1';
const rawSocketUrl = configuredSocketUrl || 'http://localhost:4001';

export const ENV = {
  // 1. API & Backend Services (Auto-resolved for Android / iOS)
  API_BASE_URL: resolveUrl(rawApiUrl),
  SOCKET_URL: resolveUrl(rawSocketUrl),
  
  // 2. App Mode
  APP_ENV: configuredAppEnv || 'development',
  IS_DEV: (configuredAppEnv || 'development') === 'development',

  // 3. Integrations
  GOOGLE_MAPS_API_KEY: configuredMapsKey || '',
  RAZORPAY_KEY_ID: configuredRazorpayKey || '',

  // 4. Push Notifications (FCM)
  FCM_SENDER_ID: configuredFcmSenderId || '',
  FIREBASE_APP_ID: configuredFirebaseAppId || '',

  // 5. Config Defaults
  ENABLE_LOGGING: configuredLogging === 'true',
  DEFAULT_LANGUAGE: configuredLanguage || 'en',
  REQUEST_TIMEOUT_MS: parseInt(configuredTimeout || '15000', 10),
} as const;
