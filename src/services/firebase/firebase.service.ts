/**
 * CoBuddy Companion — Firebase Service
 * Handles:
 *  1. Firebase Phone Authentication (OTP) — for production
 *  2. Firebase Cloud Messaging (FCM) — Push Notifications
 *  3. Token registration with backend
 *
 * Development mode: Falls back to backend Redis OTP (123456)
 * Production mode:  Uses Firebase Phone Auth
 */

import { Platform } from 'react-native';
import { NotificationsService } from '../api/services/index';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FcmNotification {
  title?: string;
  body?: string;
  data?: Record<string, string>;
}

// ─── Firebase Module Loader (lazy — avoids crash if package missing) ──────────

let _messaging: any = null;
let _auth: any = null;

async function getMessaging() {
  if (_messaging) return _messaging;
  try {
    const mod = require('@react-native-firebase/messaging');
    _messaging = mod.default ?? mod;
    return _messaging;
  } catch {
    console.warn('[Firebase] @react-native-firebase/messaging not available — FCM disabled');
    return null;
  }
}

async function getAuth() {
  if (_auth) return _auth;
  try {
    const mod = require('@react-native-firebase/auth');
    _auth = mod.default ?? mod;
    return _auth;
  } catch {
    console.warn('[Firebase] @react-native-firebase/auth not available — Firebase Auth disabled');
    return null;
  }
}

// ─── FCM Service ──────────────────────────────────────────────────────────────

class FirebaseService {
  private fcmToken: string | null = null;
  private unsubscribeForeground: (() => void) | null = null;
  private onNotificationCallback: ((notif: FcmNotification) => void) | null = null;

  /**
   * Initialize Firebase services.
   * Call once on app startup after authentication succeeds.
   */
  async initialize(onNotification?: (notif: FcmNotification) => void): Promise<void> {
    this.onNotificationCallback = onNotification ?? null;
    await this.requestPermission();
    await this.registerFcmToken();
    this.setupForegroundHandler();
    this.setupBackgroundHandler();
  }

  /**
   * Request notification permission from device.
   * Required on iOS; Android 13+ also requires it.
   */
  async requestPermission(): Promise<boolean> {
    const messaging = await getMessaging();
    if (!messaging) return false;

    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus?.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus?.PROVISIONAL ||
        authStatus === 1 || authStatus === 2; // Fallback numeric values
      console.log('[FCM] Permission status:', authStatus, '| Enabled:', enabled);
      return enabled;
    } catch (err) {
      console.warn('[FCM] Permission request failed:', err);
      return false;
    }
  }

  /**
   * Get FCM device token and register with backend.
   * The backend stores this token in `push_tokens` table for notification targeting.
   */
  async registerFcmToken(): Promise<string | null> {
    const messaging = await getMessaging();
    if (!messaging) return null;

    try {
      const token = await messaging().getToken();
      if (token && token !== this.fcmToken) {
        this.fcmToken = token;
        const platform = Platform.OS === 'ios' ? 'ios' : 'android';
        await NotificationsService.registerPushToken(token, platform);
        console.log('[FCM] Token registered:', token.slice(0, 20) + '...');
      }
      return token;
    } catch (err) {
      console.warn('[FCM] Token registration failed:', err);
      return null;
    }
  }

  /**
   * Handle foreground notifications (app is open).
   * Shows in-app alert / updates notification store.
   */
  setupForegroundHandler(): void {
    getMessaging().then((messaging) => {
      if (!messaging) return;
      if (this.unsubscribeForeground) this.unsubscribeForeground();

      this.unsubscribeForeground = messaging().onMessage(async (remoteMessage: any) => {
        const notif: FcmNotification = {
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          data: remoteMessage.data,
        };
        console.log('[FCM] Foreground message received:', notif.title);
        this.onNotificationCallback?.(notif);
      });
    });
  }

  /**
   * Handle background/quit state notification opens.
   * Called when user taps on a push notification.
   */
  setupBackgroundHandler(): void {
    getMessaging().then((messaging) => {
      if (!messaging) return;

      // Background message handler (must be registered at top level)
      messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
        console.log('[FCM] Background message:', remoteMessage.notification?.title);
      });

      // Notification opened from quit state
      messaging()
        .getInitialNotification()
        .then((remoteMessage: any) => {
          if (remoteMessage) {
            console.log('[FCM] App opened from quit notification:', remoteMessage.notification?.title);
          }
        });

      // Notification opened while app was in background
      messaging().onNotificationOpenedApp((remoteMessage: any) => {
        console.log('[FCM] App opened from background notification:', remoteMessage.notification?.title);
      });
    });
  }

  /**
   * Refresh FCM token (call on auth state changes or app restart).
   */
  async refreshToken(): Promise<string | null> {
    this.fcmToken = null;
    return this.registerFcmToken();
  }

  /**
   * Clean up listeners on logout.
   */
  cleanup(): void {
    if (this.unsubscribeForeground) {
      this.unsubscribeForeground();
      this.unsubscribeForeground = null;
    }
    this.fcmToken = null;
    this.onNotificationCallback = null;
    console.log('[FCM] Cleaned up');
  }

  // ─── Firebase Phone Auth ────────────────────────────────────────────────────

  /**
   * Send OTP via Firebase Phone Auth.
   * Used in PRODUCTION mode when FIREBASE_AUTH_ENABLED=true.
   * In development, backend handles OTP with Redis bypass (123456).
   */
  async sendPhoneOtp(phoneNumber: string): Promise<any | null> {
    const auth = await getAuth();
    if (!auth) return null;

    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      console.log('[Firebase Auth] OTP sent to:', phoneNumber);
      return confirmation;
    } catch (err) {
      console.warn('[Firebase Auth] sendPhoneOtp failed:', err);
      return null;
    }
  }

  /**
   * Verify OTP with Firebase Phone Auth confirmation object.
   */
  async verifyPhoneOtp(confirmation: any, otp: string): Promise<any | null> {
    if (!confirmation) return null;
    try {
      const userCredential = await confirmation.confirm(otp);
      const idToken = await userCredential.user.getIdToken();
      console.log('[Firebase Auth] OTP verified successfully');
      return { idToken, uid: userCredential.user.uid };
    } catch (err) {
      console.warn('[Firebase Auth] verifyPhoneOtp failed:', err);
      return null;
    }
  }
}

export const firebaseService = new FirebaseService();
