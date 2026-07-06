/**
 * CoBuddy Companion App — Auth Store (Zustand)
 * Manages authentication state, PIN, biometric, and session token.
 * PRIVACY: No raw credentials stored. Token only. All PII stays masked.
 */

import {create} from 'zustand';

export type AuthStatus =
  | 'unauthenticated'       // Not logged in
  | 'onboarding'            // Auth done, onboarding (CPN-010→012) in progress
  | 'applying'              // Onboarding done, KYC/application in progress
  | 'pending_verification'  // Application submitted, awaiting review
  | 'active'                // Verified companion, full access
  | 'suspended'             // Account suspended
  | 'deactivated';          // Account deactivated

interface AuthState {
  authStatus: AuthStatus;
  companionId: string | null;
  token: string | null;
  pinSet: boolean;
  biometricEnabled: boolean;
  maskedPhone: string | null; // e.g. +91 ••••••7890
  hasCompletedOnboarding: boolean;

  // Actions
  setAuthStatus: (status: AuthStatus) => void;
  setToken: (token: string, companionId: string) => void;
  setMaskedPhone: (masked: string) => void;
  setPinSet: (val: boolean) => void;
  setBiometricEnabled: (val: boolean) => void;
  setHasCompletedOnboarding: (val: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  authStatus: 'unauthenticated',
  companionId: null,
  token: null,
  pinSet: false,
  biometricEnabled: false,
  maskedPhone: null,
  hasCompletedOnboarding: false,

  setAuthStatus: status => set({authStatus: status}),
  setToken: (token, companionId) => set({token, companionId}),
  setMaskedPhone: masked => set({maskedPhone: masked}),
  setPinSet: val => set({pinSet: val}),
  setBiometricEnabled: val => set({biometricEnabled: val}),
  setHasCompletedOnboarding: val => set({hasCompletedOnboarding: val}),
  logout: () =>
    set({
      authStatus: 'unauthenticated',
      companionId: null,
      token: null,
      pinSet: false,
      maskedPhone: null,
      hasCompletedOnboarding: false,
    }),
}));
