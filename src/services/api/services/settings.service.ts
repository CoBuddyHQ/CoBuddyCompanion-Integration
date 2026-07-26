/**
 * CoBuddy Companion — Settings API Service
 * Wraps all /companion/settings/* endpoints.
 */

import { apiGet, apiPut } from '../client';
import { Endpoints } from '../endpoints';
import type { NotificationPrefs, PrivacySettings } from '../../../store/slices/settingsStore';

export const SettingsService = {
  getSettings: () =>
    apiGet<{ notificationPrefs: NotificationPrefs; privacySettings: PrivacySettings }>(Endpoints.ACCOUNT.SETTINGS),

  updateNotificationPrefs: (dto: Partial<NotificationPrefs>) =>
    apiPut(Endpoints.ACCOUNT.NOTIFICATION_PREFS, dto),

  updatePrivacySettings: (dto: Partial<PrivacySettings>) =>
    apiPut(Endpoints.ACCOUNT.PRIVACY_CONTROLS, dto),
};
