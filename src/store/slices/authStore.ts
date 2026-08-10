/**
 * CoBuddy Companion App — Auth Store (Zustand)
 * ✅ INTEGRATED: Real API calls via AuthService.
 * Manages authentication state, tokens, PIN, biometric.
 * PRIVACY: No raw credentials stored. Tokens only. All PII masked.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureApiClient } from '../../services/api/client';
import { AuthService } from '../../services/api/services/auth.service';
import { KycService, ProfileService } from '../../services/api/services';
import { useApplicationStore } from './applicationStore';
import { useSessionStore } from './sessionStore';
import { useRequestStore } from './requestStore';
import { useEarningsStore } from './earningsStore';
import { useNotificationStore } from './notificationStore';
import { Routes } from '../../navigation/routes';



async function syncProgressWithBackend(): Promise<AuthStatus> {
  try {
    const [res, profile] = await Promise.all([
      KycService.getKycStatus().catch(() => null),
      ProfileService.getProfile().catch(() => null)
    ]);

    if (!res || !res.onboardingStatus) {
       return 'applying';
    }

    const { onboardingStatus } = res;
    
    // 1. Hydrate the frontend store completely
    const appStore = useApplicationStore.getState();
    appStore.hydrateOnboardingStatus(onboardingStatus);
    
    if (profile) {
      appStore.hydrateProfileData(profile);
    }

    const verificationStatus = (onboardingStatus.verificationStatus || '').toLowerCase();
    const applicationStatus = (onboardingStatus.applicationStatus || '').toLowerCase();

    // 2. Companion is verified/approved → Main Dashboard
    if (verificationStatus === 'approved' || applicationStatus === 'approved' || applicationStatus === 'published' || applicationStatus === 'active') {
      return 'active';
    }

    // 3. Application Pending Admin Review → Verification Review Pending
    if (verificationStatus === 'pending_review' || applicationStatus === 'submitted' || applicationStatus === 'under_review' || applicationStatus === 'pending') {
      // If they submitted, route to the hub instead of intro
      appStore.setApplicationEntryRoute(Routes.VERIFICATION_HUB as any);
      return 'pending_verification';
    }

    // 4. Rejected Application → Resubmit Verification Flow
    if (verificationStatus === 'rejected' || applicationStatus === 'rejected') {
      appStore.setApplicationEntryRoute(Routes.RESUBMIT_VERIFICATION as any);
      return 'applying';
    }

    // 5. Still applying — set applicationEntryRoute directly to backend resumeRoute
    // so on app reload/restart, the app lands DIRECTLY on the exact incomplete screen!
    if (onboardingStatus.hasStarted && onboardingStatus.resumeRoute) {
      appStore.setApplicationEntryRoute(onboardingStatus.resumeRoute as any);
    }

    return 'applying';
  } catch (err) {
    return 'applying';
  }
}





export type AuthStatus =
  | 'unauthenticated'       // Not logged in
  | 'onboarding'            // Auth done, onboarding (CPN-010→012) in progress
  | 'applying'              // Onboarding done, KYC/application in progress
  | 'pending_verification'  // Application submitted, awaiting review
  | 'active'                // Verified companion, full access
  | 'suspended'             // Account suspended
  | 'deactivated';          // Account deactivated

const K = {
  TOKEN:        '@cb:at',
  REFRESH:      '@cb:rt',
  COMPANION_ID: '@cb:cid',
  AUTH_STATUS:  '@cb:as',
};

interface AuthState {
  authStatus: AuthStatus;
  companionId: string | null;
  token: string | null;
  refreshToken: string | null;
  pinSet: boolean;
  biometricEnabled: boolean;
  maskedPhone: string | null;     // e.g. +91 ••••••7890
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  error: string | null;

  // ── API Actions ────────────────────────────────────────────────────────────
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string, deviceId?: string) => Promise<{
    isNewCompanion: boolean;
    profileStatus: string;
    hasPIN: boolean;
  }>;
  setPin: (pin: string, confirmPin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<void>;
  enrollBiometric: (deviceId: string, publicKey: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreAuth: () => Promise<void>;
  updateAccessToken: (newToken: string, newRefreshToken?: string) => void;

  // ── Simple setters ─────────────────────────────────────────────────────────
  setAuthStatus: (status: AuthStatus) => void;
  setToken: (token: string, companionId: string) => void;
  setMaskedPhone: (masked: string) => void;
  setPinSet: (val: boolean) => void;
  setBiometricEnabled: (val: boolean) => void;
  setHasCompletedOnboarding: (val: boolean) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authStatus: 'unauthenticated',
  companionId: null,
  token: null,
  refreshToken: null,
  pinSet: false,
  biometricEnabled: false,
  maskedPhone: null,
  hasCompletedOnboarding: false,
  isLoading: false,
  error: null,

  // ── sendOtp ────────────────────────────────────────────────────────────────
  sendOtp: async (phone) => {
    set({ isLoading: true, error: null });
    try {
      await AuthService.sendOtp({ phone });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to send OTP';
      set({ error: msg });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  // ── verifyOtp ──────────────────────────────────────────────────────────────
  verifyOtp: async (phone, otp, deviceId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await AuthService.verifyOtp({ phone, otp, deviceId });

      // Persist tokens one-by-one (RN AsyncStorage API)
      await AsyncStorage.setItem(K.TOKEN,        res.accessToken);
      await AsyncStorage.setItem(K.REFRESH,      res.refreshToken);
      await AsyncStorage.setItem(K.COMPANION_ID, res.companionId);
      await AsyncStorage.setItem(K.AUTH_STATUS,  res.profileStatus);

      // Set tokens in memory first so API client can use them for syncProgressWithBackend
      set({
        token: res.accessToken,
        refreshToken: res.refreshToken,
        companionId: res.companionId,
        maskedPhone: res.phone,
        pinSet: res.hasPIN,
      });

      // Wire API client with live token providers
      _wireApiClient(get);

      const calculatedStatus = await syncProgressWithBackend();

      // Finally update the auth status to trigger navigation
      set({
        authStatus: calculatedStatus,
      });

      return {
        isNewCompanion: res.isNewCompanion,
        profileStatus: res.profileStatus,
        hasPIN: res.hasPIN,
      };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'OTP verification failed';
      set({ error: msg });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  // ── setPin ─────────────────────────────────────────────────────────────────
  setPin: async (pin, confirmPin) => {
    set({ isLoading: true, error: null });
    try {
      await AuthService.setPin({ pin, confirmPin });
      set({ pinSet: true });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to set PIN';
      set({ error: msg });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  // ── verifyPin ──────────────────────────────────────────────────────────────
  verifyPin: async (pin) => {
    set({ isLoading: true, error: null });
    try {
      await AuthService.verifyPin({ pin });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Invalid PIN';
      set({ error: msg });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  // ── enrollBiometric ────────────────────────────────────────────────────────
  enrollBiometric: async (deviceId, publicKey) => {
    set({ isLoading: true, error: null });
    try {
      await AuthService.enrollBiometric({ deviceId, publicKey });
      set({ biometricEnabled: true });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to enroll biometric';
      set({ error: msg });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  // ── logout ─────────────────────────────────────────────────────────────────
  logout: async () => {
    try {
      await AuthService.logout();
    } catch {
      // Swallow — logout locally regardless
    }
    await AsyncStorage.removeItem(K.TOKEN);
    await AsyncStorage.removeItem(K.REFRESH);
    await AsyncStorage.removeItem(K.COMPANION_ID);
    await AsyncStorage.removeItem(K.AUTH_STATUS);
    
    useApplicationStore.getState().setApplicationEntryRoute(Routes.JOURNEY_INTRO as any);
    
    // Clear all stores to prevent old user data leakage or leftover state on logout
    useSessionStore.setState({
      upcomingSessions: [],
      sessionHistory: [],
      activeSession: null,
      liveElapsedSeconds: 0,
      safetyTimerActive: false,
      nextCheckInAt: null,
      chatMessages: [],
    });
    useRequestStore.setState({
      pendingRequests: [],
      reviewedRequests: [],
      selectedRequest: null,
      unreadCount: 0,
    });
    useEarningsStore.setState({
      availableBalance: 0,
      pendingClearance: 0,
      lifetimeEarnings: 0,
      recentTransactions: [],
    });
    useNotificationStore.setState({
      notifications: [],
      unreadCount: 0,
    });


    set({
      authStatus: 'unauthenticated',
      companionId: null,
      token: null,
      refreshToken: null,
      pinSet: false,
      maskedPhone: null,
      hasCompletedOnboarding: false,
      error: null,
    });
  },

  // ── restoreAuth — call in App.tsx on mount ─────────────────────────────────
  restoreAuth: async () => {
    try {
      const token       = await AsyncStorage.getItem(K.TOKEN);
      const refreshToken= await AsyncStorage.getItem(K.REFRESH);
      const companionId = await AsyncStorage.getItem(K.COMPANION_ID);

      if (token && companionId) {
        set({ token, refreshToken, companionId });
        _wireApiClient(get);

        const calculatedStatus = await syncProgressWithBackend();
        set({ authStatus: calculatedStatus });
        await AsyncStorage.setItem(K.AUTH_STATUS, calculatedStatus);
      }
    } catch {
      // AsyncStorage unavailable — start fresh
    }
  },

  // ── updateAccessToken — called by Axios interceptor after silent refresh ───
  updateAccessToken: (newToken: string, newRefreshToken?: string) => {
    set({
      token: newToken,
      ...(newRefreshToken ? { refreshToken: newRefreshToken } : {}),
    });
    AsyncStorage.setItem(K.TOKEN, newToken).catch(() => {});
    if (newRefreshToken) {
      AsyncStorage.setItem(K.REFRESH, newRefreshToken).catch(() => {});
    }
  },

  // ── Simple setters ─────────────────────────────────────────────────────────
  setAuthStatus: status => set({ authStatus: status }),
  setToken: (token, companionId) => set({ token, companionId }),
  setMaskedPhone: masked => set({ maskedPhone: masked }),
  setPinSet: val => set({ pinSet: val }),
  setBiometricEnabled: val => set({ biometricEnabled: val }),
  setHasCompletedOnboarding: val => set({ hasCompletedOnboarding: val }),
  setLoading: v => set({ isLoading: v }),
  setError: e => set({ error: e }),
}));

// ─── Helper — wire API client (avoids circular dep) ───────────────────────────
function _wireApiClient(get: () => AuthState) {
  configureApiClient({
    getToken: () => get().token,
    getRefreshToken: () => get().refreshToken,
    onUnauthorized: () => get().logout(),
    onTokenRefreshed: (newToken, newRefreshToken) => get().updateAccessToken(newToken, newRefreshToken),
    onOnboardingStatusReceived: (status) => useApplicationStore.getState().hydrateOnboardingStatus(status),
  });
}
