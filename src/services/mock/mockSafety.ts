/**
 * CoBuddy Companion App — Mock Safety Data
 * Trusted contacts, safety timer state, incident reports.
 * PRIVACY: Contact phones stored as masked strings only.
 */

import type {TrustedContact, SafetyTimerState} from '../../store/types/store.types';

export const MOCK_TRUSTED_CONTACTS: TrustedContact[] = [
  {
    contactId: 'TC-001',
    name: 'Priya A.',                // First name + initial only
    maskedPhone: '+91 ••••••4521',
    relationship: 'Family',
    isEmergencyContact: true,
  },
  {
    contactId: 'TC-002',
    name: 'Rohit S.',
    maskedPhone: '+91 ••••••8832',
    relationship: 'Friend',
    isEmergencyContact: false,
  },
];

export const MOCK_SAFETY_TIMER_IDLE: SafetyTimerState = {
  status: 'idle',
  durationMinutes: 30,
  startedAt: null,
  expiresAt: null,
  sessionId: null,
};

export const MOCK_SAFETY_TIMER_ACTIVE: SafetyTimerState = {
  status: 'active',
  durationMinutes: 30,
  startedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // Started 10 min ago
  expiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(), // 20 min remaining
  sessionId: 'CB-SE-2047',
};
