/**
 * CoBuddy Companion — Production Flow Tracker & Reconciliation System
 *
 * Implements 3-Level State Management:
 *  - Level 1: UI Component State (forms, inputs, local selections, loading)
 *  - Level 2: Local Persistence (AsyncStorage - flow caching, active screen memory)
 *  - Level 3: Backend Authoritative State (the single source of truth from ProgressEngine)
 *
 * Rule: Backend state ALWAYS wins on conflict.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { KycService } from './api/services/kyc.service';
import { ProfileService } from './api/services/profile.service';
import { useAuthStore } from '../store/slices/authStore';
import { useApplicationStore } from '../store/slices/applicationStore';
import { Routes } from '../navigation/routes';
import type { OnboardingStatus } from '../store/types/store.types';

export type FlowType =
  | 'AUTH'
  | 'ONBOARDING'
  | 'APPLICATION'
  | 'KYC'
  | 'AVAILABILITY'
  | 'BOOKING'
  | 'SESSION'
  | 'PAYOUT';

export interface FlowState {
  flowType: FlowType;
  currentStep: string;
  completedSteps: string[];
  lastAttemptedStep?: string;
  lastSuccessfulStep?: string;
  lastUpdatedAt: string;
}

const FLOW_TRACKER_PREFIX = '@cb_flow_';
const ACTIVE_SCREEN_KEY = '@cb_active_screen';

export const FlowTracker = {
  /**
   * Diagnostic logger in development (Never logs sensitive PII)
   */
  log(flow: FlowType, screen: string, action: string, status: 'START' | 'SUCCESS' | 'FAILURE', details?: any) {
    if (__DEV__) {
      console.log(`[FlowTracker:${flow}] ${screen} → ${action} [${status}]`, details ?? '');
    }
  },

  /**
   * Level 2 Local Persistence: Save currently active screen so reload stays on exact screen
   */
  async saveActiveScreen(screenName: string): Promise<void> {
    try {
      await AsyncStorage.setItem(ACTIVE_SCREEN_KEY, screenName);
    } catch {
      // Non-critical local persistence failure
    }
  },

  /**
   * Level 2 Local Persistence: Get last active screen before reload
   */
  async getActiveScreen(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(ACTIVE_SCREEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Level 2 Local Persistence: Save cached flow state per companion ID
   */
  async saveFlowState(companionId: string, flowState: FlowState): Promise<void> {
    try {
      const key = `${FLOW_TRACKER_PREFIX}${companionId}_${flowState.flowType}`;
      await AsyncStorage.setItem(key, JSON.stringify(flowState));
    } catch {
      // Non-critical local caching failure
    }
  },

  /**
   * Level 2 Local Persistence: Get cached flow state for companion ID
   */
  async getFlowState(companionId: string, flowType: FlowType): Promise<FlowState | null> {
    try {
      const key = `${FLOW_TRACKER_PREFIX}${companionId}_${flowType}`;
      const raw = await AsyncStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Clear flow tracker for account logout/switching
   */
  async clearAccountFlows(companionId: string): Promise<void> {
    try {
      const flows: FlowType[] = [
        'AUTH',
        'ONBOARDING',
        'APPLICATION',
        'KYC',
        'AVAILABILITY',
        'BOOKING',
        'SESSION',
        'PAYOUT',
      ];
      const keys = flows.map((f) => `${FLOW_TRACKER_PREFIX}${companionId}_${f}`);
      keys.push(ACTIVE_SCREEN_KEY);
      await Promise.all(keys.map((k) => AsyncStorage.removeItem(k)));
    } catch {
      // Best-effort cleanup
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 3: AUTHORITATIVE RECONCILIATION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Reconcile Companion Application / KYC Progress against backend authoritative state.
   * Returns exact next screen to render and hydrates stores.
   */
  async reconcileApplicationProgress(): Promise<{
    screenName: string;
    authStatus: 'onboarding' | 'applying' | 'pending_verification' | 'active';
    onboardingStatus: OnboardingStatus | null;
  }> {
    try {
      const authStore = useAuthStore.getState();
      const appStore = useApplicationStore.getState();

      // Query authoritative KYC status & profile from backend
      const [kycRes, profileRes] = await Promise.allSettled([
        KycService.getKycStatus(),
        ProfileService.getProfile(),
      ]);

      const kycData = kycRes.status === 'fulfilled' ? kycRes.value : null;
      const profileData = profileRes.status === 'fulfilled' ? profileRes.value : null;

      if (!kycData?.onboardingStatus) {
        // Backend unavailable or initial state: return default entry
        return {
          screenName: appStore.applicationEntryRoute || Routes.JOURNEY_INTRO,
          authStatus: authStore.authStatus === 'unauthenticated' ? 'unauthenticated' as any : 'applying',
          onboardingStatus: null,
        };
      }

      const status = kycData.onboardingStatus;
      appStore.hydrateOnboardingStatus(status);

      if (profileData) {
        appStore.hydrateProfileData(profileData);
      }

      // 1. Check Terms Acceptance
      const termsAccepted = !!(
        status.termsAccepted ||
        (profileData as any)?.termsAccepted ||
        (profileData as any)?.boundariesAccepted
      );

      if (!termsAccepted) {
        return {
          screenName: Routes.TERMS_CONSENT,
          authStatus: 'onboarding',
          onboardingStatus: status,
        };
      }

      const verificationStatus = (status.verificationStatus || '').toLowerCase();
      const applicationStatus = (status.applicationStatus || '').toLowerCase();

      // 2. Verified & Approved Companion
      if (
        verificationStatus === 'approved' ||
        applicationStatus === 'approved' ||
        applicationStatus === 'published' ||
        applicationStatus === 'active'
      ) {
        return {
          screenName: Routes.HOME_DASHBOARD,
          authStatus: 'active',
          onboardingStatus: status,
        };
      }

      // 3. Pending Review
      if (
        verificationStatus === 'pending_review' ||
        applicationStatus === 'submitted' ||
        applicationStatus === 'under_review' ||
        applicationStatus === 'pending'
      ) {
        appStore.setApplicationEntryRoute(Routes.VERIFICATION_HUB as any);
        return {
          screenName: Routes.VERIFICATION_HUB,
          authStatus: 'pending_verification',
          onboardingStatus: status,
        };
      }

      // 4. Incomplete Application Checkpoint
      const targetRoute = status.resumeRoute || Routes.JOURNEY_INTRO;
      appStore.setApplicationEntryRoute(targetRoute as any);

      // Save flow state locally for offline caching
      if (authStore.companionId) {
        await this.saveFlowState(authStore.companionId, {
          flowType: 'APPLICATION',
          currentStep: status.currentStep || 'intro',
          completedSteps: status.completedSteps || [],
          lastUpdatedAt: new Date().toISOString(),
        });
      }

      return {
        screenName: targetRoute,
        authStatus: 'applying',
        onboardingStatus: status,
      };
    } catch {
      return {
        screenName: Routes.JOURNEY_INTRO,
        authStatus: 'applying',
        onboardingStatus: null,
      };
    }
  },
};
