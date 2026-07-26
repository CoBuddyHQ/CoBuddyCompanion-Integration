/**
 * CoBuddy Companion App — Settings Store (Zustand)
 * Single source of truth for Notification Preferences and Privacy Controls.
 * UI preferences (dark mode, language, text size) live in uiStore to avoid duplication.
 */

import {create} from 'zustand';

// ─── Notification Preferences ─────────────────────────────────────────────────

export interface NotificationPrefs {
  [key: string]:     boolean; // index signature — allows state[item.key] lookups
  // Booking Requests
  new_booking_push:  boolean;
  new_booking_email: boolean;
  cancellations:     boolean;
  // Active Sessions & Safety
  session_reminder:  boolean;
  safety_alerts:     boolean; // always true — cannot be disabled
  // Earnings & Payouts
  payout_confirm:    boolean;
  earnings_summary:  boolean;
  // Marketing & Updates
  news_tips:         boolean;
  promo_email:       boolean;
}

// ─── Privacy Settings ─────────────────────────────────────────────────────────

export interface PrivacySettings {
  showAge:       boolean; // Show companion's exact age on profile
  allowPromo:    boolean; // Allow promotional messages from CoBuddy
  showInSearch:  boolean; // Allow profile to appear in search results
}

// ─── Store Interface ──────────────────────────────────────────────────────────

interface SettingsState {
  notificationPrefs: NotificationPrefs;
  privacySettings:   PrivacySettings;

  updateNotificationPrefs: (updates: Partial<NotificationPrefs>) => Promise<void>;
  updatePrivacySettings:   (updates: Partial<PrivacySettings>)   => Promise<void>;
  fetchSettings:           () => Promise<void>;
}

// ─── Default state ────────────────────────────────────────────────────────────
// safety_alerts is always ON (locked). showInSearch defaults ON (visible to customers).

const DEFAULT_NOTIF_PREFS: NotificationPrefs = {
  new_booking_push:  true,
  new_booking_email: true,
  cancellations:     true,
  session_reminder:  true,
  safety_alerts:     true,  // locked — always true
  payout_confirm:    true,
  earnings_summary:  true,
  news_tips:         true,
  promo_email:       false, // off by default
};

const DEFAULT_PRIVACY: PrivacySettings = {
  showAge:      true,
  allowPromo:   false,
  showInSearch: true,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSettingsStore = create<SettingsState>(set => ({
  notificationPrefs: DEFAULT_NOTIF_PREFS,
  privacySettings:   DEFAULT_PRIVACY,

  updateNotificationPrefs: async updates => {
    // Optimistic update
    set(state => ({
      notificationPrefs: {
        ...state.notificationPrefs,
        ...updates,
        safety_alerts: true, // enforce
      },
    }));
    try {
      const { SettingsService } = require('../../services/api/services/settings.service');
      await SettingsService.updateNotificationPrefs(updates);
    } catch (e) {
      // Ignore or revert on error
    }
  },

  updatePrivacySettings: async updates => {
    set(state => ({
      privacySettings: {...state.privacySettings, ...updates},
    }));
    try {
      const { SettingsService } = require('../../services/api/services/settings.service');
      await SettingsService.updatePrivacySettings(updates);
    } catch (e) {
      // Ignore or revert on error
    }
  },
  
  fetchSettings: async () => {
    try {
      const { SettingsService } = require('../../services/api/services/settings.service');
      const settings = await SettingsService.getSettings();
      set({
        notificationPrefs: { ...DEFAULT_NOTIF_PREFS, ...(settings.notificationPrefs || {}) },
        privacySettings: { ...DEFAULT_PRIVACY, ...(settings.privacySettings || {}) }
      });
    } catch (e) {
      // Ignore fetch error
    }
  }
}));
