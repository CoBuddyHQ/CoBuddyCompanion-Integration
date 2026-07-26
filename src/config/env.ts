/**
 * CoBuddy Companion — Centralized Environment Configuration
 * Provides strongly-typed access to all frontend environment variables.
 * Automatically resolves 'localhost' -> '10.0.2.2' on Android Emulators.
 */

import { Platform } from 'react-native';

declare const process: {
  env: {
    API_BASE_URL?: string;
    SOCKET_URL?: string;
    APP_ENV?: string;
    GOOGLE_MAPS_API_KEY?: string;
    RAZORPAY_KEY_ID?: string;
    FCM_SENDER_ID?: string;
    FIREBASE_APP_ID?: string;
    ENABLE_LOGGING?: string;
    DEFAULT_LANGUAGE?: string;
    REQUEST_TIMEOUT_MS?: string;
  };
};

const resolveUrl = (rawUrl: string): string => {
  if (Platform.OS === 'android' && rawUrl.includes('localhost')) {
    return rawUrl.replace('localhost', '10.0.2.2');
  }
  return rawUrl;
};

const rawApiUrl = process.env.API_BASE_URL || 'http://localhost:4001/api/v1';
const rawSocketUrl = process.env.SOCKET_URL || 'http://localhost:4001';

export const ENV = {
  // 1. API & Backend Services (Auto-resolved for Android / iOS)
  API_BASE_URL: resolveUrl(rawApiUrl),
  SOCKET_URL: resolveUrl(rawSocketUrl),
  
  // 2. App Mode
  APP_ENV: process.env.APP_ENV || 'development',
  IS_DEV: (process.env.APP_ENV || 'development') === 'development',

  // 3. Integrations
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',

  // 4. Push Notifications (FCM)
  FCM_SENDER_ID: process.env.FCM_SENDER_ID || '',
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || '',

  // 5. Config Defaults
  ENABLE_LOGGING: process.env.ENABLE_LOGGING === 'true',
  DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE || 'en',
  REQUEST_TIMEOUT_MS: parseInt(process.env.REQUEST_TIMEOUT_MS || '15000', 10),
} as const;
