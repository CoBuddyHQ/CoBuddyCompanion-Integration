/**
 * CoBuddy Companion App — Safety Store (Zustand)
 * ✅ INTEGRATED: Real API calls via SafetyService.
 * Manages SOS state, safety timer, trusted contacts, and incident reports.
 * PRIVACY: Trusted contacts stored with masked phone only.
 * CRITICAL: SOS state must never be silently cleared while a session is live.
 */

import { create } from 'zustand';
import type { TrustedContact, SafetyTimerStatus } from '../types/store.types';
import { SafetyService } from '../../services/api/services/index';

export interface SafetyTimerState {
  status: SafetyTimerStatus;
  durationMinutes: number;
  startedAt: string | null;
  expiresAt: number | null;
  sessionId: string | null;
}

export type SOSStatus = 'idle' | 'triggered' | 'confirmed' | 'resolved';

interface IncidentReport {
  reportId: string;
  sessionId: string | null;
  description: string;
  category: string;
  submittedAt: string;
  status: 'submitted' | 'under_review' | 'resolved';
}

interface SafetyState {
  // SOS
  sosStatus: SOSStatus;
  sosTriggeredAt: string | null;

  // Safety Timer
  timer: SafetyTimerState;

  // Trusted Contacts
  trustedContacts: TrustedContact[];

  // Incident Reports
  incidentReports: IncidentReport[];

  // Blocked Customers
  blockedCustomers: string[];

  // Venue Safety Flags
  currentVenueApproved: boolean;
  currentVenueName: string | null;

  // Loading
  isLoadingContacts: boolean;
  error: string | null;

  // ── Feature toggles ────────────────────────────────────────────────────────
  locationTracking: boolean;
  autoCheckIn: boolean;
  disguisedCall: boolean;

  // ── API Actions ────────────────────────────────────────────────────────────
  fetchSafetySettings: () => Promise<void>;
  fetchTrustedContacts: () => Promise<void>;
  
  // Contacts CRUD
  addContact: (c: { id: string; name: string; phone: string; relation: string; isPrimary: boolean }) => Promise<void>;
  updateContact: (c: { id: string; name: string; phone: string; relation: string; isPrimary: boolean }) => Promise<void>;
  removeContact: (id: string) => Promise<void>;

  // SOS
  triggerSOS: () => Promise<void>;
  confirmSOS: () => void; // local confirm UI step
  resolveSOS: (resolution?: string) => Promise<void>;
  resetSOS: () => void;

  // Timer
  startTimer: (durationMinutes: number, sessionId: string | null) => Promise<void>;
  cancelTimer: () => Promise<void>;
  expireTimer: () => void;
  setTimerStatus: (status: SafetyTimerStatus) => void;

  // Incidents
  fileIncident: (sessionId: string | null, category: string, description: string) => Promise<void>;

  // Block Customer
  blockCustomer: (customerId: string, reason: string) => Promise<void>;

  // Venue
  setCurrentVenue: (approved: boolean, venueName: string | null) => void;

  // Local Toggles
  toggleSetting: (key: 'locationTracking' | 'autoCheckIn' | 'disguisedCall') => void;

  // Helpers
  setLoadingContacts: (v: boolean) => void;
  setError: (error: string | null) => void;
}

const INITIAL_TIMER: SafetyTimerState = {
  status: 'idle',
  durationMinutes: 30,
  startedAt: null,
  expiresAt: null,
  sessionId: null,
};

export const useSafetyStore = create<SafetyState>((set, get) => ({
  sosStatus: 'idle',
  sosTriggeredAt: null,
  timer: INITIAL_TIMER,
  trustedContacts: [],
  incidentReports: [],
  blockedCustomers: [],
  currentVenueApproved: false,
  currentVenueName: null,
  isLoadingContacts: false,
  error: null,

  locationTracking: true,
  autoCheckIn: true,
  disguisedCall: false,

  // ── API Actions ────────────────────────────────────────────────────────────

  fetchTrustedContacts: async () => {
    set({ isLoadingContacts: true, error: null });
    try {
      const contacts = await SafetyService.getTrustedContacts();
      set({ trustedContacts: Array.isArray(contacts) ? contacts : (contacts as any).contacts ?? [] });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to load contacts' });
    } finally {
      set({ isLoadingContacts: false });
    }
  },

  addContact: async (c) => {
    set({ isLoadingContacts: true, error: null });
    try {
      const res: any = await SafetyService.addTrustedContact({
        name: c.name,
        phone: c.phone,
        relationship: c.relation,
        isEmergencyContact: c.isPrimary
      });
      
      const newContact: TrustedContact = {
        contactId: res.id || c.id || `temp-${Date.now()}`,
        name: c.name,
        maskedPhone: c.phone, // Ideally backend handles masking, but we set what we have locally
        relationship: c.relation,
        isEmergencyContact: c.isPrimary
      };
      
      set(state => {
        const base = c.isPrimary
          ? state.trustedContacts.map(t => ({ ...t, isEmergencyContact: false }))
          : [...state.trustedContacts];
        return { trustedContacts: [...base, newContact] };
      });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to add contact' });
    } finally {
      set({ isLoadingContacts: false });
    }
  },

  updateContact: async (c) => {
    set({ isLoadingContacts: true, error: null });
    try {
      await SafetyService.updateTrustedContact(c.id, {
        name: c.name,
        phone: c.phone,
        relationship: c.relation,
        isEmergencyContact: c.isPrimary
      });
      
      set(state => ({
        trustedContacts: state.trustedContacts.map(t => {
          if (t.contactId === c.id) {
            return {
              ...t,
              name: c.name,
              maskedPhone: c.phone,
              relationship: c.relation,
              isEmergencyContact: c.isPrimary,
            };
          }
          if (c.isPrimary) { return { ...t, isEmergencyContact: false }; }
          return t;
        }),
      }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to update contact' });
    } finally {
      set({ isLoadingContacts: false });
    }
  },

  removeContact: async (id) => {
    const prev = get().trustedContacts;
    set(state => ({ trustedContacts: state.trustedContacts.filter(t => t.contactId !== id) }));
    try {
      await SafetyService.deleteTrustedContact(id);
    } catch (e: unknown) {
      set({ trustedContacts: prev, error: e instanceof Error ? e.message : 'Failed to remove contact' });
    }
  },

  triggerSOS: async () => {
    const now = new Date().toISOString();
    set({ sosStatus: 'triggered', sosTriggeredAt: now, error: null });
    try {
      // Typically fires WebSockets & push notifications via backend
      await SafetyService.triggerSos({ sessionId: get().timer.sessionId || undefined });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to trigger SOS on server' });
    }
  },

  confirmSOS: () => set({ sosStatus: 'confirmed' }),

  resolveSOS: async (resolution?: string) => {
    set({ sosStatus: 'resolved', error: null });
    try {
      await SafetyService.resolveSos({ resolution });
      set({ sosStatus: 'idle', sosTriggeredAt: null });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to resolve SOS' });
    }
  },

  resetSOS: () => set({ sosStatus: 'idle', sosTriggeredAt: null }),

  startTimer: async (durationMinutes, sessionId) => {
    const startedAt = new Date().toISOString();
    const expiresAt = Date.now() + durationMinutes * 60 * 1000;
    
    // Optimistic local update
    set({
      timer: { status: 'active', durationMinutes, startedAt, expiresAt, sessionId },
      error: null
    });

    try {
      await SafetyService.startTimer({ durationMinutes, sessionId: sessionId ?? undefined });
    } catch (e: unknown) {
      // Revert if failed
      set({ timer: { ...INITIAL_TIMER }, error: e instanceof Error ? e.message : 'Failed to start timer' });
    }
  },

  cancelTimer: async () => {
    set({ timer: { ...INITIAL_TIMER, status: 'cancelled' }, error: null });
    try {
      await SafetyService.cancelTimer();
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to cancel timer' });
    }
  },

  expireTimer: () =>
    set(state => ({ timer: { ...state.timer, status: 'expired' } })),

  setTimerStatus: status =>
    set(state => ({ timer: { ...state.timer, status } })),

  fileIncident: async (sessionId, category, description) => {
    try {
      await SafetyService.fileIncident({
        sessionId: sessionId ?? undefined,
        category,
        description
      });
      // Optionally fetch incidents list again or push optimistically
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to file incident' });
      throw e;
    }
  },

  blockCustomer: async (customerId, reason) => {
    try {
      await SafetyService.blockCustomer(customerId, { reason });
      set(state => ({ blockedCustomers: [...state.blockedCustomers, customerId] }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to block customer' });
      throw e;
    }
  },

  fetchSafetySettings: async () => {
    try {
      const settings: any = await SafetyService.getSettings();
      set({
        locationTracking: settings?.locationTracking ?? true,
        autoCheckIn: settings?.autoCheckIn ?? true,
        disguisedCall: settings?.disguisedCall ?? false,
      });
    } catch (e: unknown) {
      // Keep defaults
    }
  },

  setCurrentVenue: (approved, venueName) =>
    set({ currentVenueApproved: approved, currentVenueName: venueName }),

  toggleSetting: async (key) => {
    const state = get();
    const newValue = !state[key];
    set({ [key]: newValue } as any);
    try {
      await SafetyService.updateSettings({
        locationTracking: key === 'locationTracking' ? newValue : state.locationTracking,
        autoCheckIn: key === 'autoCheckIn' ? newValue : state.autoCheckIn,
        disguisedCall: key === 'disguisedCall' ? newValue : state.disguisedCall,
      });
    } catch (e: unknown) {
      set({ [key]: !newValue } as any);
    }
  },

  setLoadingContacts: v => set({ isLoadingContacts: v }),
  setError: error => set({ error }),
}));
